import React, { useState, useEffect } from 'react';
import supabase from '../config/SupaBaseClient';

const GetCustomerContacts = () => {
    const [customerContacts, setCustomerContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchCustomerContacts();
    }, []);

    const fetchCustomerContacts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase  
                .from('CustomerContact')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            setCustomerContacts(data || []);
            console.log('Customer Contacts:', data);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    

    if (loading) return (
        <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p>Loading customer contacts...</p>
        </div>
    );

    if (error) return (
        <div style={styles.errorContainer}>
            <h3>Error Loading Data</h3>
            <p>{error}</p>
            <button onClick={fetchCustomerContacts} style={styles.retryButton}>
                Try Again
            </button>
        </div>
    );


    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>Customer Contacts</h2>
                <div style={styles.stats}>
                    <span style={styles.statItem}>Total: {customerContacts.length}</span>
                </div>
            </div>

            <ul style={styles.contactsList}>
                {customerContacts.length === 0 ? (
                    <li style={styles.noDataItem}>No customer contacts found.</li>
                ) : (
                    customerContacts.map((contact) => (
                        <li key={contact.id} style={styles.contactItem}>
                            <div style={styles.contactHeader}>
                                <h3 style={styles.contactName}>{contact.name}</h3>
                                <span style={{
                                    ...styles.statusBadge,
                                    backgroundColor: getStatusColor(contact.status)
                                }}>
                                    {contact.status || 'Unknown'}
                                </span>
                            </div>
                            
                            <div style={styles.contactDetails}>
                                <p style={styles.contactInfo}>
                                    <strong>Email:</strong> {contact.email}
                                </p>
                                <p style={styles.contactInfo}>
                                    <strong>Payment Method:</strong> {contact.payment_method || 'Not specified'}
                                </p>
                                <p style={styles.contactInfo}>
                                    <strong>Subject:</strong> {contact.subject}
                                </p>
                                {contact.message && (
                                    <div style={styles.messageContainer}>
                                        <strong>Message:</strong>
                                        <p style={styles.messageText}>{contact.message}</p>
                                    </div>
                                )}
                            </div>
                            
                            <div style={styles.contactFooter}>
                                <small style={styles.timestamp}>
                                    Created: {new Date(contact.created_at).toLocaleString()}
                                </small>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

// Helper function to get status color

    
    
// Helper function to get status color
const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'active': return '#10b981';
        case 'pending': return '#f59e0b';
        case 'resolved': return '#6366f1';
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
        paddingBottom: '16px'
    },
    title: {
        margin: 0,
        color: '#1f2937',
        fontSize: '2rem'
    },
    stats: {
        display: 'flex',
        gap: '16px'
    },
    statItem: {
        padding: '8px 16px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        fontSize: '0.9rem',
        fontWeight: '600',
        color: '#374151'
    },
    filtersContainer: {
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
        flexWrap: 'wrap',
        alignItems: 'center'
    },
    searchContainer: {
        flex: 1,
        minWidth: '300px'
    },
    searchInput: {
        width: '100%',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #d1d5db',
        fontSize: '16px',
        boxSizing: 'border-box'
    },
    filterContainer: {
        minWidth: '150px'
    },
    filterSelect: {
        width: '100%',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #d1d5db',
        fontSize: '16px',
        backgroundColor: 'white'
    },
    refreshButton: {
        padding: '12px 20px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600'
    },
    contactsList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    contactItem: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e5e7eb',
        transition: 'transform 0.2s, box-shadow 0.2s'
    },
    contactHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px'
    },
    contactDetails: {
        marginBottom: '16px'
    },
    contactFooter: {
        borderTop: '1px solid #e5e7eb',
        paddingTop: '12px'
    },
    noDataItem: {
        textAlign: 'center',
        padding: '40px',
        color: '#6b7280',
        backgroundColor: '#f9fafb',
        borderRadius: '12px',
        border: '1px solid #e5e7eb'
    },
    contactsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
        gap: '20px'
    },
    contactCard: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e5e7eb',
        transition: 'transform 0.2s, box-shadow 0.2s'
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px'
    },
    contactName: {
        margin: 0,
        color: '#1f2937',
        fontSize: '1.25rem'
    },
    statusBadge: {
        padding: '4px 12px',
        borderRadius: '20px',
        color: 'white',
        fontSize: '0.8rem',
        fontWeight: '600'
    },
    cardBody: {
        marginBottom: '16px'
    },
    contactInfo: {
        marginBottom: '8px',
        color: '#374151'
    },
    messageContainer: {
        marginTop: '12px',
        padding: '12px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
    },
    messageText: {
        margin: '8px 0 0 0',
        color: '#6b7280',
        lineHeight: '1.5'
    },
    cardFooter: {
        borderTop: '1px solid #e5e7eb',
        paddingTop: '12px'
    },
    timestamp: {
        color: '#9ca3af',
        fontSize: '0.8rem'
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
        color: '#6b7280',
        gridColumn: '1 / -1'
    },
    clearSearchButton: {
        padding: '8px 16px',
        backgroundColor: '#6b7280',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        marginTop: '12px'
    }
};

export default GetCustomerContacts;