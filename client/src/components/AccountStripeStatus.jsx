import { useEffect, useState, useRef } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function formatDate(unixTs) {
    if (!unixTs) return '—';
    return new Date(unixTs * 1000).toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric',
    });
}

function formatAmount(amount, currency) {
    if (amount == null) return '—';
    return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: (currency || 'usd').toUpperCase(),
    }).format(amount / 100);
}

const STATUS_CONFIG = {
    active:    { label: 'Active',     bg: '#ecfdf5', color: '#065f46', border: '#a7f3d0' },
    trialing:  { label: 'Trialing',   bg: '#eff6ff', color: '#1e40af', border: '#93c5fd' },
    past_due:  { label: 'Past Due',   bg: '#fff7ed', color: '#9a3412', border: '#fdba74' },
    canceled:  { label: 'Canceled',   bg: '#fef2f2', color: '#991b1b', border: '#fca5a5' },
    unpaid:    { label: 'Unpaid',     bg: '#fef2f2', color: '#991b1b', border: '#fca5a5' },
    default:   { label: 'Unknown',    bg: '#f9fafb', color: '#374151', border: '#d1d5db' },
};

function StatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.default;
    return (
        <span style={{
            background: cfg.bg,
            color: cfg.color,
            border: `1px solid ${cfg.border}`,
            padding: '3px 12px',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.4px',
        }}>
            {cfg.label}
        </span>
    );
}

