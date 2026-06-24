import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from './PageHeader';

const FLASHCARDS_LOGIN_URL = import.meta.env.VITE_FLASHCARDS_URL
    ? `${import.meta.env.VITE_FLASHCARDS_URL}/sign-in`
    : 'https://myflashcardsapp.com/sign-in';

// ─── GuestUpgradeSuccess ──────────────────────────────────────────────────────
// Landing page after a Guest user completes the Stripe subscription checkout.
// The Stripe webhook (POST /stripe-api/webhook-subscription) handles updating
// the user's SubscriptionType in the database. This page simply confirms success
// and prompts the user to log in again so their new JWT reflects the upgrade.

export default function GuestUpgradeSuccess() {
    const navigate  = useNavigate();
    const [countdown, setCountdown] = useState(10);

    // Auto-redirect to flashcards login after countdown
    useEffect(() => {
        if (countdown <= 0) {
            window.location.href = FLASHCARDS_LOGIN_URL;
            return;
        }
        const t = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [countdown]);

    return (
        <>
            <PageHeader />
            <div style={s.page}>
                <div style={s.card}>
                    <div style={s.icon}>🎉</div>

                    <h1 style={s.title}>Subscription Activated!</h1>

                    <p style={s.body}>
                        Your payment was successful. Your account has been upgraded — you
                        now have full access to <strong>My FlashCards</strong>.
                    </p>

                    <div style={s.infoBox}>
                        <strong>Next step:</strong> Log back in to My FlashCards so your
                        session reflects the new subscription.
                    </div>

                    <a href={FLASHCARDS_LOGIN_URL} style={s.loginBtn}>
                        🔐 Log In to My FlashCards
                    </a>

                    <p style={s.countdown}>
                        Redirecting automatically in <strong>{countdown}s</strong>…
                    </p>

                    <button onClick={() => navigate('/guest-upgrade')} style={s.backLink}>
                        ← Back to upgrade page
                    </button>
                </div>

                <style>{`
                    @keyframes popIn {
                        from { opacity: 0; transform: scale(0.9) translateY(20px); }
                        to   { opacity: 1; transform: scale(1)   translateY(0); }
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    card: {
        background: '#fff',
        borderRadius: 24,
        boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
        padding: '48px 40px',
        maxWidth: 480,
        width: '100%',
        textAlign: 'center',
        animation: 'popIn 0.4s ease-out',
    },
    icon: {
        fontSize: '3.5rem',
        marginBottom: 16,
    },
    title: {
        fontSize: '1.9rem',
        fontWeight: 800,
        color: '#111827',
        margin: '0 0 16px',
    },
    body: {
        fontSize: '1rem',
        color: '#374151',
        lineHeight: 1.6,
        margin: '0 0 24px',
    },
    infoBox: {
        background: '#eff6ff',
        border: '1.5px solid #bfdbfe',
        borderRadius: 12,
        padding: '14px 18px',
        fontSize: '0.9rem',
        color: '#1e40af',
        marginBottom: 28,
        lineHeight: 1.5,
    },
    loginBtn: {
        display: 'block',
        background: '#007A76',
        color: '#fff',
        textDecoration: 'none',
        padding: '14px 24px',
        borderRadius: 12,
        fontWeight: 700,
        fontSize: '1rem',
        marginBottom: 16,
        transition: 'opacity 0.2s',
    },
    countdown: {
        fontSize: '0.85rem',
        color: '#9ca3af',
        margin: '0 0 20px',
    },
    backLink: {
        background: 'none',
        border: 'none',
        color: '#6b7280',
        fontSize: '0.85rem',
        cursor: 'pointer',
        textDecoration: 'underline',
        padding: 0,
    },
};
