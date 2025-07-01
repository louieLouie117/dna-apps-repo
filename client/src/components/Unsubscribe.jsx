import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import PageHeader from './PageHeader';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Unsubscribe = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

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
            setSuccess('Your request to unsubscribe has been sent! You will receive a confirmation email once your unsubscription has been processed.');
            setForm({ name: '', email: '', subject: '', message: '' });
        }
        setLoading(false);
    };

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
                <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Unsubscribe</h2>
                <p>We're sorry to see you go! Please let us know why you're unsubscribing.</p>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                     <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                    >
                        <option value="">Select a reason for leaving</option>
                        <option value="App is too difficult to use">Apps is too difficult to use</option>
                        <option value="Lack of mobile app">Lack of mobile app</option>
                        <option value="Found a better alternative">Found a better alternative</option>
                        <option value="App is too expensive">Apps is too expensive</option>
                        <option value="Not using the app enough">Not using the app enough</option>
                        <option value="Technical issues or bugs">Technical issues or bugs</option>
                        <option value="Customer support issues">Customer support issues</option>
                        <option value="Other">Other</option>
                    </select>
                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={form.name}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                    />
                   
                    <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={form.email}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                    />
                    <textarea
                        name="message"
                        placeholder="Additional comments (optional)"
                        value={form.message}
                        onChange={handleChange}
                        style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }}
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
                        {loading ? 'Sending...' : 'Unsubscribe'}
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

export default Unsubscribe;