export default function AccountStripeStatus() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionMessage, setActionMessage] = useState(null);

    // Cancellation modal state
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [cancelReasonOther, setCancelReasonOther] = useState('');
    const modalRef = useRef(null);

    const authHeaders = () => {
        const token = localStorage.getItem('authToken');
        const h = { 'Content-Type': 'application/json' };
        if (token) h['Authorization'] = `Bearer ${token}`;
        return h;
    };

    const fetchStatus = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE_URL}/stripe-api/subscription-status`, {
                method: 'GET',
                credentials: 'include',
                headers: authHeaders(),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.error || 'Failed to load subscription');
            setData(json);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStatus(); }, []);

    // Close modal on backdrop click
    const handleBackdropClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            setShowCancelModal(false);
        }
    };

    const handleCancelSubmit = async () => {
        if (!data?.subscription?.id) return;
        const finalReason = cancelReason === 'Other'
            ? (cancelReasonOther.trim() || 'Other')
            : (cancelReason || null);

        setActionLoading(true);
        setActionMessage(null);
        try {
            const res = await fetch(`${API_BASE_URL}/stripe-api/cancel-subscription`, {
                method: 'POST',
                credentials: 'include',
                headers: authHeaders(),
                body: JSON.stringify({
                    subscriptionId: data.subscription.id,
                    reason: finalReason,
                }),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            setActionMessage({ type: 'success', text: json.message });
            setShowCancelModal(false);
            setCancelReason('');
            setCancelReasonOther('');
            await fetchStatus();
        } catch (err) {
            setActionMessage({ type: 'error', text: err.message });
        } finally {
            setActionLoading(false);
        }
    };

    const handleReactivate = async () => {
        if (!data?.subscription?.id) return;
        setActionLoading(true);
        setActionMessage(null);
        try {
            const res = await fetch(`${API_BASE_URL}/stripe-api/reactivate-subscription`, {
                method: 'POST',
                credentials: 'include',
                headers: authHeaders(),
                body: JSON.stringify({ subscriptionId: data.subscription.id }),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            setActionMessage({ type: 'success', text: json.message });
            await fetchStatus();
        } catch (err) {
            setActionMessage({ type: 'error', text: err.message });
        } finally {
            setActionLoading(false);
        }
    };

    // ── Loading ────────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div style={styles.card}>
                <div style={styles.loadingRow}>
                    <div style={styles.spinner} />
                    <span style={styles.mutedText}>Loading subscription info...</span>
                </div>
            </div>
        );
    }

    // ── Error ──────────────────────────────────────────────────────────────────
    if (error) {
        return (
            <div style={{ ...styles.card, borderColor: '#fca5a5', background: '#fef2f2' }}>
                <p style={{ margin: 0, color: '#991b1b', fontSize: '0.9rem' }}>
                    ⚠️ {error}
                </p>
                <button style={styles.retryBtn} onClick={fetchStatus}>Retry</button>
            </div>
        );
    }

    // ── No Stripe customer ─────────────────────────────────────────────────────
    if (!data?.hasCustomer) {
        return (
            <div style={styles.card}>
                <h3 style={styles.cardTitle}>Stripe Subscription</h3>
                <p style={styles.mutedText}>No Stripe account found for your email address. Please contact support for assistance if you used PayPal or you feel this is an error.</p>
                <a href="/contact-us-1.html">Contact Support</a>
            </div>
        );
    }

    const { customer, subscription } = data;

    return (
        <>
            {/* ── Cancellation Feedback Modal ──────────────────────────────────── */}
            {showCancelModal && (
                <div style={styles.backdrop} onMouseDown={handleBackdropClick}>
                    <div ref={modalRef} style={styles.modal}>
                        <h3 style={styles.modalTitle}>Cancel Subscription</h3>
                        <p style={styles.modalSubtitle}>
                            We're sorry to see you go. 
                            Please let us know why you're canceling so we can improve our service.
                        </p>

                        <label style={styles.modalLabel}>
                            What's your reason for canceling? <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span>
                        </label>
                        <select
                            style={styles.modalSelect}
                            value={cancelReason}
                            onChange={e => setCancelReason(e.target.value)}
                        >
                            <option value="">Select a reason...</option>
                            <option value="Too expensive">Too expensive</option>
                            <option value="Not using it enough">Not using it enough</option>
                            <option value="Missing features I need">Missing features I need</option>
                            <option value="Switching to another service">Switching to another service</option>
                            <option value="Technical issues">Technical issues</option>
                            <option value="Other">Other</option>
                        </select>

                        {cancelReason === 'Other' && (
                            <textarea
                                style={styles.modalTextarea}
                                placeholder="Tell us more..."
                                maxLength={255}
                                value={cancelReasonOther}
                                onChange={e => setCancelReasonOther(e.target.value)}
                            />
                        )}

                        <div style={styles.modalActions}>
                            <button
                                style={{ ...styles.btn, ...styles.btnGhost }}
                                onClick={() => { setShowCancelModal(false); setCancelReason(''); setCancelReasonOther(''); }}
                                disabled={actionLoading}
                            >
                                Keep Subscription
                            </button>
                            <button
                                style={{ ...styles.btn, ...styles.btnRed }}
                                onClick={handleCancelSubmit}
                                disabled={actionLoading}
                            >
                                {actionLoading ? 'Processing...' : 'Send Feedback & Cancel'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Main Card ─────────────────────────────────────────────────────── */}
            <div style={styles.card}>
                <h3 style={styles.cardTitle}>Stripe Subscription</h3>

                {/* Customer row */}
                <div style={styles.row}>
                    <span style={styles.label}>Billing Email</span>
                    <span style={styles.value}>{customer.email}</span>
                </div>

                {subscription ? (
                    <>
                        {/* Status */}
                        <div style={styles.row}>
                            <span style={styles.label}>Status</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <StatusBadge status={subscription.status} />
                                {subscription.cancelAtPeriodEnd && (
                                    <span style={styles.cancelWarning}>Cancels at period end</span>
                                )}
                            </div>
                        </div>

                        {/* Product */}
                        {subscription.items?.[0]?.productName && (
                            <div style={styles.row}>
                                <span style={styles.label}>Plan</span>
                                <span style={styles.value}>{subscription.items[0].productName}</span>
                            </div>
                        )}

                        {/* Price */}
                        <div style={styles.row}>
                            <span style={styles.label}>Price</span>
                            <span style={styles.value}>
                                {formatAmount(subscription.items?.[0]?.amount, subscription.items?.[0]?.currency)}
                                {subscription.items?.[0]?.interval ? ` / ${subscription.items[0].interval}` : ''}
                            </span>
                        </div>

                        {/* Period */}
                        <div style={styles.row}>
                            <span style={styles.label}>Current Period</span>
                            <span style={styles.value}>
                                {formatDate(subscription.currentPeriodStart)} – {formatDate(subscription.currentPeriodEnd)}
                            </span>
                        </div>

                        {subscription.canceledAt && (
                            <div style={styles.row}>
                                <span style={styles.label}>Canceled On</span>
                                <span style={{ ...styles.value, color: '#dc2626' }}>{formatDate(subscription.canceledAt)}</span>
                            </div>
                        )}

                        {/* Action message */}
                        {actionMessage && (
                            <div style={{
                                ...styles.actionMsg,
                                background: actionMessage.type === 'success' ? '#ecfdf5' : '#fef2f2',
                                color: actionMessage.type === 'success' ? '#065f46' : '#991b1b',
                                borderColor: actionMessage.type === 'success' ? '#a7f3d0' : '#fca5a5',
                            }}>
                                {actionMessage.text}
                            </div>
                        )}

                        {/* Action buttons */}
                        <div style={styles.actions}>
                            {subscription.cancelAtPeriodEnd || subscription.status === 'canceled' ? (
                                <button
                                    style={{ ...styles.btn, ...styles.btnGreen }}
                                    onClick={handleReactivate}
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? 'Processing...' : 'Reactivate Subscription'}
                                </button>
                            ) : (
                                subscription.status !== 'canceled' && (
                                    <button
                                        style={{ ...styles.btn, ...styles.btnRed }}
                                        onClick={() => setShowCancelModal(true)}
                                        disabled={actionLoading}
                                    >
                                        Cancel Subscription
                                    </button>
                                )
                            )}
                        </div>
                    </>
                ) : (
                    <p style={styles.mutedText}>No active subscription found.</p>
                )}
            </div>
        </>
    );
}

const styles = {
    card: {
        background: '#fff',
        border: '2px solid #e5e7eb',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto',
        boxSizing: 'border-box',
    },
    cardTitle: {
        margin: '0 0 20px',
        fontSize: '1.1rem',
        fontWeight: '700',
        color: '#1f2937',
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 12,
        padding: '10px 0',
        borderBottom: '1px solid #f3f4f6',
        flexWrap: 'wrap',
    },
    label: {
        fontSize: '0.82rem',
        fontWeight: '600',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: '0.4px',
        minWidth: 110,
        paddingTop: 2,
    },
    value: {
        fontSize: '0.9rem',
        color: '#111827',
        fontWeight: '500',
        textAlign: 'right',
    },
    cancelWarning: {
        fontSize: '0.75rem',
        color: '#b45309',
        background: '#fef3c7',
        border: '1px solid #fcd34d',
        borderRadius: '999px',
        padding: '2px 8px',
        fontWeight: '600',
    },
    actions: {
        marginTop: 20,
        display: 'flex',
        gap: 12,
    },
    btn: {
        flex: 1,
        padding: '11px 0',
        borderRadius: '10px',
        border: 'none',
        fontSize: '0.9rem',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'opacity 0.15s',
    },
    btnRed: {
        background: '#fee2e2',
        color: '#dc2626',
        border: '1px solid #fca5a5',
    },
    btnGreen: {
        background: '#dcfce7',
        color: '#16a34a',
        border: '1px solid #86efac',
    },
    btnGhost: {
        background: '#f9fafb',
        color: '#374151',
        border: '1px solid #d1d5db',
    },
    // ── Modal ──────────────────────────────────────────────────────────────────
    backdrop: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
    },
    modal: {
        background: '#fff',
        borderRadius: '18px',
        padding: '32px 28px 24px',
        width: '100%',
        maxWidth: '460px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        boxSizing: 'border-box',
    },
    modalTitle: {
        margin: '0 0 8px',
        fontSize: '1.15rem',
        fontWeight: '700',
        color: '#111827',
    },
    modalSubtitle: {
        margin: '0 0 20px',
        fontSize: '0.875rem',
        color: '#6b7280',
        lineHeight: 1.55,
    },
    modalLabel: {
        display: 'block',
        fontSize: '0.82rem',
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    modalSelect: {
        width: '100%',
        padding: '10px 12px',
        border: '1.5px solid #d1d5db',
        borderRadius: '10px',
        fontSize: '0.9rem',
        color: '#111827',
        background: '#f9fafb',
        outline: 'none',
        marginBottom: 16,
        boxSizing: 'border-box',
        cursor: 'pointer',
    },
    modalTextarea: {
        width: '100%',
        padding: '10px 12px',
        border: '1.5px solid #d1d5db',
        borderRadius: '10px',
        fontSize: '0.9rem',
        color: '#111827',
        background: '#f9fafb',
        outline: 'none',
        resize: 'vertical',
        minHeight: 80,
        marginBottom: 16,
        boxSizing: 'border-box',
        fontFamily: 'inherit',
    },
    modalActions: {
        display: 'flex',
        gap: 12,
        marginTop: 4,
    },
    actionMsg: {
        marginTop: 16,
        padding: '10px 14px',
        borderRadius: '10px',
        border: '1px solid',
        fontSize: '0.88rem',
        lineHeight: 1.5,
    },
    loadingRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '8px 0',
    },
    spinner: {
        width: 24,
        height: 24,
        border: '3px solid #e5e7eb',
        borderTop: '3px solid #6366f1',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        flexShrink: 0,
    },
    mutedText: {
        color: '#9ca3af',
        fontSize: '0.9rem',
        margin: 0,
    },
    retryBtn: {
        marginTop: 12,
        padding: '7px 18px',
        background: '#dc2626',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '0.85rem',
        fontWeight: '600',
        cursor: 'pointer',
    },
};
