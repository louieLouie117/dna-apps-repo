import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const IssueReporting = () => {
    // Get user email from supabase auth
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const fetchUserEmail = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            const email = user?.email || '';
            setUserEmail(email);
            // Update form state with the fetched email
            setForm(prevForm => ({ ...prevForm, email: email }));
        };
        fetchUserEmail();
    }, []);

    const [form, setForm] = useState({
        email: '',
        known_issue: '',
        description: '',
        apps_affected: [],
    });
    
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAppCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            apps_affected: checked 
                ? [...prevForm.apps_affected, value]
                : prevForm.apps_affected.filter(app => app !== value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        setError('');
        
        const { email, known_issue, description, apps_affected } = form;

        // Validate required fields
        if (!email || !known_issue) {
            setError('Please fill in all required fields.');
            setLoading(false);
            return;
        }

        // If "Other" is selected for known_issue, description is required
        if (known_issue === 'Other' && !description) {
            setError('Please provide a description for the other issue.');
            setLoading(false);
            return;
        }

        try {
            // Insert data into IssueReporting table
            const { error: insertError } = await supabase
                .from('IssueReporting')
                .insert([{ 
                    email, 
                    known_issue,
                    description: known_issue === 'Other' ? description : '',
                    apps_affected: JSON.stringify(apps_affected),
                    created_at: new Date().toISOString()
                }]);

            if (insertError) {
                throw insertError;
            }

            setSuccess('Your issue report has been submitted successfully! We will review it and get back to you soon.');
            setForm({ email: userEmail, issue_type: '', known_issue: '', description: '', apps_affected: [] });
        } catch (error) {
            console.error('Error submitting issue report:', error);
            setError('Failed to submit issue report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            maxWidth: 600,
            margin: '40px auto',
            padding: 32,
            borderRadius: 16,
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            background: '#fff'
        }}>
            <h2 style={{ textAlign: 'center', marginBottom: 16, color: '#1f2937' }}>
                Report an Issue
            </h2>
            <p style={{ textAlign: 'center', marginBottom: 24, color: '#6b7280' }}>
                Help us improve by reporting any issues you encounter
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Email Field */}
          
                {/* Known Issues Dropdown */}
                <div>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, color: '#374151' }}>
                        Possible issue/errors *
                    </label>
                    <select
                        name="known_issue"
                        value={form.known_issue}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                    >
                        <option value="">Select</option>
                        <option value="A connection to the internet is temporarily need. Please connect and refresh.">A connection to the internet is temporarily need. Please connect and refresh.</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                {/* Description Textarea - Only show when "Other" is selected */}
                {form.known_issue === 'Other' && (
                    <div>
                        <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, color: '#374151' }}>
                            Issue Description *
                        </label>
                        <textarea
                            name="description"
                            placeholder="Please describe the issue in detail. Include steps to reproduce the problem if possible..."
                            value={form.description}
                            onChange={handleChange}
                            style={{
                                ...inputStyle,
                                minHeight: 120,
                                resize: 'vertical',
                                fontFamily: 'inherit'
                            }}
                            required
                        />
                    </div>
                )}

                {/* Apps Affected Checkboxes */}
                <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>
                        Apps Affected (Optional)
                    </label>
                    <div style={{ 
                        display: 'grid', 
                        gap: 12,
                        padding: 12,
                        border: '1px solid #d1d5db',
                        borderRadius: 8,
                        background: '#f9fafb'
                    }}>
                        {['My Monthly Budget', 'My To-Do List', 'My Locked Password', 'My Flashcards', 'My Pen Calculator'].map((app) => (
                            <label key={app} style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                cursor: 'pointer',
                                fontSize: 14,
                                color: '#374151'
                            }}>
                                <input
                                    type="checkbox"
                                    value={app}
                                    checked={form.apps_affected.includes(app)}
                                    onChange={handleAppCheckboxChange}
                                    style={{ 
                                        marginRight: 6,
                                        transform: 'scale(1.1)'
                                    }}
                                />
                                {app}
                            </label>
                        ))}
                    </div>
                    {form.apps_affected.length > 0 && (
                        <div style={{ 
                            marginTop: 8, 
                            fontSize: 12, 
                            color: '#6b7280',
                            fontStyle: 'italic'
                        }}>
                            Selected: {form.apps_affected.join(', ')}
                        </div>
                    )}
                </div>

                      <div>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, color: '#374151' }}>
                        Email Address *
                    </label>
                    <input
                        type="email"
                        name="email"
                        placeholder="your.email@example.com"
                        value={form.email}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                    />
                </div>


                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '14px 0',
                        background: loading ? '#9ca3af' : '#2563eb',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        fontWeight: 600,
                        fontSize: 16,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'background 0.2s',
                        marginTop: 8
                    }}
                    onMouseOver={(e) => {
                        if (!loading) e.target.style.background = '#2563eb';
                    }}
                    onMouseOut={(e) => {
                        if (!loading) e.target.style.background = '#2563eb';
                    }}
                >
                    {loading ? 'Submitting...' : 'Submit Issue Report'}
                </button>

                {/* Success Message */}
                {success && (
                    <div style={{ 
                        color: '#059669', 
                        textAlign: 'center', 
                        padding: 12,
                        background: '#d1fae5',
                        borderRadius: 6,
                        border: '1px solid #10b981'
                    }}>
                        {success}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div style={{ 
                        color: '#dc2626', 
                        textAlign: 'center',
                        padding: 12,
                        background: '#fee2e2',
                        borderRadius: 6,
                        border: '1px solid #f87171'
                    }}>
                        {error}
                    </div>
                )}
            </form>
        </div>
    );
};

// Shared input styles
const inputStyle = {
    padding: '12px',
    borderRadius: 8,
    border: '1px solid #d1d5db',
    fontSize: 16,
    outline: 'none',
    transition: 'border 0.2s',
    width: '100%',
    boxSizing: 'border-box'
};

export default IssueReporting;
