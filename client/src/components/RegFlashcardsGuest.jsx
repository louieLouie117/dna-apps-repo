import React, { useState, useEffect } from 'react';
import PageHeader from './PageHeader';

const API_BASE_URL   = import.meta.env.VITE_API_BASE_URL;
const FLASHCARDS_URL = import.meta.env.VITE_FLASHCARDS_URL || 'https://myflashcardsapp.com';

// ─── RegFlashcardsGuest ───────────────────────────────────────────────────────
// Registration page for guests who purchased a flashcard stack without an account.
// Verifies their Stripe purchase access token(s) from localStorage, then creates
// a Guest account so they can log in from any device.

const RegFlashcardsGuest = () => {
  const [verifying, setVerifying]     = useState(true);
  const [purchasedIds, setPurchasedIds] = useState([]);   // productIds unlocked by tokens
  const [tokens, setTokens]           = useState([]);     // validated tokens from localStorage
  const [noPurchase, setNoPurchase]   = useState(false);  // true if no valid tokens found

  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState(false);

  // ── On mount: verify localStorage tokens against the server ───────────────
  useEffect(() => {
    const verify = async () => {
      try {
        const stored = JSON.parse(localStorage.getItem('flashcard_access_tokens') || '[]');
        if (!stored.length) { setNoPurchase(true); setVerifying(false); return; }

        const res = await fetch(
          `${API_BASE_URL}/flashcards-api/products/guest-access?tokens=${stored.map(encodeURIComponent).join(',')}`
        );
        const data = await res.json();

        if (res.ok && data.success && data.productIds?.length) {
          setTokens(stored);
          setPurchasedIds(data.productIds);
        } else {
          setNoPurchase(true);
        }
      } catch {
        setNoPurchase(true);
      } finally {
        setVerifying(false);
      }
    };
    verify();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/create-flashcard-guest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username:     formData.username,
          password:     formData.password,
          accessTokens: tokens,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed. Please try again.');
        return;
      }

      // Clear tokens from localStorage — they are now linked to the account
      localStorage.removeItem('flashcard_access_tokens');
      setSuccess(true);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Verifying ─────────────────────────────────────────────────────────────
  if (verifying) {
    return (
      <div style={s.page}>
        <PageHeader />
        <div style={s.card}>
          <div style={s.spinner} />
          <p style={s.hint}>Verifying your purchase…</p>
        </div>
      </div>
    );
  }

  // ── No valid purchase ─────────────────────────────────────────────────────
  if (noPurchase) {
    return (
      <div style={s.page}>
        <PageHeader />
        <div style={s.card}>
          <div style={s.iconWrap}>🔍</div>
          <h2 style={s.title}>No Purchase Found</h2>
          <p style={s.body}>
            We couldn't find a valid flashcard purchase linked to this browser.
            Purchases are stored locally — if you cleared your browser data or are
            on a different device, your access token may be missing.
          </p>
          <p style={s.body}>
            If you believe this is an error, please contact support with your
            Stripe receipt email.
          </p>
          <a href={`${FLASHCARDS_URL}`} style={s.ctaBtn}>
            Browse Flashcard Stacks →
          </a>
        </div>
      </div>
    );
  }

  // ── Success ───────────────────────────────────────────────────────────────
  if (success) {
    return (
      <div style={s.page}>
        <PageHeader />
        <div style={s.card}>
          <div style={s.iconWrap}>🎉</div>
          <h2 style={s.title}>Account Created!</h2>
          <p style={s.body}>
            Your Guest account has been set up. You can now log in to{' '}
            <strong>My FlashCards</strong> from any device and access your
            purchased stacks.
          </p>
          <div style={s.infoBox}>
            ✅ Your purchase{purchasedIds.length > 1 ? 's are' : ' is'} linked to your
            account — no tokens needed.
          </div>
          <a href={`${FLASHCARDS_URL}/login`} style={s.ctaBtn}>
            Log in to My FlashCards →
          </a>
        </div>
      </div>
    );
  }

  // ── Registration form ─────────────────────────────────────────────────────
  return (
    <div style={s.page}>
      <PageHeader />
      <div style={s.card}>

        <div style={s.iconWrap}>🃏</div>
        <h2 style={s.title}>Create Your Free Account</h2>
        <p style={s.subtitle}>
          Link your flashcard purchase to an account so you can study from any device.
        </p>

        {/* Purchase confirmation badge */}
        <div style={s.purchaseBadge}>
          ✅ {purchasedIds.length} purchased stack{purchasedIds.length !== 1 ? 's' : ''} found
        </div>

        {error && <div style={s.errorBox}>{error}</div>}

        <form style={s.form} onSubmit={handleSubmit}>

          <div style={s.field}>
            <label htmlFor="username" style={s.label}>Email address</label>
            <input
              type="email"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              style={s.input}
            />
          </div>

          <div style={s.field}>
            <label htmlFor="password" style={s.label}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="At least 8 characters"
              style={s.input}
            />
          </div>

          <div style={s.field}>
            <label htmlFor="confirmPassword" style={s.label}>Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Repeat your password"
              style={s.input}
            />
          </div>

          <div style={s.noteBox}>
            <strong>Note:</strong> This creates a <em>Guest</em> account giving you access
            to your purchased stacks. It does not include a subscription to other DNA Apps.
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ ...s.submitBtn, ...(loading ? s.submitBtnDisabled : {}) }}
          >
            {loading ? 'Creating account…' : 'Create Account & Link Purchase'}
          </button>

        </form>

        <p style={s.loginHint}>
          Already have an account?{' '}
          <a href={`${FLASHCARDS_URL}/login`} style={s.link}>Log in here</a>
        </p>

      </div>
    </div>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  page: {
    margin: '0 auto',
    padding: '20px 16px 60px',
  },
  card: {
    maxWidth: 480,
    margin: '32px auto 0',
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 4px 24px rgba(0,122,118,0.10)',
    border: '1px solid #e2f4f3',
    padding: '36px 32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    fontSize: '3rem',
    lineHeight: 1,
  },
  title: {
    fontSize: '1.4rem',
    fontWeight: 800,
    color: '#0f172a',
    margin: 0,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '0.9rem',
    color: '#64748b',
    margin: 0,
    textAlign: 'center',
    lineHeight: 1.5,
  },
  body: {
    fontSize: '0.92rem',
    color: '#475569',
    margin: 0,
    textAlign: 'center',
    lineHeight: 1.6,
  },
  purchaseBadge: {
    background: '#f0faf9',
    border: '1px solid #a7f3d0',
    color: '#007a76',
    fontSize: '0.82rem',
    fontWeight: 700,
    padding: '7px 16px',
    borderRadius: 999,
  },
  infoBox: {
    width: '100%',
    background: '#f0faf9',
    border: '1px solid #a7f3d0',
    borderRadius: 10,
    padding: '12px 16px',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#007a76',
    textAlign: 'center',
    boxSizing: 'border-box',
  },
  errorBox: {
    width: '100%',
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: '0.85rem',
    color: '#dc2626',
    boxSizing: 'border-box',
  },
  noteBox: {
    width: '100%',
    background: '#fffbeb',
    border: '1px solid #fcd34d',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: '0.8rem',
    color: '#92400e',
    boxSizing: 'border-box',
    lineHeight: 1.5,
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    width: '100%',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#374151',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #cbd5e1',
    borderRadius: 8,
    fontSize: '0.92rem',
    color: '#0f172a',
    outline: 'none',
    boxSizing: 'border-box',
  },
  submitBtn: {
    width: '100%',
    padding: '12px 20px',
    background: 'linear-gradient(135deg, #007a76, #005f5b)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: '0.95rem',
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: '0.2px',
    marginTop: 4,
  },
  submitBtnDisabled: {
    opacity: 0.65,
    cursor: 'not-allowed',
  },
  ctaBtn: {
    display: 'block',
    width: '100%',
    padding: '12px 20px',
    background: 'linear-gradient(135deg, #007a76, #005f5b)',
    color: '#fff',
    borderRadius: 10,
    fontSize: '0.92rem',
    fontWeight: 700,
    textDecoration: 'none',
    textAlign: 'center',
    boxSizing: 'border-box',
  },
  loginHint: {
    fontSize: '0.82rem',
    color: '#64748b',
    margin: 0,
  },
  link: {
    color: '#007a76',
    fontWeight: 600,
  },
  spinner: {
    width: 36,
    height: 36,
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #007a76',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  hint: {
    fontSize: '0.88rem',
    color: '#64748b',
    margin: 0,
  },
};

export default RegFlashcardsGuest;
