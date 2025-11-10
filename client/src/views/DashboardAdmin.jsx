import {React, useState} from 'react';
import CreateUser from '../components/CreateUser';
import GetSupabaseData from '../components/GetSupabaseData';
import GetCustomerContacts from '../components/GetCustomerContacts';
import RenderIssueReports from '../components/RenderIssueReports';

const DashboardAdmin = () => {
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        {
            id: 'overview',
            label: 'Overview',
            icon: '📊',
            count: null
        },
        {
            id: 'users',
            label: 'User Management',
            icon: '👥',
            count: null
        },
        {
            id: 'contacts',
            label: 'Customer Contacts',
            icon: '📞',
            count: null
        },
        {
            id: 'issues',
            label: 'Issue Reports',
            icon: '🐛',
            count: null
        }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div style={styles.overviewContainer}>
                        <div style={styles.welcomeSection}>
                            <h2 style={styles.welcomeTitle}>Welcome to Admin Dashboard</h2>
                            <p style={styles.welcomeText}>
                                Manage users, view customer contacts, and handle issue reports all in one place.
                            </p>
                        </div>
                        
                        <div style={styles.quickStatsGrid}>
                            <div style={styles.statCard}>
                                <div style={styles.statIcon}>👥</div>
                                <div style={styles.statContent}>
                                    <h3 style={styles.statNumber}>-</h3>
                                    <p style={styles.statLabel}>Total Users</p>
                                </div>
                            </div>
                            <div style={styles.statCard}>
                                <div style={styles.statIcon}>📞</div>
                                <div style={styles.statContent}>
                                    <h3 style={styles.statNumber}>-</h3>
                                    <p style={styles.statLabel}>Customer Contacts</p>
                                </div>
                            </div>
                            <div style={styles.statCard}>
                                <div style={styles.statIcon}>🐛</div>
                                <div style={styles.statContent}>
                                    <h3 style={styles.statNumber}>-</h3>
                                    <p style={styles.statLabel}>Issue Reports</p>
                                </div>
                            </div>
                            <div style={styles.statCard}>
                                <div style={styles.statIcon}>⚡</div>
                                <div style={styles.statContent}>
                                    <h3 style={styles.statNumber}>-</h3>
                                    <p style={styles.statLabel}>Pending Issues</p>
                                </div>
                            </div>
                        </div>

                        <div style={styles.quickActionsSection}>
                            <h3 style={styles.sectionTitle}>Quick Actions</h3>
                            <div style={styles.quickActionsList}>
                                <button 
                                    style={styles.quickActionButton}
                                    onClick={() => setActiveTab('users')}
                                >
                                    <span style={styles.quickActionIcon}>👥</span>
                                    <span>Manage Users</span>
                                </button>
                                <button 
                                    style={styles.quickActionButton}
                                    onClick={() => setActiveTab('contacts')}
                                >
                                    <span style={styles.quickActionIcon}>📞</span>
                                    <span>View Contacts</span>
                                </button>
                                <button 
                                    style={styles.quickActionButton}
                                    onClick={() => setActiveTab('issues')}
                                >
                                    <span style={styles.quickActionIcon}>🐛</span>
                                    <span>Handle Issues</span>
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case 'users':
                return (
                    <div style={styles.tabContent}>
                        <div style={styles.sectionHeader}>
                            <h3 style={styles.sectionTitle}>Azure Database</h3>
                            <p style={styles.sectionDescription}>Create and manage users in the Azure database</p>
                        </div>
                        <CreateUser />
                        
                        <div style={styles.sectionHeader}>
                            <h3 style={styles.sectionTitle}>Supabase Data</h3>
                            <p style={styles.sectionDescription}>View and manage user data from Supabase</p>
                        </div>
                        <GetSupabaseData />
                    </div>
                );
            case 'contacts':
                return (
                    <div style={styles.tabContent}>
                        <div style={styles.sectionHeader}>
                            <h3 style={styles.sectionTitle}>Customer Contacts</h3>
                            <p style={styles.sectionDescription}>View and manage customer contact submissions</p>
                        </div>
                        <GetCustomerContacts />
                    </div>
                );
            case 'issues':
                return (
                    <div style={styles.tabContent}>
                        <div style={styles.sectionHeader}>
                            <h3 style={styles.sectionTitle}>Issue Reports</h3>
                            <p style={styles.sectionDescription}>Monitor and resolve user-reported issues</p>
                        </div>
                        <RenderIssueReports />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>Admin Dashboard</h1>
                <div style={styles.headerActions}>
                    <span style={styles.adminBadge}>Administrator</span>
                </div>
            </div>

            {/* Tab Navigation */}
            <div style={styles.tabNavigation}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            ...styles.tabButton,
                            ...(activeTab === tab.id ? styles.activeTabButton : {})
                        }}
                    >
                        <span style={styles.tabIcon}>{tab.icon}</span>
                        <span style={styles.tabLabel}>{tab.label}</span>
                        {tab.count && <span style={styles.tabCount}>{tab.count}</span>}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div style={styles.contentContainer}>
                {renderTabContent()}
            </div>
        </div>
    );
};

