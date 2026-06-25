import React, { useState } from 'react';
import PageHeader from './PageHeader';
import flashcardsLogo from '../assets/AppLogos/app-logo-flashcards.png';

// ─── GuestAccountPage ─────────────────────────────────────────────────────────
// Pre-purchase guest registration page at /guest-account.
// Reached via redirect from CheckoutAuthModal when the user picks "No account".
//
// Flow:
//   1. Collects email + password.
//   2. POST /api/create-guest-account → creates a Guest user and returns a JWT.
//   3. Redirects back to the flashcards seller page:
//        <returnTo>?authToken=<jwt>&autoProductId=<productId>
//      SellerProfile stores the JWT, auto-opens the checkout modal, and the
//      user proceeds to Stripe as an authenticated Guest — purchase is linked
//      to their account immediately.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const emailRe     = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function GuestAccountPage() {
    // Read returnTo and productId from URL search params
    const params    = new URLSearchParams(window.location.search);
    const returnTo  = params.get('returnTo')  || '';
    const productId = params.get('productId') || '';

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm,  setConfirm]  = useState('');
    const [showPass, setShowPass] = useState(false);
    const [showConf, setShowConf] = useState(false);
    const [error,    setError]    = useState('');
    const [loading,  setLoading]  = useState(false);
    const [done,     setDone]     = useState(false); // fallback if no returnTo

    const validate = () => {
        if (!username.trim() || !emailRe.test(username.trim()))
            return 'Enter a valid email address.';
        if (password.length < 8)
            return 'Password must be at least 8 characters.';
        if (password !== confirm)
            return 'Passwords do not match.';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validate();
        if (err) { setError(err); return; }
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/create-guest-account`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username.trim(), password }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Registration failed. Please try again.');
                return;
            }

            if (returnTo && data.token) {
                // Redirect back to the flashcards seller page with the JWT
                const url = new URL(returnTo);
                url.searchParams.set('authToken', data.token);
                if (productId) url.searchParams.set('autoProductId', productId);
                window.location.href = url.toString();
            } else {
                // Fallback: no returnTo — just show success
                setDone(true);
            }
        } catch {
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    // ── Fallback success (no returnTo) ────────────────────────────────────────
    if (done) {
        return (
            <>
                <PageHeader />
                <div style={s.page}>
                    <div style={s.card}>
                        <div style={s.iconWrap}>✅</div>
                        <h2 style={s.title}>Account Created!</h2>
                        <p style={s.body}>
                            Your free Guest account is ready. Sign in to My FlashCards
                            to access your purchases.
                        </p>
                        <a
                            href={import.meta.env.VITE_FLASHCARDS_URL || 'https://myflashcardsapp.com'}
                            style={s.goBtn}
                        >
                            Go to My FlashCards →
                        </a>
                    </div>
                </div>
            </>
        );
    }

    // ── Registration form ─────────────────────────────────────────────────────
    return (
        <>
            <PageHeader />
            <div style={s.page}>
                <div style={s.card}>

                    {/* Hero */}
                    <div style={s.hero}>
                        <img
                            src={flashcardsLogo}
                            alt="My FlashCards"
                            style={s.appLogo}
                        />
                        {/* <div style={s.heroIcon}>🔐</div> */}
                        <h1 style={s.title}>Create Your Free Account</h1>
                        <p style={s.body}>
                            No subscription required. Your account is used to save
                            your purchases so you can study from any device.
                        </p>
                    </div>

                    {/* What you get */}
                    <ul style={s.featureList}>
                        {[
                            'Access your purchased stacks from any device',
                            'No subscription required — just your purchase',
                            'Upgrade to full access anytime',
                        ].map(f => (
                            <li key={f} style={s.featureItem}>
                                <span style={s.check}>✓</span> {f}
                            </li>
                        ))}
                    </ul>

                    {/* Error */}
                    {error && <div style={s.errorBanner}>{error}</div>}

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={s.form} noValidate>

                        {/* Email */}
                        <div style={s.field}>
                            <label style={s.label} htmlFor="ga-email">Email</label>
                            <input
                                id="ga-email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                value={username}
                                onChange={e => { setUsername(e.target.value); setError(''); }}
                                style={s.input}
                                required
                            />
                        </div>

                        {/* Password */}
                        <div style={s.field}>
                            <label style={s.label} htmlFor="ga-pass">Password</label>
                            <div style={s.inputWrap}>
                                <input
                                    id="ga-pass"
                                    type={showPass ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    placeholder="Min. 8 characters"
                                    value={password}
                                    onChange={e => { setPassword(e.target.value); setError(''); }}
                                    style={{ ...s.input, ...s.inputWithBtn }}
                                    required
                                />
                                <button
                                    type="button"
                                    style={s.toggleBtn}
                                    onClick={() => setShowPass(v => !v)}
                                    aria-label={showPass ? 'Hide password' : 'Show password'}
                                >
                                    {showPass ? '🙈' : '👁'}
                                </button>
                            </div>
                        </div>

                        {/* Confirm password */}
                        <div style={s.field}>
                            <label style={s.label} htmlFor="ga-confirm">Confirm Password</label>
                            <div style={s.inputWrap}>
                                <input
                                    id="ga-confirm"
                                    type={showConf ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    placeholder="Re-enter password"
                                    value={confirm}
                                    onChange={e => { setConfirm(e.target.value); setError(''); }}
                                    style={{ ...s.input, ...s.inputWithBtn }}
                                    required
                                />
                                <button
                                    type="button"
                                    style={s.toggleBtn}
                                    onClick={() => setShowConf(v => !v)}
                                    aria-label={showConf ? 'Hide password' : 'Show password'}
                                >
                                    {showConf ? '🙈' : '👁'}
                                </button>
                            </div>
                        </div>

                        <p style={s.privacyNote}>
                            🔒 Your information is only used to create your account and is never shared.
                        </p>

                        <button
                            type="submit"
                            style={{ ...s.submitBtn, ...(loading ? s.btnDisabled : {}) }}
                            disabled={loading}
                        >
                            {loading ? (
                                <><span style={s.spinner} /> Creating account…</>
                            ) : (
                                'Create Account & Continue to Checkout →'
                            )}
                        </button>

                    </form>

                    <p style={s.signInHint}>
                        Already have an account?{' '}
                        <a
                            href={import.meta.env.VITE_FLASHCARDS_URL || 'https://myflashcardsapp.com'}
                            style={s.signInLink}
                        >
                            Sign in to My FlashCards
                        </a>
                    </p>

                </div>
            </div>
        </>
    );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
    page: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0fdf4 0%, #f0faf9 100%)',
        padding: '32px 20px 60px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    card: {
        background: '#fff',
        borderRadius: 20,
        boxShadow: '0 4px 32px rgba(0,122,118,0.10)',
        border: '1px solid #e2f4f3',
        maxWidth: 460,
        width: '100%',
        padding: '36px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
    },
    hero: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        textAlign: 'center',
    },
    appLogo: {
        width: 72,
        height: 72,
        borderRadius: 16,
        objectFit: 'contain',
        boxShadow: '0 4px 16px rgba(0,122,118,0.18)',
        marginBottom: 4,
    },
    heroIcon: {
        fontSize: '2.5rem',
    },
    title: {
        fontSize: '1.4rem',
        fontWeight: 800,
        color: '#0f172a',
        margin: 0,
        textAlign: 'center',
    },
    body: {
        fontSize: '0.88rem',
        color: '#64748b',
        margin: 0,
        lineHeight: 1.6,
        textAlign: 'center',
    },
    featureList: {
        listStyle: 'none',
        margin: 0,
        background: '#f0faf9',
        border: '1px solid #a7f3d0',
        borderRadius: 12,
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
    },
    featureItem: {
        fontSize: '0.83rem',
        color: '#0f172a',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
    },
    check: {
        color: '#007a76',
        fontWeight: 800,
        flexShrink: 0,
    },
    errorBanner: {
        background: '#fef2f2',
        color: '#dc2626',
        border: '1.5px solid #fca5a5',
        borderRadius: 10,
        padding: '12px 16px',
        fontSize: '0.85rem',
        lineHeight: 1.5,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
    },
    label: {
        fontSize: '0.75rem',
        fontWeight: 700,
        color: '#374151',
        textTransform: 'uppercase',
        letterSpacing: '0.3px',
    },
    inputWrap: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },
    input: {
        width: '100%',
        boxSizing: 'border-box',
        padding: '11px 14px',
        border: '1.5px solid #e2e8f0',
        borderRadius: 10,
        fontSize: '0.9rem',
        color: '#0f172a',
        background: '#f8fafc',
        outline: 'none',
    },
    inputWithBtn: {
        paddingRight: 44,
    },
    toggleBtn: {
        position: 'absolute',
        right: 10,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1rem',
        padding: '4px',
        color: '#64748b',
    },
    privacyNote: {
        fontSize: '0.72rem',
        color: '#94a3b8',
        margin: 0,
        lineHeight: 1.4,
        textAlign: 'center',
    },
    submitBtn: {
        width: '100%',
        padding: '13px 16px',
        background: 'linear-gradient(135deg, #007a76, #005f5b)',
        color: '#fff',
        border: 'none',
        borderRadius: 12,
        fontSize: '0.95rem',
        fontWeight: 700,
        cursor: 'pointer',
        letterSpacing: '0.2px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 4,
    },
    btnDisabled: {
        opacity: 0.65,
        cursor: 'not-allowed',
    },
    spinner: {
        width: 16,
        height: 16,
        border: '2px solid rgba(255,255,255,0.4)',
        borderTop: '2px solid #fff',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        display: 'inline-block',
    },
    signInHint: {
        fontSize: '0.8rem',
        color: '#64748b',
        textAlign: 'center',
        margin: 0,
    },
    signInLink: {
        color: '#007a76',
        fontWeight: 600,
        textDecoration: 'underline',
    },
    // Fallback success styles
    iconWrap: {
        fontSize: '2.5rem',
        textAlign: 'center',
    },
    goBtn: {
        display: 'block',
        width: '100%',
        boxSizing: 'border-box',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #007a76, #005f5b)',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: 12,
        padding: '13px 20px',
        fontSize: '0.95rem',
        fontWeight: 700,
        marginTop: 8,
    },
};
