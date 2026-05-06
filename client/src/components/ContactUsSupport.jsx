import React, { useState, useEffect } from 'react';
import { safeCookieParser } from '../utils/cookieUtils';
import './ContactUsSupport.css';
import PageHeader from './PageHeader';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ContactUsSupport = () => {
    const [form, setForm] = useState({
        fromEmail: '',
        subject: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const emailFromCookie = safeCookieParser.getUserEmail();
        if (emailFromCookie) {
            setForm(prev => ({ ...prev, fromEmail: emailFromCookie }));
        }
    }, []);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!form.message.trim()) {
            setError('Please enter a message.');
            return;
        }

        if (!form.fromEmail.trim()) {
            setError('Please enter your email address.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/contact-support`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccess(data.message || 'Your message has been submitted!');
                setForm(prev => ({ ...prev, subject: '', message: '' }));
            } else {
                setError(data.error || 'Failed to send message. Please try again.');
            }
        } catch (err) {
            console.error('Error submitting support message:', err);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-support">
            {/* logo header */}
                    <PageHeader />
            <div className="contact-support__card">
                <div className="contact-support__header">
                    <h2 className="contact-support__title">Contact Support</h2>
                    <p className="contact-support__subtitle">
                        Have a question or issue? Send us a message and we'll get back to you.
                    </p>
                </div>

                {success && (
                    <div className="contact-support__alert contact-support__alert--success">
                        {success}
                    </div>
                )}

                {error && (
                    <div className="contact-support__alert contact-support__alert--error">
                        {error}
                    </div>
                )}

                <form className="contact-support__form" onSubmit={handleSubmit} noValidate>
                    <div className="contact-support__field">
                        <label className="contact-support__label" htmlFor="cs-email">
                            Your Email <span className="contact-support__required">*</span>
                        </label>
                        <input
                            id="cs-email"
                            type="email"
                            name="fromEmail"
                            className="contact-support__input"
                            value={form.fromEmail}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="contact-support__field">
                        <label className="contact-support__label" htmlFor="cs-subject">
                            Subject <span className="contact-support__optional">(optional)</span>
                        </label>
                        <input
                            id="cs-subject"
                            type="text"
                            name="subject"
                            className="contact-support__input"
                            value={form.subject}
                            onChange={handleChange}
                            placeholder="e.g. Login issue, Billing question…"
                            maxLength={255}
                        />
                    </div>

                    <div className="contact-support__field">
                        <label className="contact-support__label" htmlFor="cs-message">
                            Message <span className="contact-support__required">*</span>
                        </label>
                        <textarea
                            id="cs-message"
                            name="message"
                            className="contact-support__textarea"
                            value={form.message}
                            onChange={handleChange}
                            placeholder="Describe your issue or question in detail…"
                            rows={5}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="contact-support__submit"
                        disabled={loading}
                    >
                        {loading ? 'Sending…' : 'Send Message'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactUsSupport;
