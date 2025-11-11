import React, { useState, useEffect } from 'react';
import supabase from '../config/SupaBaseClient';

const GetSupabaseData = () => {
    const [accounts, setAccounts] = useState([]);
    const [customerContacts, setCustomerContacts] = useState([]);
    const [issueReports, setIssueReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                    .order('created_at', { ascending: false })
                    .limit(50),
                supabase
                    .from('CustomerContact')
                    .select('email, created_at, subject, message, payment_method, status')
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
                <h2 style={styles.title}>Users with Activity Status</h2>
                <div style={styles.stats}>
                    <span style={styles.statItem}>Total Users: {accounts.length}</span>
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
                        backgroundColor: '#dcfce7',
                        color: '#166534'
                    }}>
                        ✅ Active: {accounts.filter(acc => acc.status === 'Active').length}
                    </span>
                    <span style={{
                        ...styles.statItem,
                        backgroundColor: '#fee2e2',
                        color: '#991b1b'
                    }}>
                        ❌ Unsubscribed: {accounts.filter(acc => acc.status === 'Unsubscribed').length}
                    </span>
                    <span style={styles.statItem}>
                        With Activity: {accounts.filter(acc => getUserActivitySummary(acc.email).totalActivity > 0).length}
                    </span>
                </div>
            </div>

            {accounts.length === 0 ? (
                <div style={styles.noDataContainer}>
                    <p>No accounts found.</p>
                </div>
            ) : (
                <div style={styles.usersList}>
                    {accounts.map((account) => {
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
                                        <span style={{
                                            ...styles.statusBadge,
                                            backgroundColor: getStatusColor(account.status)
                                        }}>
                                            {account.status || 'Unknown'}
                                        </span>
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
                                                        <span style={styles.itemType}>Contact</span>
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
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
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
        default: return '#6b7280';
    }
};

// Styles
const styles = {
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
    usersList: {
        display: 'flex',
        // flexDirection: 'column',
        overflow: 'scroll',
        // width: '95vw', not working in mobile
        gap: '20px'
    },
    userCard: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e5e7eb',
        transition: 'transform 0.2s, box-shadow 0.2s'
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
    }
};

export default GetSupabaseData;