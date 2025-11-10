import React, { useState, useEffect } from 'react';
import supabase from '../config/SupaBaseClient';

const RenderIssueReports = () => {
    const [issueReports, setIssueReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterIssueType, setFilterIssueType] = useState('all');

    useEffect(() => {
        fetchIssueReports();
    }, []);

    const fetchIssueReports = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('IssueReporting')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            setIssueReports(data || []);
            console.log('Issue Reports:', data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Filter reports based on search term and issue type
    const filteredReports = issueReports.filter(report => {
        const matchesSearch = report.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            report.known_issue?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            report.description?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesIssueType = filterIssueType === 'all' || 
                                report.known_issue === filterIssueType;
        
        return matchesSearch && matchesIssueType;
    });

    const handleStatusUpdate = async (reportId, newStatus) => {
        try {
            const { error } = await supabase
                .from('IssueReporting')
                .update({ status: newStatus })
                .eq('id', reportId);

            if (error) throw error;

            // Update local state
            setIssueReports(issueReports.map(report => 
                report.id === reportId ? { ...report, status: newStatus } : report
            ));

            alert(`Issue status updated to ${newStatus}`);
        } catch (error) {
            alert(`Error updating status: ${error.message}`);
        }
    };

    if (loading) return (
        <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p>Loading issue reports...</p>
        </div>
    );

    if (error) return (
        <div style={styles.errorContainer}>
            <h3>Error Loading Data</h3>
            <p>{error}</p>
            <button onClick={fetchIssueReports} style={styles.retryButton}>
                Try Again
            </button>
        </div>
    );

    return (
        <div style={styles.container}>
           
            <div style={styles.header}>
                <h2 style={styles.title}>Issue Reports</h2>
                <div style={styles.stats}>
                    <span style={styles.statItem}>Total: {issueReports.length}</span>
                    <span style={styles.statItem}>Filtered: {filteredReports.length}</span>
                    <span style={styles.statItem}>
                        Pending: {issueReports.filter(r => r.status === 'Pending' || !r.status).length}
                    </span>
                </div>
            </div>

            {/* Filters */}
            <div style={styles.filtersContainer}>
                <div style={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Search by email, issue, or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                </div>
                <div style={styles.filterContainer}>
                    <select
                        value={filterIssueType}
                        onChange={(e) => setFilterIssueType(e.target.value)}
                        style={styles.filterSelect}
                    >
                        <option value="all">All Issues</option>
                        <option value="A connection to the internet is temporarily need. Please connect and refresh.">Internet Connection</option>
                        <option value="Other">Other Issues</option>
                    </select>
                </div>
                <button onClick={fetchIssueReports} style={styles.refreshButton}>
                    🔄 Refresh
                </button>
            </div>

            {/* Issue Reports List */}
            <div style={styles.reportsContainer}>
                {filteredReports.length === 0 ? (
                    <div style={styles.noDataContainer}>
                        <p>No issue reports found.</p>
                        {searchTerm && (
                            <button 
                                onClick={() => setSearchTerm('')}
                                style={styles.clearSearchButton}
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                ) : (
                    <ul style={styles.reportsList}>
                        {filteredReports.map((report) => (
                            <li key={report.id} style={styles.reportItem}>
                                <div style={styles.reportHeader}>
                                    <div style={styles.reportInfo}>
                                        <h3 style={styles.userEmail}>{report.email}</h3>
                                        <span style={{
                                            ...styles.statusBadge,
                                            backgroundColor: getStatusColor(report.status)
                                        }}>
                                            {report.status || 'Pending'}
                                        </span>
                                    </div>
                                    <small style={styles.timestamp}>
                                        {new Date(report.created_at).toLocaleString()}
                                    </small>
                                </div>

                                <div style={styles.reportBody}>
                                    <div style={styles.issueSection}>
                                        <strong style={styles.sectionLabel}>Known Issue:</strong>
                                        <p style={styles.issueText}>{report.known_issue}</p>
                                    </div>

                                    {report.description && (
                                        <div style={styles.descriptionSection}>
                                            <strong style={styles.sectionLabel}>Description:</strong>
                                            <p style={styles.descriptionText}>{report.description}</p>
                                        </div>
                                    )}

                                    {report.apps_affected && (
                                        <div style={styles.appsSection}>
                                            <strong style={styles.sectionLabel}>Apps Affected:</strong>
                                            <div style={styles.appsContainer}>
                                                {JSON.parse(report.apps_affected).map((app, index) => (
                                                    <span key={index} style={styles.appTag}>
                                                        {app}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div style={styles.reportFooter}>
                                    <div style={styles.actionsContainer}>
                                        <select
                                            onChange={(e) => {
                                                if (e.target.value && e.target.value !== report.status) {
                                                    handleStatusUpdate(report.id, e.target.value);
                                                }
                                                e.target.value = ''; // Reset select
                                            }}
                                            style={styles.actionSelect}
                                        >
                                            <option value="">Update Status</option>
                                            <option value="Pending">Pending</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Resolved">Resolved</option>
                                            <option value="Closed">Closed</option>
                                        </select>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

// Helper function to get status color
const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'pending': return '#f59e0b';
        case 'in progress': return '#3b82f6';
        case 'resolved': return '#10b981';
        case 'closed': return '#6b7280';
        default: return '#f59e0b';
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
        minWidth: '200px'
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
    reportsContainer: {
        backgroundColor: '#f9fafb',
        borderRadius: '12px',
        padding: '20px'
    },
    reportsList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    reportItem: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e5e7eb',
        transition: 'transform 0.2s, box-shadow 0.2s'
    },
    reportHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '20px'
    },
    reportInfo: {
        display: 'flex',
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
    timestamp: {
        color: '#9ca3af',
        fontSize: '0.8rem'
    },
    reportBody: {
        marginBottom: '20px'
    },
    issueSection: {
        marginBottom: '16px'
    },
    descriptionSection: {
        marginBottom: '16px'
    },
    appsSection: {
        marginBottom: '16px'
    },
    sectionLabel: {
        display: 'block',
        color: '#374151',
        fontSize: '0.9rem',
        marginBottom: '6px'
    },
    issueText: {
        margin: 0,
        color: '#1f2937',
        lineHeight: '1.5',
        padding: '12px',
        backgroundColor: '#fef3c7',
        borderRadius: '8px',
        border: '1px solid #fbbf24'
    },
    descriptionText: {
        margin: 0,
        color: '#6b7280',
        lineHeight: '1.5',
        padding: '12px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        border: '1px solid #d1d5db'
    },
    appsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px'
    },
    appTag: {
        padding: '4px 12px',
        backgroundColor: '#dbeafe',
        color: '#1e40af',
        borderRadius: '16px',
        fontSize: '0.8rem',
        fontWeight: '500',
        border: '1px solid #93c5fd'
    },
    reportFooter: {
        borderTop: '1px solid #e5e7eb',
        paddingTop: '16px'
    },
    actionsContainer: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    actionSelect: {
        padding: '8px 16px',
        borderRadius: '8px',
        border: '1px solid #d1d5db',
        fontSize: '0.9rem',
        backgroundColor: 'white',
        cursor: 'pointer',
        color: '#374151'
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

export default RenderIssueReports;
