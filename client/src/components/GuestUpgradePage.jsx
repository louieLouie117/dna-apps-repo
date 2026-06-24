import { useState } from 'react';
import PageHeader from './PageHeader';

// ─── Price IDs ────────────────────────────────────────────────────────────────
// NOTE: Both IDs below were provided as the same value. Update MY_FLASHCARDS_PRICE_ID
// when you have the correct single-app price ID from your Stripe dashboard.
const ALL_APP_PRICE_ID       = 'price_1ScUlBBmDU7eVTdzOFMOhdTe';
const MY_FLASHCARDS_PRICE_ID = 'price_1ScVowBmDU7eVTdzRhGQXzt2';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Try to decode email from stored JWT
const getEmailFromToken = () => {
    try {
        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        if (!token) return '';
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.email || payload.username || '';
    } catch {
        return '';
    }
};

const PLANS = [
    {
        id: 'flashcards',
        priceId: MY_FLASHCARDS_PRICE_ID,
        icon: '',
        name: 'My FlashCards',
        tagline: 'Single App Access',
        features: [
            'Full access to My FlashCards',
            'Create unlimited stacks & cards',
            'Study your purchased stacks',
            'PWA — install on any device',
        ],
        color: '#007A76',
        highlight: false,
    },
    {
        id: 'all-access',
        priceId: ALL_APP_PRICE_ID,
        icon: '🚀',
        name: 'All App Access',
        tagline: 'Best Value',
        features: [
            'Everything in My FlashCards',
            'My Budget Monthly',
            'My Locked Passwords',
            'My Todo List',
            'All future apps included',
        ],
        color: '#4f46e5',
        highlight: true,
    },
];

