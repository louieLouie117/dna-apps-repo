import React, { useState, useEffect } from 'react';
import supabase from '../config/SupaBaseClient';
import emailjs from '@emailjs/browser';


// Add CSS keyframes for spinner animation
const spinnerKeyframes = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;

// Inject the keyframes into the document head
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = spinnerKeyframes;
    document.head.appendChild(style);
}

// email js import
const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const GetSupabaseData = () => {


    const [accounts, setAccounts] = useState([]);
    const [customerContacts, setCustomerContacts] = useState([]);
    const [issueReports, setIssueReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showReplyForm, setShowReplyForm] = useState(null);
    const [replyFormData, setReplyFormData] = useState({
        email: '',
        subject: '',
        message: ''
    });
    const [submittingReply, setSubmittingReply] = useState(false);
    const [editingIds, setEditingIds] = useState({});
    const [submittingIds, setSubmittingIds] = useState({});
    const [statusFilter, setStatusFilter] = useState('all');
    const [activityFilter, setActivityFilter] = useState('all');

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            
            // Fetch all data in parallel
            const [usersResult, contactsResult, issuesResult] = await Promise.all([
                supabase
                    .from('Users')
                    .select('*')
                    .order('created_at', { ascending: false }),
                    // .limit(50),
                supabase
                    .from('CustomerContact')
                    .select('email, created_at, subject, message, payment_method, status, message_by')
                    .order('created_at', { ascending: false }),
                supabase
                    .from('IssueReporting')
                    .select('email, created_at, known_issue, description, apps_affected')
                    .order('created_at', { ascending: false })
            ]);

            if (usersResult.error) throw usersResult.error;
            if (contactsResult.error) throw contactsResult.error;
            if (issuesResult.error) throw issuesResult.error;

            // Sort users with priority order: Request to Unsubscribed > Active > Unsubscribed > Others
            const sortedUsers = (usersResult.data || []).sort((a, b) => {
                const statusPriority = {
                    'Request to Unsubscribed': 1,
                    'Active': 2,
                    'Unsubscribed': 3
                };
                
                const aPriority = statusPriority[a.status] || 99;
                const bPriority = statusPriority[b.status] || 99;
                
                // First sort by status priority
                if (aPriority !== bPriority) {
                    return aPriority - bPriority;
                }
                
                // Then sort by created_at (newest first) within same priority
                return new Date(b.created_at) - new Date(a.created_at);
            });

            setAccounts(sortedUsers);
            setCustomerContacts(contactsResult.data || []);
            setIssueReports(issuesResult.data || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to check if user has sent contacts
    const getUserContacts = (email) => {
        return customerContacts.filter(contact => contact.email === email);
    };

    // Function to check if user has sent issue reports
    const getUserIssueReports = (email) => {
        return issueReports.filter(report => report.email === email);
    };

    // Function to get user activity summary
    const getUserActivitySummary = (email) => {
        const contacts = getUserContacts(email);
        const issues = getUserIssueReports(email);
        
        return {
            hasContacts: contacts.length > 0,
            contactCount: contacts.length,
            hasIssues: issues.length > 0,
            issueCount: issues.length,
            totalActivity: contacts.length + issues.length,
            latestContact: contacts.length > 0 ? new Date(Math.max(...contacts.map(c => new Date(c.created_at)))) : null,
            latestIssue: issues.length > 0 ? new Date(Math.max(...issues.map(i => new Date(i.created_at)))) : null
        };
    };

    // Function to handle reply form
    const handleReplyToUser = (userEmail) => {
        setReplyFormData({
            email: userEmail,
            subject: '',
            message: ''
        });
        setShowReplyForm(userEmail);
    };

    // Function to handle form input changes
    const handleReplyFormChange = (e) => {
        const { name, value } = e.target;
        setReplyFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Function to submit reply
    const handleSubmitReply = async (e) => {
        e.preventDefault();
        
        if (!replyFormData.subject.trim() || !replyFormData.message.trim()) {
            alert('Please fill in both subject and message fields.');
            return;
        }

        try {
            setSubmittingReply(true);
            
            // Insert reply into CustomerContact table
            const { data, error } = await supabase
                .from('CustomerContact')
                .insert([
                    {
                        email: replyFormData.email,
                        subject: replyFormData.subject.trim(),
                        message: replyFormData.message.trim(),
                        message_by: 'Support Team'
                    }
                ]);

            if (error) {
                throw error;
            }

            alert('Reply sent successfully! The response has been saved to the database.');
            
            // Reset form and close modal
            setReplyFormData({
                email: '',
                subject: '',
                message: ''
            });
            setShowReplyForm(null);

            // send notification email to user of message using emailjs
            emailjs.send(
                serviceId, 
                templateId, {
                to_email: replyFormData.email,
                subject: replyFormData.subject,
                message: replyFormData.message
            }, publicKey);

            // Reload all data to show the new reply in CustomerContact
            fetchAllData();

        } catch (error) {
            console.error('Error sending reply:', error);
            alert(`Error sending reply: ${error.message}`);
        } finally {
            setSubmittingReply(false);
        }
    };

    // Function to cancel reply
    const handleCancelReply = () => {
        setReplyFormData({
            email: '',
            subject: '',
            message: ''
        });
        setShowReplyForm(null);
    };

    // Function to handle status change
    const handleStatusChange = async (userId, newStatus) => {
        if (newStatus === 'Unsubscribed') {
            // Get the user's email for the unsubscription process
            const userEmail = accounts.find(acc => acc.id === userId)?.email;
            
            if (!userEmail) {
                alert('Error: Could not find user email for unsubscription notification.');
                return;
            }

            try {
                // Send email notification to user that they have been unsubscribed
                await emailjs.send(
                    serviceId,
                    templateId, {
                        to_email: userEmail,
                        subject: 'Unsubscription Confirmation - All App Access',
                        message: 'You have been unsubscribed from our All App Access. You will no longer be charged. If this was a mistake, please contact support to reactivate your subscription.'
                    }, publicKey);

                // Add to Supabase CustomerContact table the unsubscription record
                const { error } = await supabase
                    .from('CustomerContact')
                    .insert([
                        {
                            email: userEmail,
                            subject: 'Unsubscription Confirmation',
                            message: 'You have been unsubscribed from our All App Access. You will no longer be charged. If this was a mistake, please contact support to reactivate your subscription.',
                            message_by: 'Support Team'
                        }
                    ]);

                if (error) {
                    console.error('Error inserting unsubscription record:', error);
                    alert('Warning: Unsubscription record could not be saved to database.');
                } else {
                    alert('Email confirmation sent successfully and unsubscription recorded.');
                }
            } catch (emailError) {
                console.error('Error sending unsubscription email:', emailError);
                alert('Warning: Email notification could not be sent, but status will still be updated.');
            }
            
            // Reload all data to show the new unsubscription record in CustomerContact
            fetchAllData();
        }
          

        try {
            const { error } = await supabase
                .from('Users')
                .update({ status: newStatus })
                .eq('id', userId);

            if (error) {
                throw error;
            }

            // Update local state
            setAccounts(accounts.map(account => 
                account.id === userId ? { ...account, status: newStatus } : account
            ));

            alert(`User status updated to "${newStatus}" successfully!`);
        } catch (error) {
            console.error('Error updating status:', error);
            alert(`Error updating status: ${error.message}`);
        }
    };

    // Function to handle ID form changes
    const handleIdFormChange = (userId, field, value) => {
        setEditingIds(prev => ({
            ...prev,
            [userId]: {
                ...prev[userId],
                [field]: value
            }
        }));
    };

    // Function to submit ID updates
    const handleUpdateIds = async (e, userId) => {
        e.preventDefault();
        
        const updates = editingIds[userId];
        if (!updates) return;

        try {
            setSubmittingIds(prev => ({ ...prev, [userId]: true }));
            
            const { error } = await supabase
                .from('Users')
                .update({
                    customer_id: updates.customer_id || null,
                    sub_id: updates.sub_id || null
                })
                .eq('id', userId);

            if (error) {
                throw error;
            }

            // Update local state
            setAccounts(accounts.map(account => 
                account.id === userId ? { 
                    ...account, 
                    customer_id: updates.customer_id || account.customer_id,
                    sub_id: updates.sub_id || account.sub_id
                } : account
            ));

            // Clear editing state for this user
            setEditingIds(prev => {
                const newState = { ...prev };
                delete newState[userId];
                return newState;
            });

            alert('Customer ID and Sub ID updated successfully!');
        } catch (error) {
            console.error('Error updating IDs:', error);
            alert(`Error updating IDs: ${error.message}`);
        } finally {
            setSubmittingIds(prev => ({ ...prev, [userId]: false }));
        }
    };

    // Function to initialize editing state
    const initializeIdEditing = (userId, currentCustomerId, currentSubId) => {
        setEditingIds(prev => ({
            ...prev,
            [userId]: {
                customer_id: currentCustomerId || '',
                sub_id: currentSubId || ''
            }
        }));
    };

    // Function to filter accounts based on selected filters
    const getFilteredAccounts = () => {
        let filtered = [...accounts];

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(account => account.status === statusFilter);
        }

        // Filter by activity
        if (activityFilter !== 'all') {
            filtered = filtered.filter(account => {
                const activity = getUserActivitySummary(account.email);
                if (activityFilter === 'with-activity') {
                    return activity.totalActivity > 0;
                } else if (activityFilter === 'no-activity') {
                    return activity.totalActivity === 0;
                }
                return true;
            });
        }

        return filtered;
    };

    const filteredAccounts = getFilteredAccounts();

    // Function to render user card (extracted to avoid duplication)
    const renderUserCard = (account) => {
        const activity = getUserActivitySummary(account.email);
        return (
            <div key={account.id} style={styles.userCard}>
                <div style={styles.userMeta}>
                    <small style={styles.joinDate}>
                        Joined: {new Date(account.created_at).toLocaleDateString()}
                    </small>
                </div>
                <div style={styles.userHeader}>
                    <div style={styles.userInfo}>
                        <h3 style={styles.userEmail}>{account.email}</h3>
                        
                        <select
                            value={account.status || 'Unknown'}
                            onChange={(e) => handleStatusChange(account.id, e.target.value)}
                            style={{
                                ...styles.statusDropdown,
                                backgroundColor: getStatusColor(account.status)
                            }}
                        >
                            <option value="Active">Active</option>
                            <option value="Request to Unsubscribed">Request to Unsubscribed</option>
                            <option value="Unsubscribed">Unsubscribed</option>
                            <option value="Pending Verification">Pending Verification</option>
                            <option value="Request to Active">Request to Active</option>
                            <option value="Subscription Has been Paused">Subscription Has been Paused</option>
                            <option value="Request to Pause Subscription">Request to Pause Subscription</option>
                        </select>

                        <div style={styles.idFormContainer}>
                            <form 
                                onSubmit={(e) => handleUpdateIds(e, account.id)}
                                style={styles.idForm}
                            >
                                <div style={styles.formField}>
                                    <label style={styles.idFormLabel}>Customer ID:</label>
                                    <input 
                                        type="text" 
                                        value={editingIds[account.id]?.customer_id ?? (account.customer_id || '')}
                                        onChange={(e) => {
                                            if (!editingIds[account.id]) {
                                                initializeIdEditing(account.id, account.customer_id, account.sub_id);
                                            }
                                            handleIdFormChange(account.id, 'customer_id', e.target.value);
                                        }}
                                        style={styles.idFormInput}
                                        placeholder="Enter Customer ID"
                                    />
                                </div>
                                <div style={styles.formField}>
                                    <label style={styles.idFormLabel}>Sub ID:</label>
                                    <input 
                                        type="text" 
                                        value={editingIds[account.id]?.sub_id ?? (account.sub_id || '')}
                                        onChange={(e) => {
                                            if (!editingIds[account.id]) {
                                                initializeIdEditing(account.id, account.customer_id, account.sub_id);
                                            }
                                            handleIdFormChange(account.id, 'sub_id', e.target.value);
                                        }}
                                        style={styles.idFormInput}
                                        placeholder="Enter Sub ID"
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    style={{
                                        ...styles.idFormSubmit,
                                        opacity: submittingIds[account.id] ? 0.6 : 1,
                                        cursor: submittingIds[account.id] ? 'not-allowed' : 'pointer'
                                    }}
                                    disabled={submittingIds[account.id]}
                                >
                                    {submittingIds[account.id] ? 'Updating...' : 'Update IDs'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div style={styles.activitySection}>
                    <h4 style={styles.activityTitle}>Activity Summary</h4>
                    <div style={styles.activityGrid}>
                        <div style={{
                            ...styles.activityCard,
                            backgroundColor: activity.hasContacts ? '#dcfce7' : '#f3f4f6'
                        }}>
                            <div style={styles.activityIcon}>📞</div>
                            <div style={styles.activityDetails}>
                                <span style={styles.activityCount}>
                                    {activity.contactCount}
                                </span>
                                <span style={styles.activityLabel}>Contacts</span>
                            </div>
                        </div>

                        <div style={{
                            ...styles.activityCard,
                            backgroundColor: activity.hasIssues ? '#fef3c7' : '#f3f4f6'
                        }}>
                            <div style={styles.activityIcon}>🐛</div>
                            <div style={styles.activityDetails}>
                                <span style={styles.activityCount}>
                                    {activity.issueCount}
                                </span>
                                <span style={styles.activityLabel}>Issues</span>
                            </div>
                        </div>
                    </div>

                    {activity.totalActivity > 0 && (
                        <div style={styles.lastActivitySection}>
                            <strong style={styles.lastActivityLabel}>Last Activity:</strong>
                            <div style={styles.lastActivityDetails}>
                                {activity.latestContact && (
                                    <span style={styles.lastActivityItem}>
                                        📞 Contact: {activity.latestContact.toLocaleDateString()}
                                    </span>
                                )}
                                {activity.latestIssue && (
                                    <span style={styles.lastActivityItem}>
                                        🐛 Issue: {activity.latestIssue.toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {activity.totalActivity === 0 && (
                        <div style={styles.noActivitySection}>
                            <span style={styles.noActivityText}>
                                No contact or issue activity yet
                            </span>
                        </div>
                    )}
                </div>

                {/* Render Individual Contacts */}
                {activity.hasContacts && (
                    <div style={styles.detailsSection}>
                        <h4 style={styles.detailsTitle}>
                            📞 Customer Contacts ({activity.contactCount})
                        </h4>
                        <div style={styles.itemsList}>
                            {getUserContacts(account.email).map((contact, index) => (
                                <div key={`contact-${index}`} style={styles.activityItem}>
                                    <div style={styles.itemHeader}>
                                        <span style={styles.itemBy}>
                                            By: {contact.message_by || "Customer"}
                                        </span>
                                        <span style={styles.itemDate}>
                                            {new Date(contact.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div style={styles.itemContent}>
                                        <strong style={styles.itemSubject}>
                                            Subject: {contact.subject}
                                        </strong>
                                        {contact.message && (
                                            <p style={styles.itemDescription}>{contact.message}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <button 
                                style={styles.replyButton}
                                onClick={() => handleReplyToUser(account.email)}
                            >
                                Reply to User
                            </button>
                        </div>
                    </div>
                )}

                {/* Render Individual Issue Reports */}
                {activity.hasIssues && (
                    <div style={styles.detailsSection}>
                        <h4 style={styles.detailsTitle}>
                            🐛 Issue Reports ({activity.issueCount})
                        </h4>
                        <div style={styles.itemsList}>
                            {getUserIssueReports(account.email).map((issue, index) => (
                                <div key={`issue-${index}`} style={styles.activityItem}>
                                    <div style={styles.itemHeader}>
                                        <span style={styles.itemType}>Issue</span>
                                        <span style={styles.itemDate}>
                                            {new Date(issue.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div style={styles.itemContent}>
                                        <strong style={styles.itemSubject}>
                                            Issue: {issue.known_issue}
                                        </strong>
                                        {issue.description && (
                                            <p style={styles.itemDescription}>
                                                Description: {issue.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <button 
                                style={styles.replyButton}
                                onClick={() => handleReplyToUser(account.email)}
                            >
                                Reply to User
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

   

    if (loading) return (
        <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p>Loading user data and activity...</p>
        </div>
    );
    
    if (error) return (
        <div style={styles.errorContainer}>
            <h3>Error Loading Data</h3>
            <p>{error}</p>
            <button onClick={fetchAllData} style={styles.retryButton}>
                Try Again
            </button>
        </div>
    );

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>User Management Dashboard</h2>
                <div style={styles.stats}>
                    <span style={styles.statItem}>Total Users: {accounts.length}</span>
                    <span style={{
                        ...styles.statItem,
                        backgroundColor: '#dcfce7',
                        color: '#166534'
                    }}>
                        ✅ Active: {accounts.filter(acc => acc.status === 'Active').length}
                    </span>
                    <span style={{
                        ...styles.statItem,
                        backgroundColor: accounts.filter(acc => acc.status === 'Request to Unsubscribed').length > 0 ? '#fef3c7' : styles.statItem.backgroundColor,
                        color: accounts.filter(acc => acc.status === 'Request to Unsubscribed').length > 0 ? '#92400e' : styles.statItem.color,
                        fontWeight: '700'
                    }}>
                        🚨 Unsubscribe Requests: {accounts.filter(acc => acc.status === 'Request to Unsubscribed').length}
                    </span>
                    <span style={{
                        ...styles.statItem,
                        backgroundColor: '#fef3c7',
                        color: '#d97706',
                        fontWeight: '600'
                    }}>
                        🔄 Request to Pause: {accounts.filter(acc => acc.status === 'Request to Pause Subscription').length}
                    </span>
                    
                    <span style={{
                        ...styles.statItem,
                        backgroundColor: '#fee2e2',
                        color: '#991b1b'
                    }}>
                        ❌ Unsubscribed: {accounts.filter(acc => acc.status === 'Unsubscribed').length}
                    </span>
                    <span style={{
                        ...styles.statItem,
                        backgroundColor: '#fff3e0',
                        color: '#e65100'
                    }}>
                        ⏸️ Paused: {accounts.filter(acc => acc.status === 'Subscription Has been Paused').length}
                    </span>
                    
                    <span style={styles.statItem}>
                        With Activity: {accounts.filter(acc => getUserActivitySummary(acc.email).totalActivity > 0).length}
                    </span>
                    <span style={{
                        ...styles.statItem,
                        backgroundColor: '#e0f2fe',
                        color: '#01579b',
                        fontWeight: '600'
                    }}>
                        Filtered Results: {filteredAccounts.length}
                    </span>
                </div>
            </div>

            {/* Filter Controls */}
            <div style={styles.filterContainer}>
                <div style={styles.filterGroup}>
                    <label style={styles.filterLabel}>Status Filter:</label>
                    <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={styles.filterSelect}
                    >
                        <option value="all">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Request to Pause Subscription">Request to Pause Subscription</option>
                        <option value="Request to Unsubscribed">Request to Unsubscribed</option>
                        <option value="Request to Active">Request to Active</option>
                        <option value="Unsubscribed">Unsubscribed</option>
                        {/* <option value="Pending Verification">Pending Verification</option> */}
                        <option value="Subscription Has been Paused">Subscription Has been Paused</option>
                    </select>
                </div>

                <div style={styles.filterGroup}>
                    <label style={styles.filterLabel}>Activity Filter:</label>
                    <select 
                        value={activityFilter} 
                        onChange={(e) => setActivityFilter(e.target.value)}
                        style={styles.filterSelect}
                    >
                        <option value="all">All Activity Levels</option>
                        <option value="with-activity">With Activity</option>
                        <option value="no-activity">No Activity</option>
                    </select>
                </div>

                <button 
                    onClick={() => {
                        setStatusFilter('all');
                        setActivityFilter('all');
                    }}
                    style={styles.clearFiltersButton}
                >
                    Clear Filters
                </button>
            </div>

            {/* Users Grid */}
            {filteredAccounts.length === 0 ? (
                <div style={styles.noDataContainer}>
                    {accounts.length === 0 ? (
                        <p>No accounts found in the database.</p>
                    ) : (
                        <div>
                            <p>No users match the selected filters.</p>
                            <button 
                                onClick={() => {
                                    setStatusFilter('all');
                                    setActivityFilter('all');
                                }}
                                style={styles.clearFiltersButton}
                            >
                                Clear Filters to Show All Users
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div style={styles.usersGrid}>
                    {filteredAccounts.map((account) => renderUserCard(account))}
                </div>
            )}

            {/* Reply Form Modal */}
            {showReplyForm && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>Reply to User</h3>
                            <button 
                                style={styles.closeButton}
                                onClick={handleCancelReply}
                            >
                                ✕
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmitReply} style={styles.replyForm}>
                            <div style={styles.formGroup}>
                                <label style={styles.formLabel}>To:</label>
                                <input
                                    type="email"
                                    value={replyFormData.email}
                                    disabled
                                    style={styles.formInputDisabled}
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.formLabel}>Subject: *</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={replyFormData.subject}
                                    onChange={handleReplyFormChange}
                                    placeholder="Enter subject..."
                                    style={styles.formInput}
                                    required
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.formLabel}>Message: *</label>
                                <textarea
                                    name="message"
                                    value={replyFormData.message}
                                    onChange={handleReplyFormChange}
                                    placeholder="Enter your reply message..."
                                    rows="6"
                                    style={styles.formTextarea}
                                    required
                                />
                            </div>

                            <div style={styles.formActions}>
                                <button
                                    type="button"
                                    onClick={handleCancelReply}
                                    style={styles.cancelButton}
                                    disabled={submittingReply}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        ...styles.submitButton,
                                        opacity: submittingReply ? 0.6 : 1,
                                        cursor: submittingReply ? 'not-allowed' : 'pointer'
                                    }}
                                    disabled={submittingReply}
                                >
                                    {submittingReply ? 'Sending...' : 'Send Reply'}
                                </button>
                            </div>
                        </form>

                        <div style={styles.modalFooter}>
                            <small style={styles.footerNote}>
                                * This reply will be saved to the database for record keeping.
                            </small>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper function to get status color
const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'active': return '#10b981';
        case 'pending verification': return '#f59e0b';
        case 'unsubscribed': return '#ef4444';
        case 'request to unsubscribed': return '#f97316';
        case 'request to active': return '#8b5cf6';
        case 'subscription has been paused': return '#e65100';
        case 'request to pause subscription': return '#d97706';
        default: return '#6b7280';
    }
};

// Styles
const styles = {
    itemBy: {
    color: '#6b7280',
    fontSize: '0.8rem',
    fontWeight: '500',
    fontStyle: 'italic'
},
    replyButton: {
        padding: '8px 16px',
        backgroundColor: '#3b82f6',
        border: 'none',
        borderRadius: '4px',
        color: 'white',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '600',
        transition: 'background-color 0.2s',
        marginTop: '12px'
    },
    container: {
        padding: '24px',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: '16px',
        flexWrap: 'wrap',
        gap: '16px'
    },
    title: {
        margin: 0,
        color: '#1f2937',
        fontSize: '2rem'
    },
    stats: {
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap'
    },
    statItem: {
        padding: '8px 16px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        fontSize: '0.9rem',
        fontWeight: '600',
        color: '#374151'
    },
    statusSections: {
        display: 'flex',
        flexDirection: 'column',
        gap: '40px'
    },
    statusSection: {
        backgroundColor: '#f9fafb',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #e5e7eb'
    },
    statusSectionHeader: {
        marginBottom: '20px',
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: '12px'
    },
    statusSectionTitle: {
        margin: 0,
        fontSize: '1.5rem',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    usersList: {
        display: 'flex',
        overflow: 'auto',
        gap: '20px',
        paddingBottom: '10px'
    },
    userCard: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e5e7eb',
        transition: 'transform 0.2s, box-shadow 0.2s',
        minWidth: '500px',
        maxHeight: '80vh',
        overflow: 'scroll'
    },
    userHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '20px'
    },
    userInfo: {
        display: 'grid',
        alignItems: 'center',
        gap: '12px'
    },
    userEmail: {
        margin: 0,
        color: '#1f2937',
        fontSize: '1.1rem',
        fontWeight: '600'
    },
    statusBadge: {
        padding: '4px 12px',
        borderRadius: '20px',
        color: 'white',
        fontSize: '0.8rem',
        fontWeight: '600'
    },
    statusDropdown: {
        padding: '6px 12px',
        borderRadius: '20px',
        color: 'white',
        fontSize: '0.8rem',
        fontWeight: '600',
        border: 'none',
        cursor: 'pointer',
        outline: 'none',
        transition: 'all 0.2s ease',
        appearance: 'none',
        backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6,9 12,15 18,9\'%3e%3c/polyline%3e%3c/svg%3e")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 8px center',
        backgroundSize: '12px',
        paddingRight: '32px'
    },
    userMeta: {
        textAlign: 'right'
    },
    joinDate: {
        color: '#9ca3af',
        fontSize: '0.8rem'
    },
    activitySection: {
        borderTop: '1px solid #e5e7eb',
        paddingTop: '16px'
    },
    activityTitle: {
        margin: '0 0 12px 0',
        color: '#374151',
        fontSize: '1rem',
        fontWeight: '600'
    },
    activityGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginBottom: '16px'
    },
    activityCard: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
    },
    activityIcon: {
        fontSize: '1.5rem',
        marginRight: '12px'
    },
    activityDetails: {
        display: 'flex',
        flexDirection: 'column'
    },
    activityCount: {
        fontSize: '1.2rem',
        fontWeight: '700',
        color: '#1f2937'
    },
    activityLabel: {
        fontSize: '0.8rem',
        color: '#6b7280',
        fontWeight: '500'
    },
    lastActivitySection: {
        padding: '12px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
    },
    lastActivityLabel: {
        display: 'block',
        color: '#374151',
        fontSize: '0.9rem',
        marginBottom: '6px'
    },
    lastActivityDetails: {
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap'
    },
    lastActivityItem: {
        fontSize: '0.8rem',
        color: '#6b7280',
        padding: '4px 8px',
        backgroundColor: 'white',
        borderRadius: '4px',
        border: '1px solid #e5e7eb'
    },
    noActivitySection: {
        padding: '12px',
        backgroundColor: '#fef2f2',
        borderRadius: '8px',
        border: '1px solid #fecaca',
        textAlign: 'center'
    },
    noActivityText: {
        color: '#991b1b',
        fontSize: '0.9rem',
        fontStyle: 'italic'
    },
    detailsSection: {
        marginTop: '20px',
        padding: '16px',
        maxHeight: '300px',
        overflowY: 'scroll',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
    },
    detailsTitle: {
        margin: '0 0 12px 0',
        color: '#374151',
        fontSize: '1rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    itemsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    activityItem: {
        backgroundColor: 'white',
        padding: '12px',
        borderRadius: '6px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    itemHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
    },
    itemType: {
        padding: '2px 8px',
        backgroundColor: '#3b82f6',
        color: 'white',
        borderRadius: '12px',
        fontSize: '0.75rem',
        fontWeight: '600'
    },
    itemDate: {
        color: '#6b7280',
        fontSize: '0.8rem',
        fontWeight: '500'
    },
   
    itemContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    itemSubject: {
        color: '#1f2937',
        fontSize: '0.9rem',
        lineHeight: '1.4'
    },
    itemDescription: {
        margin: '4px 0 0 0',
        color: '#6b7280',
        fontSize: '0.8rem',
        lineHeight: '1.4',
        fontStyle: 'italic'
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px',
        color: '#6b7280'
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '4px solid #f3f4f6',
        borderTop: '4px solid #3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '16px'
    },
    errorContainer: {
        textAlign: 'center',
        padding: '40px',
        backgroundColor: '#fee2e2',
        borderRadius: '12px',
        color: '#dc2626'
    },
    retryButton: {
        padding: '12px 24px',
        backgroundColor: '#dc2626',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        marginTop: '16px'
    },
    noDataContainer: {
        textAlign: 'center',
        padding: '40px',
        color: '#6b7280'
    },
    // Modal styles
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'auto'
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px 24px 0 24px',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '16px',
        marginBottom: '24px'
    },
    modalTitle: {
        margin: 0,
        color: '#1f2937',
        fontSize: '1.5rem',
        fontWeight: '600'
    },
    closeButton: {
        background: 'none',
        border: 'none',
        fontSize: '1.5rem',
        color: '#6b7280',
        cursor: 'pointer',
        padding: '4px',
        borderRadius: '4px',
        transition: 'background-color 0.2s'
    },
    replyForm: {
        padding: '0 24px'
    },
    formGroup: {
        marginBottom: '20px'
    },
    formLabel: {
        display: 'block',
        marginBottom: '8px',
        color: '#374151',
        fontSize: '0.9rem',
        fontWeight: '600'
    },
    formInput: {
        width: '100%',
        padding: '12px',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        fontSize: '1rem',
        backgroundColor: '#f9fafb',
        transition: 'border-color 0.2s, background-color 0.2s',
        boxSizing: 'border-box'
    },
    formInputDisabled: {
        width: '100%',
        padding: '12px',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        fontSize: '1rem',
        backgroundColor: '#f3f4f6',
        color: '#6b7280',
        cursor: 'not-allowed',
        boxSizing: 'border-box'
    },
    formTextarea: {
        width: '100%',
        padding: '12px',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        fontSize: '1rem',
        backgroundColor: '#f9fafb',
        transition: 'border-color 0.2s, background-color 0.2s',
        resize: 'vertical',
        minHeight: '120px',
        boxSizing: 'border-box',
        fontFamily: 'inherit'
    },
    formActions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        marginBottom: '24px'
    },
    cancelButton: {
        padding: '12px 24px',
        backgroundColor: '#f3f4f6',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        color: '#374151',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '500',
        transition: 'background-color 0.2s'
    },
    submitButton: {
        padding: '12px 24px',
        backgroundColor: '#3b82f6',
        border: 'none',
        borderRadius: '8px',
        color: 'white',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '600',
        transition: 'background-color 0.2s'
    },
    modalFooter: {
        padding: '0 24px 24px 24px',
        borderTop: '1px solid #e5e7eb',
        paddingTop: '16px'
    },
    footerNote: {
        color: '#6b7280',
        fontSize: '0.8rem',
        fontStyle: 'italic'
    },
    // ID Form styles
    idFormContainer: {
        marginTop: '16px',
        padding: '16px',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
    },
    idForm: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    formField: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    idFormLabel: {
        fontSize: '0.85rem',
        fontWeight: '600',
        color: '#374151'
    },
    idFormInput: {
        padding: '8px 12px',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        fontSize: '0.9rem',
        backgroundColor: 'white',
        transition: 'border-color 0.2s',
        outline: 'none'
    },
    idFormSubmit: {
        padding: '10px 16px',
        backgroundColor: '#059669',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        marginTop: '8px'
    },
    // Filter styles
    filterContainer: {
        display: 'flex',
        gap: '20px',
        alignItems: 'flex-end',
        padding: '20px',
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        marginBottom: '24px',
        flexWrap: 'wrap'
    },
    filterGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        minWidth: '180px'
    },
    filterLabel: {
        fontSize: '0.9rem',
        fontWeight: '600',
        color: '#374151'
    },
    filterSelect: {
        padding: '10px 12px',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        backgroundColor: 'white',
        fontSize: '0.9rem',
        color: '#374151',
        cursor: 'pointer',
        outline: 'none',
        transition: 'border-color 0.2s'
    },
    clearFiltersButton: {
        padding: '10px 16px',
        backgroundColor: '#6b7280',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        height: 'fit-content'
    },
    // Users grid styles
    usersGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        padding: '0'
    }
};

export default GetSupabaseData;