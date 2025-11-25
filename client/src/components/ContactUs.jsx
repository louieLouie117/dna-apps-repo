import React, { useState, useEffect } from 'react';
import supabase from '../config/SupaBaseClient';
import PageHeader from './PageHeader';
import { safeCookieParser } from '../utils/cookieUtils';

const ContactUs = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [emailFromCookie, setEmailFromCookie] = useState(false);
    const [initializing, setInitializing] = useState(true);

    // Get user email from cookies using safe parser
    const getUserFromCookie = () => {
        return safeCookieParser.getUserEmail();
    };

    // Initialize form with cookie data
    useEffect(() => {
        const cookieEmail = getUserFromCookie();
        if (cookieEmail) {
            setForm(prev => ({ ...prev, email: cookieEmail }));
            setEmailFromCookie(true);
        }
        setInitializing(false);
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        setError('');
        const { name, email, subject, message } = form;

        if (!name || !email || !subject || !message) {
            setError('Please fill in all fields.');
            setLoading(false);
            return;
        }

        const { error } = await supabase
            .from('CustomerContact')
            .insert([{ name, email, subject, message }]);

        if (error) {
            setError('Failed to send message. Please try again.');
        } else {
            setSuccess('Your message has been sent!');
            setForm({ name: '', email: '', subject: '', message: '' });
        }
        setLoading(false);
    };

    if (initializing) {
        return (
            <div>
                <header>
                    <PageHeader />
                </header>
                <div style={{
                    maxWidth: 500,
                    margin: '40px auto',
                    padding: 32,
                    borderRadius: 16,
                    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                    background: '#fff',
                    textAlign: 'center'
                }}>
                    <div style={{ padding: '40px 0' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            border: '3px solid #e5e7eb',
                            borderTop: '3px solid #3b82f6',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 16px'
                        }}></div>
                        <p style={{ color: '#6b7280' }}>Loading contact form...</p>
                    </div>
                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            </div>
        );
    }

    return (
        <div>  
            <header>
                <PageHeader />
            </header>
             <div style={{
            maxWidth: 500,
            margin: '40px auto',
            padding: 32,
            borderRadius: 16,
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            background: '#fff'
        }}>

            
            <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Contact Us</h2>
            {emailFromCookie && (
                <div style={{
                    backgroundColor: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <span style={{ color: '#10b981', fontSize: '16px' }}>✓</span>
                    <span style={{ color: '#047857', fontSize: '14px', fontWeight: '500' }}>
                        Email auto-filled from your account session
                    </span>
                </div>
            )}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                />
                <div style={{ position: 'relative' }}>
                    <input
                        type="email"
                        name="email"
                        placeholder={emailFromCookie ? "Email (from your account)" : "Your Email"}
                        value={form.email}
                        onChange={handleChange}
                        style={{
                            ...inputStyle,
                            backgroundColor: emailFromCookie ? '#f9fafb' : '#ffffff',
                            color: emailFromCookie ? '#374151' : '#000000',
                            cursor: emailFromCookie ? 'default' : 'text'
                        }}
                        readOnly={emailFromCookie}
                        required
                    />
                    {emailFromCookie && (
                        <div style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#10b981',
                            fontSize: '12px',
                            fontWeight: '600'
                        }}>
                            ✓ Auto-filled
                        </div>
                    )}
                </div>
                <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={form.subject}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                />
                <textarea
                    name="message"
                    placeholder="Your Message"
                    value={form.message}
                    onChange={handleChange}
                    style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }}
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '12px 0',
                        background: '#2563eb',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        fontWeight: 600,
                        fontSize: 16,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'background 0.2s'
                    }}
                >
                    {loading ? 'Sending...' : 'Send Message'}
                </button>
                {success && <div style={{ color: 'green', textAlign: 'center' }}>{success}</div>}
                {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
            </form>
        </div> 

        </div>
       
    );
};

const inputStyle = {
    padding: '12px',
    borderRadius: 8,
    border: '1px solid #d1d5db',
    fontSize: 16,
    outline: 'none',
    transition: 'border 0.2s',
};

export default ContactUs;