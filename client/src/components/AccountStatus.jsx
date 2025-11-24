import React, { useState, useEffect } from 'react';
import supabase from '../config/SupaBaseClient';

const AccountStatus = () => {
    const [status, setStatus] = useState(null);
    const [username, setUsername] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get user data from cookies
    const getUserFromCookie = () => {
        const getUsernameFromCookie = () => {
            const match = document.cookie.match(new RegExp('(^| )username=([^;]+)'));
            return match ? match[2] : null;
        };
        
        const getUserIdFromCookie = () => {
            const match = document.cookie.match(new RegExp('(^| )userId=([^;]+)'));
            return match ? match[2] : null;
        };

        return {
            username: getUsernameFromCookie(),
            userId: getUserIdFromCookie()
        };
    };

    // Fetch user info from Supabase
    const fetchUserInfo = async () => {
        setLoading(true);
        setError(null);
        
        const { username: cookieUsername } = getUserFromCookie();
        
        if (!cookieUsername) {
            setError('No user session found');
            setLoading(false);
            return;
        }

        setUsername(cookieUsername);

        try {
            const { data, error } = await supabase
                .from('Users')
                .select('status')
                .eq('email', cookieUsername);

            if (error) {
                console.error('Error fetching user info:', error);
                setError('Failed to fetch account status');
            } else if (data && data.length > 0) {
                setStatus(data[0].status);
            } else {
                setError('Account not found');
            }
        } catch (err) {
            console.error('Error in fetchUserInfo:', err);
            setError('Unable to connect to database');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserInfo();
        
        // Set up an interval to refresh status periodically
        const interval = setInterval(fetchUserInfo, 30000); // Refresh every 30 seconds
        
        // Listen for storage events to refresh when other tabs update the status
        const handleStorageChange = () => {
            fetchUserInfo();
        };
        
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);
    // Status configuration with colors, icons, and messages
    const getStatusConfig = (status) => {
        const configs = {
            'Active': {
                color: '#10b981',
                bgColor: '#ecfdf5',
                borderColor: '#a7f3d0',
                icon: '✅',
                message: 'Your account is active and all services are available.',
                pulse: false
            },
            'Subscription Has been Paused': {
                color: '#f59e0b',
                bgColor: '#fffbeb',
                borderColor: '#fcd34d',
                icon: '⏸️',
                message: 'Your subscription is paused. No charges will occur during this period.',
                pulse: true
            },
            'Request to Pause Subscription': {
                color: '#f59e0b',
                bgColor: '#fffbeb',
                borderColor: '#fcd34d',
                icon: '⏳',
                message: 'Your pause request is being processed. You will not be charged.',
                pulse: true
            },
            'Expired': {
                color: '#dc2626',
                bgColor: '#fef2f2',
                borderColor: '#fca5a5',
                icon: '❌',
                message: 'Your subscription has expired. Please renew to continue using services.',
                pulse: false
            },
            'Pending': {
                color: '#3b82f6',
                bgColor: '#eff6ff',
                borderColor: '#93c5fd',
                icon: '🔄',
                message: 'Your account setup is in progress.',
                pulse: true
            },
            'Suspended': {
                color: '#dc2626',
                bgColor: '#fef2f2',
                borderColor: '#fca5a5',
                icon: '🚫',
                message: 'Your account has been suspended. Please contact support.',
                pulse: false
            }
        };

        return configs[status] || {
            color: '#6b7280',
            bgColor: '#f9fafb',
            borderColor: '#d1d5db',
            icon: '❓',
            message: 'Status information not available.',
            pulse: false
        };
    };

    const config = getStatusConfig(status);

    // Loading state
    if (loading) {
        return (
            <div style={styles.container}>
                <div style={{
                    ...styles.statusCard,
                    backgroundColor: '#f9fafb',
                    borderColor: '#e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '120px'
                }}>
                    <div style={styles.loadingContainer}>
                        <div style={styles.spinner}></div>
                        <p style={styles.loadingText}>Loading account status...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div style={styles.container}>
                <div style={{
                    ...styles.statusCard,
                    backgroundColor: '#fef2f2',
                    borderColor: '#fca5a5',
                    color: '#dc2626'
                }}>
                    <div style={styles.errorContainer}>
                        <span style={styles.errorIcon}>⚠️</span>
                        <div>
                            <h3 style={styles.errorTitle}>Unable to Load Status</h3>
                            <p style={styles.errorMessage}>{error}</p>
                            <button 
                                style={styles.retryButton}
                                onClick={fetchUserInfo}
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={{
                ...styles.statusCard,
                backgroundColor: config.bgColor,
                borderColor: config.borderColor,
                color: config.color
            }}>
                {/* Header */}
                <div style={styles.header}>
                    <div style={styles.iconContainer}>
                        <span style={{
                            ...styles.icon,
                            animation: config.pulse ? 'pulse 2s infinite' : 'none'
                        }}>
                            {config.icon}
                        </span>
                    </div>
                    <div style={styles.titleContainer}>
                        <h3 style={styles.title}>Account Status</h3>
                        <span style={{
                            ...styles.statusBadge,
                            backgroundColor: config.color,
                            color: config.bgColor
                        }}>
                            {status || 'Unknown'}
                        </span>
                    </div>
                </div>

                {/* Status Message */}
                <div style={styles.messageContainer}>
                    <p style={styles.message}>
                        {config.message}
                    </p>
                </div>

                {/* User Info */}
                {username && (
                    <div style={styles.userInfo}>
                        <span style={styles.userLabel}>Account:</span>
                        <span style={styles.userEmail}>{username}</span>
                    </div>
                )}

                {/* Status-specific Actions */}
                {(status === 'Expired' || status === 'Suspended') && (
                    <div style={styles.actionContainer}>
                        <button style={styles.actionButton}>
                            Contact Support
                        </button>
                    </div>
                )}

                {status === 'Active' && (
                    <div style={styles.actionContainer}>
                        <button style={styles.secondaryButton}>
                            Manage Subscription
                        </button>
                    </div>
                )}
            </div>

            {/* CSS for animations */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.05); }
                }
                
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

const styles = {
    container: {
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto'
    },
    statusCard: {
        padding: '24px',
        borderRadius: '16px',
        border: '2px solid',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        animation: 'slideIn 0.3s ease-out',
        transition: 'all 0.3s ease'
    },
    header: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
        marginBottom: '16px'
    },
    iconContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '48px'
    },
    icon: {
        fontSize: '24px',
        display: 'block'
    },
    titleContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    title: {
        margin: 0,
        fontSize: '1.25rem',
        fontWeight: '700',
        color: '#1f2937'
    },
    statusBadge: {
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        width: 'fit-content'
    },
    messageContainer: {
        marginBottom: '16px'
    },
    message: {
        margin: 0,
        fontSize: '0.95rem',
        lineHeight: '1.5',
        color: '#374151'
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px',
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        borderRadius: '8px',
        marginBottom: '16px'
    },
    userLabel: {
        fontSize: '0.85rem',
        fontWeight: '500',
        color: '#6b7280'
    },
    userEmail: {
        fontSize: '0.85rem',
        fontWeight: '600',
        color: '#1f2937',
        fontFamily: 'Monaco, Consolas, monospace'
    },
    actionContainer: {
        display: 'flex',
        gap: '12px',
        marginTop: '16px'
    },
    actionButton: {
        padding: '10px 20px',
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        flex: 1
    },
    secondaryButton: {
        padding: '10px 20px',
        backgroundColor: 'transparent',
        color: '#6b7280',
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '0.9rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        flex: 1
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px'
    },
    spinner: {
        width: '32px',
        height: '32px',
        border: '3px solid #e5e7eb',
        borderTop: '3px solid #3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    },
    loadingText: {
        margin: 0,
        color: '#6b7280',
        fontSize: '0.9rem'
    },
    errorContainer: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px'
    },
    errorIcon: {
        fontSize: '24px',
        minWidth: '24px'
    },
    errorTitle: {
        margin: '0 0 8px 0',
        fontSize: '1.1rem',
        fontWeight: '600',
        color: '#dc2626'
    },
    errorMessage: {
        margin: '0 0 16px 0',
        fontSize: '0.9rem',
        color: '#7f1d1d',
        lineHeight: '1.4'
    },
    retryButton: {
        padding: '8px 16px',
        backgroundColor: '#dc2626',
        color: '#ffffff',
        border: 'none',
        borderRadius: '6px',
        fontSize: '0.85rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease'
    }
};

export default AccountStatus;