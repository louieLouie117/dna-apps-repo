import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

const RequestPasswordReset = () => {
    const [formData, setFormData] = useState({
        email: '' // Username is actually email in this system
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    
    // EmailJS configuration
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    // Email validation regex
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Function to send password reset email
    const sendResetEmail = async (email, resetLink) => {
        try {
            console.log('Sending password reset email to:', email);
            
            await emailjs.send(
                serviceId,
                templateId,
                {
                    to_email: email,
                    subject: 'Password Reset Request - DNA Apps',
                    message: `Hello,\n\nYou requested a password reset for your DNA Apps account.\n\nClick the link below to reset your password (this link expires in 15 minutes):\n\n${resetLink}\n\nIf you didn't request this reset, please ignore this email.\n\nBest regards,\nDNA Apps Team`,
                    reset_link: resetLink,
                    user_email: email
                },
                publicKey
            );
            
            console.log('Password reset email sent successfully');
            return true;
        } catch (error) {
            console.error('Failed to send password reset email:', error);
            throw new Error('Failed to send reset email. Please try again.');
        }
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
            // Validate email input
            if (!formData.email) {
                setMessage('Please enter your email address.');
                setMessageType('error');
                setLoading(false);
                return;
            }
            
            if (!isValidEmail(formData.email)) {
                setMessage('Please enter a valid email address.');
                setMessageType('error');
                setLoading(false);
                return;
            }

            // Prepare request data (send as username since backend expects username)
            const requestData = {
                username: formData.email // Backend uses username field but it's actually email
            };

            console.log('Sending password reset request:', requestData);

            // Send reset request to API
            const response = await fetch(`${API_BASE_URL}/api/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(requestData)
            });

            const data = await response.json();
            console.log('Password reset response:', data);

            if (response.ok && data.success) {
                // If we have a reset link, send it via email
                if (data.link) {
                    try {
                        await sendResetEmail(formData.email, data.link);
                        setMessage(
                            'Password reset link has been sent to your email address. Please check your inbox (and spam folder) for the reset link.'
                        );
                        setMessageType('success');
                    } catch (emailError) {
                        console.error('Email sending failed:', emailError);
                        setMessage(
                            `Reset link generated but email could not be sent: ${emailError.message}. ` + 
                            (process.env.NODE_ENV !== 'production' ? `Reset link: ${data.link}` : 'Please contact support.')
                        );
                        setMessageType('error');
                    }
                } else {
                    // Fallback message when no link is provided
                    setMessage(
                        data.message || 
                        'If an account with this email exists, a password reset link has been sent. Please check your email.'
                    );
                    setMessageType('success');
                }
                
                // Clear form on success
                setFormData({ email: '' });

                // Show development link if available
                if (data.link && process.env.NODE_ENV !== 'production') {
                    console.log('Development reset link:', data.link);
                }
            } else {
                setMessage(data.details || data.error || 'An error occurred while processing your request.');
                setMessageType('error');
            }

        } catch (error) {
            console.error('Password reset request error:', error);
            setMessage('Network error. Please check your connection and try again.');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formCard}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Reset Your Password</h2>
                    <p style={styles.subtitle}>
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>



                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label} htmlFor="email">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email address"
                            style={styles.input}
                            disabled={loading}
                            required
                        />
                        <small style={styles.inputHint}>
                            Enter the email address associated with your account. A reset link will be sent to this email.
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
                                Sending Reset Link...
                            </>
                        ) : (
                            'Send Reset Link'
                        )}
                    </button>
                </form>

                {/* Help text */}
                <div style={styles.helpSection}>
                    <p style={styles.helpText}>
                        Remember your password? 
                        <a href="/login-test" style={styles.link}> Sign in here</a>
                    </p>
                    <p style={styles.helpText}>
                        Don't have an account? 
                        <a href="/register" style={styles.link}> Create one now</a>
                    </p>
                    <p style={styles.smallNote}>
                        Note: Your username is your email address in this system.
                    </p>
                    {(!serviceId || !templateId || !publicKey) && (
                        <p style={styles.warningNote}>
                            ⚠️ Email service not configured. Reset links will be shown in console for development.
                        </p>
                    )}
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
        color: '#f59e0b',
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
    },
    warningNote: {
        margin: '8px 0 0 0',
        fontSize: '0.75rem',
        color: '#f59e0b',
        fontStyle: 'italic',
        backgroundColor: '#fffbeb',
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #fed7aa'
    }
};

export default RequestPasswordReset;