export default function GuestUpgradePage() {
    const [email, setEmail] = useState(getEmailFromToken);
    const [loadingPlan, setLoadingPlan] = useState(null); // plan id while fetching
    const [error, setError] = useState('');

    const handleUpgrade = async (plan) => {
        setError('');
        setLoadingPlan(plan.id);

        try {
            const token = localStorage.getItem('authToken') || localStorage.getItem('token') || '';
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${API_BASE_URL}/api/guest-upgrade`, {
                method: 'POST',
                headers,
                credentials: 'include',
                body: JSON.stringify({ priceId: plan.priceId, email: email.trim() || undefined }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Something went wrong. Please try again.');
                return;
            }

            // Redirect to Stripe Checkout
            window.location.href = data.checkoutUrl;

        } catch (err) {
            console.error('[GuestUpgradePage] fetch error:', err);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoadingPlan(null);
        }
    };

    return (
        <>
            <PageHeader />
            <div style={s.page}>
                {/* Hero */}
                <div style={s.hero}>
                    <h1 style={s.heroTitle}>Upgrade Your Account</h1>
                    <p style={s.heroSub}>
                        You're currently on a <strong>Guest</strong> account. Subscribe to unlock
                        full access and create unlimited content.
                    </p>
                </div>

                {/* Email pre-fill (helps Stripe pre-populate checkout) */}
                <div style={s.emailRow}>
                    <label style={s.emailLabel} htmlFor="upgrade-email">
                        Your email (optional — pre-fills checkout)
                    </label>
                    <input
                        id="upgrade-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        style={s.emailInput}
                    />
                </div>

                {/* Error */}
                {error && <div style={s.errorBanner}>{error}</div>}

                {/* Plan Cards */}
                <div style={s.plans}>
                    {PLANS.map((plan) => (
                        <div
                            key={plan.id}
                            style={{
                                ...s.card,
                                ...(plan.highlight ? s.cardHighlight : {}),
                            }}
                        >
                            {plan.highlight && (
                                <div style={s.bestValueBadge}>⭐ Best Value</div>
                            )}

                            <div style={s.planIcon}>{plan.icon}</div>
                            <h2 style={{ ...s.planName, color: plan.color }}>{plan.name}</h2>
                            <p style={s.planTagline}>{plan.tagline}</p>

                            <ul style={s.featureList}>
                                {plan.features.map((f) => (
                                    <li key={f} style={s.featureItem}>
                                        <span style={s.check}>✓</span> {f}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleUpgrade(plan)}
                                disabled={loadingPlan !== null}
                                style={{
                                    ...s.upgradeBtn,
                                    background: plan.color,
                                    opacity: loadingPlan !== null ? 0.7 : 1,
                                    cursor: loadingPlan !== null ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {loadingPlan === plan.id ? (
                                    <><span style={s.spinner} /> Redirecting...</>
                                ) : (
                                    `Subscribe to ${plan.name}`
                                )}
                            </button>
                        </div>
                    ))}
                </div>

                <p style={s.footNote}>
                    Subscriptions are managed through{' '}
                    <strong>Stripe</strong>. Cancel anytime from your Stripe customer portal.
                </p>

                <style>{`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to   { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        </>
    );
}

const s = {
    page: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%)',
        padding: '40px 20px 60px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    hero: {
        textAlign: 'center',
        maxWidth: 560,
        marginBottom: 32,
    },
    heroTitle: {
        fontSize: '2rem',
        fontWeight: 800,
        color: '#111827',
        margin: '0 0 12px',
    },
    heroSub: {
        fontSize: '1.05rem',
        color: '#6b7280',
        margin: 0,
        lineHeight: 1.6,
    },
    emailRow: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        width: '100%',
        maxWidth: 400,
        marginBottom: 24,
    },
    emailLabel: {
        fontSize: '0.85rem',
        fontWeight: 600,
        color: '#374151',
    },
    emailInput: {
        padding: '12px 14px',
        border: '2px solid #d1d5db',
        borderRadius: 10,
        fontSize: '1rem',
        outline: 'none',
        boxSizing: 'border-box',
    },
    errorBanner: {
        background: '#fef2f2',
        color: '#dc2626',
        border: '1.5px solid #fca5a5',
        borderRadius: 10,
        padding: '12px 18px',
        marginBottom: 20,
        maxWidth: 640,
        width: '100%',
        fontSize: '0.9rem',
    },
    plans: {
        display: 'flex',
        gap: 24,
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
        maxWidth: 760,
    },
    card: {
        background: '#fff',
        borderRadius: 20,
        padding: '32px 28px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        border: '2px solid #e5e7eb',
        flex: '1 1 280px',
        maxWidth: 340,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
    },
    cardHighlight: {
        border: '2px solid #4f46e5',
        boxShadow: '0 8px 32px rgba(79,70,229,0.15)',
    },
    bestValueBadge: {
        position: 'absolute',
        top: -14,
        background: '#4f46e5',
        color: '#fff',
        fontSize: '0.75rem',
        fontWeight: 700,
        padding: '4px 14px',
        borderRadius: 20,
        letterSpacing: '0.04em',
    },
    planIcon: {
        fontSize: '2.5rem',
        marginBottom: 10,
    },
    planName: {
        fontSize: '1.4rem',
        fontWeight: 800,
        margin: '0 0 4px',
    },
    planTagline: {
        fontSize: '0.85rem',
        color: '#6b7280',
        margin: '0 0 20px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
    },
    featureList: {
        listStyle: 'none',
        padding: 0,
        margin: '0 0 24px',
        width: '100%',
        textAlign: 'left',
    },
    featureItem: {
        fontSize: '0.9rem',
        color: '#374151',
        padding: '5px 0',
        display: 'flex',
        gap: 8,
        alignItems: 'flex-start',
    },
    check: {
        color: '#16a34a',
        fontWeight: 700,
        flexShrink: 0,
    },
    upgradeBtn: {
        width: '100%',
        padding: '14px 20px',
        color: '#fff',
        border: 'none',
        borderRadius: 12,
        fontSize: '1rem',
        fontWeight: 700,
        marginTop: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        transition: 'opacity 0.2s',
    },
    spinner: {
        width: 16,
        height: 16,
        border: '2px solid rgba(255,255,255,0.35)',
        borderTop: '2px solid #fff',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        display: 'inline-block',
    },
    footNote: {
        marginTop: 32,
        fontSize: '0.82rem',
        color: '#9ca3af',
        textAlign: 'center',
        maxWidth: 400,
    },
};
