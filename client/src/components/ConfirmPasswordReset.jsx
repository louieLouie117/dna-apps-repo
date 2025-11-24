import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PageHeader from './PageHeader';

const ConfirmPasswordReset = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'
    const [token, setToken] = useState('');
    const [tokenValid, setTokenValid] = useState(null); // null = checking, true = valid, false = invalid

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    // Extract and validate token from URL on component mount
    useEffect(() => {
        const urlToken = searchParams.get('token');
        
        if (!urlToken) {
            setMessage('Invalid or missing reset token. Please request a new password reset.');
            setMessageType('error');
            setTokenValid(false);
            return;
        }

        setToken(urlToken);
        validateToken(urlToken);
    }, [searchParams]);

    // Validate token with backend (optional - you can skip this if you want to validate only on form submit)
    const validateToken = async (tokenToValidate) => {
        try {
            // For now, we'll assume token is valid and validate on submit
            // You could add a separate validation endpoint if needed
            setTokenValid(true);
        } catch (error) {
            console.error('Token validation error:', error);
            setMessage('Invalid or expired reset token.');
            setMessageType('error');
            setTokenValid(false);
        }
    };

    // Password validation
    const validatePassword = (password) => {
        if (password.length < 6) {
            return 'Password must be at least 6 characters long';
        }
        // Add more validation rules as needed
        return null;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear previous messages when user starts typing
        if (message) {
            setMessage('');
            setMessageType('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setMessageType('');

        try {
            // Validate input
            if (!formData.newPassword || !formData.confirmPassword) {
                setMessage('Please fill in all fields.');
                setMessageType('error');
                setLoading(false);
                return;
            }

            // Check password strength
            const passwordError = validatePassword(formData.newPassword);
            if (passwordError) {
                setMessage(passwordError);
                setMessageType('error');
                setLoading(false);
                return;
            }

            // Check password confirmation
            if (formData.newPassword !== formData.confirmPassword) {
                setMessage('Passwords do not match.');
                setMessageType('error');
                setLoading(false);
                return;
            }

            console.log('Submitting password reset confirmation...');

            // Call the API to confirm password reset
            const response = await fetch(`${API_BASE_URL}/api/confirm-password-reset`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    token: token,
                    newPassword: formData.newPassword
                })
            });

            const data = await response.json();
            console.log('Password reset response:', data);

            if (response.ok && data.success) {
                setMessage('Password reset successful! You can now log in with your new password.');
                setMessageType('success');
                
                // Clear form
                setFormData({ newPassword: '', confirmPassword: '' });
                
                // Redirect to login page after 3 seconds
                setTimeout(() => {
                    navigate('/login-test');
                }, 3000);
            } else {
                setMessage(data.details || data.error || 'Failed to reset password. Please try again.');
                setMessageType('error');
            }

        } catch (error) {
            console.error('Password reset confirmation error:', error);
            setMessage('Network error. Please check your connection and try again.');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    // Show loading state while checking token
    if (tokenValid === null) {
        return (
            <div style={styles.container}>
                <div style={styles.formCard}>
                    <div style={styles.loadingMessage}>
                        <div style={styles.spinner}></div>
                        <p>Validating reset link...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Show error if token is invalid
    if (tokenValid === false) {
        return (
            <>
            <PageHeader />
            <div style={styles.container}>
                <div style={styles.formCard}>
                    <div style={styles.header}>
                        <h2 style={styles.title}>Invalid Reset Link</h2>
                    </div>
                    <div style={{...styles.message, ...styles.messageError}}>
                        ❌ {message || 'This password reset link is invalid or has expired.'}
                    </div>
                    <div style={styles.helpSection}>
                        <p style={styles.helpText}>
                            <a href="/request-password-reset" style={styles.link}>
                                Request a new password reset
                            </a>
                        </p>
                        <p style={styles.helpText}>
                            <a href="/login" style={styles.link}>
                                Back to login
                            </a>
                        </p>
                    </div>
                </div>
            </div>
            
            </>
        );
    }

    return (
        <>
        <PageHeader />
        <div style={styles.container}>
            <div style={styles.formCard}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Create New Password</h2>
                    <p style={styles.subtitle}>
                        Enter your new password below. Make sure it's secure and easy to remember.
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label} htmlFor="newPassword">
                            New Password *
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            placeholder="Enter your new password"
                            style={styles.input}
                            disabled={loading}
                            required
                        />
                        <small style={styles.inputHint}>
                            Password must be at least 6 characters long
                        </small>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label} htmlFor="confirmPassword">
                            Confirm New Password *
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm your new password"
                            style={styles.input}
                            disabled={loading}
                            required
                        />
                        <small style={styles.inputHint}>
                            Re-enter your password to confirm
                        </small>
                    </div>

                    {/* Message display */}
                    {message && (
                        <div style={{
                            ...styles.message,
                            ...(messageType === 'success' ? styles.messageSuccess : styles.messageError)
                        }}>
                            {messageType === 'success' ? '✅ ' : '❌ '}
                            {message}
                        </div>
                    )}

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...styles.submitButton,
                            ...(loading ? styles.submitButtonDisabled : {})
                        }}
                    >
                        {loading ? (
                            <>
                                <span style={styles.spinner}></span>
                                Updating Password...
                            </>
                        ) : (
                            'Update Password'
                        )}
                    </button>
                </form>

                {/* Help text */}
                <div style={styles.helpSection}>
                    <p style={styles.helpText}>
                        Remember your password? 
                        <a href="/login-test" style={styles.link}> Sign in here</a>
                    </p>
                    <p style={styles.smallNote}>
                        After updating your password, you'll be redirected to the login page.
                    </p>
                </div>
            </div>

            {/* CSS for spinner animation */}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
        </>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '20px',
        backgroundColor: '#f5f7fa',
        fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    formCard: {
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
        padding: '40px',
        width: '100%',
        maxWidth: '480px',
        border: '1px solid #e1e5e9'
    },
    header: {
        textAlign: 'center',
        marginBottom: '32px'
    },
    title: {
        margin: '0 0 12px 0',
        fontSize: '1.8rem',
        fontWeight: '700',
        color: '#1f2937',
        lineHeight: '1.2'
    },
    subtitle: {
        margin: 0,
        fontSize: '1rem',
        color: '#6b7280',
        lineHeight: '1.5'
    },
    loadingMessage: {
        textAlign: 'center',
        padding: '40px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        color: '#6b7280'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
    },
    label: {
        fontSize: '0.9rem',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '4px'
    },
    input: {
        padding: '12px 16px',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        fontSize: '1rem',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        outline: 'none',
        backgroundColor: '#ffffff'
    },
    inputHint: {
        fontSize: '0.8rem',
        color: '#6b7280',
        fontStyle: 'italic',
        marginTop: '4px'
    },
    message: {
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '0.9rem',
        fontWeight: '500',
        marginTop: '8px'
    },
    messageSuccess: {
        backgroundColor: '#ecfdf5',
        color: '#065f46',
        border: '1px solid #a7f3d0'
    },
    messageError: {
        backgroundColor: '#fef2f2',
        color: '#dc2626',
        border: '1px solid #fca5a5'
    },
    submitButton: {
        padding: '12px 24px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        marginTop: '8px'
    },
    submitButtonDisabled: {
        backgroundColor: '#9ca3af',
        cursor: 'not-allowed'
    },
    spinner: {
        width: '16px',
        height: '16px',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        borderTop: '2px solid white',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    },
    helpSection: {
        marginTop: '24px',
        textAlign: 'center',
        paddingTop: '20px',
        borderTop: '1px solid #e5e7eb'
    },
    helpText: {
        margin: '8px 0',
        fontSize: '0.9rem',
        color: '#6b7280'
    },
    link: {
        color: '#3b82f6',
        textDecoration: 'none',
        fontWeight: '500',
        transition: 'color 0.2s ease'
    },
    smallNote: {
        margin: '12px 0 0 0',
        fontSize: '0.8rem',
        color: '#9ca3af',
        fontStyle: 'italic'
    }
};

export default ConfirmPasswordReset;