// Styles
const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '24px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    },
    title: {
        margin: 0,
        fontSize: '2.5rem',
        fontWeight: '700'
    },
    headerActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
    },
    adminBadge: {
        padding: '8px 16px',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '20px',
        fontSize: '0.9rem',
        fontWeight: '600',
        border: '1px solid rgba(255, 255, 255, 0.3)'
    },
    tabNavigation: {
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        padding: '0 32px',
        gap: '4px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
    },
    tabButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '16px 24px',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '500',
        color: '#6b7280',
        borderBottom: '3px solid transparent',
        transition: 'all 0.2s ease',
        position: 'relative'
    },
    activeTabButton: {
        color: '#3b82f6',
        borderBottom: '3px solid #3b82f6',
        backgroundColor: '#eff6ff'
    },
    tabIcon: {
        fontSize: '1.2rem'
    },
    tabLabel: {
        whiteSpace: 'nowrap'
    },
    tabCount: {
        backgroundColor: '#ef4444',
        color: 'white',
        borderRadius: '10px',
        padding: '2px 8px',
        fontSize: '0.75rem',
        fontWeight: '600',
        minWidth: '20px',
        textAlign: 'center'
    },
    contentContainer: {
        padding: '32px',
        maxWidth: '1400px',
        margin: '0 auto'
    },
    tabContent: {
        animation: 'fadeIn 0.3s ease-in'
    },
    sectionHeader: {
        marginBottom: '24px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e5e7eb'
    },
    sectionTitle: {
        margin: '0 0 8px 0',
        color: '#1f2937',
        fontSize: '1.5rem',
        fontWeight: '600'
    },
    sectionDescription: {
        margin: 0,
        color: '#6b7280',
        fontSize: '1rem',
        lineHeight: '1.5'
    },
    overviewContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '32px'
    },
    welcomeSection: {
        textAlign: 'center',
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e5e7eb'
    },
    welcomeTitle: {
        margin: '0 0 16px 0',
        color: '#1f2937',
        fontSize: '2rem',
        fontWeight: '700'
    },
    welcomeText: {
        margin: 0,
        color: '#6b7280',
        fontSize: '1.1rem',
        lineHeight: '1.6',
        maxWidth: '600px',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    quickStatsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
    },
    statCard: {
        display: 'flex',
        alignItems: 'center',
        padding: '24px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e5e7eb',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    },
    statIcon: {
        fontSize: '2.5rem',
        marginRight: '16px'
    },
    statContent: {
        flex: 1
    },
    statNumber: {
        margin: '0 0 4px 0',
        color: '#1f2937',
        fontSize: '2rem',
        fontWeight: '700'
    },
    statLabel: {
        margin: 0,
        color: '#6b7280',
        fontSize: '0.9rem',
        fontWeight: '500'
    },
    quickActionsSection: {
        padding: '24px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e5e7eb'
    },
    quickActionsList: {
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap'
    },
    quickActionButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px 24px',
        backgroundColor: '#f8fafc',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '500',
        color: '#374151',
        transition: 'all 0.2s ease',
        minWidth: '180px'
    },
    quickActionIcon: {
        fontSize: '1.5rem'
    }
};

export default DashboardAdmin;