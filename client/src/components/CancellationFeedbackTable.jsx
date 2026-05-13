import { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

export default function CancellationFeedbackTable() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const headers = { 'Content-Type': 'application/json' };
                if (token) headers['Authorization'] = `Bearer ${token}`;

                const res = await fetch(`${API_BASE_URL}/api/admin/cancellation-feedback`, {
                    method: 'GET',
                    credentials: 'include',
                    headers,
                });

                const data = await res.json();

                if (!data.success) {
                    setError(data.error || 'Failed to load cancellation feedback');
                } else {
                    setRows(data.feedback);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, []);

    if (loading) {
        return <div style={styles.center}><div style={styles.spinner} /></div>;
    }

    if (error) {
        return (
            <div style={styles.errorBox}>
                <strong>Error:</strong> {error}
            </div>
        );
    }

    return (
        <div style={styles.wrapper}>
            <div style={styles.tableHeader}>
                <h2 style={styles.heading}>Cancellation Feedback</h2>
                <span style={styles.count}>{rows.length} entr{rows.length !== 1 ? 'ies' : 'y'}</span>
            </div>

            {rows.length === 0 ? (
                <p style={styles.empty}>No cancellation feedback found.</p>
            ) : (
                <div style={styles.tableWrap}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                {['Email', 'Subscription ID', 'Submitted', ''].map(h => (
                                    <th key={h} style={styles.th}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map(row => {
                                const isOpen = expanded === row.cancellationFeedbackId;
                                return (
                                    <>
                                        <tr
                                            key={row.cancellationFeedbackId}
                                            style={{
                                                ...styles.tr,
                                                background: isOpen ? '#fff7ed' : undefined,
                                            }}
                                        >
                                            <td style={styles.td}>{row.email || '—'}</td>
                                            <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '0.8rem', color: '#6b7280' }}>
                                                {row.subscriptionId || '—'}
                                            </td>
                                            <td style={{ ...styles.td, whiteSpace: 'nowrap' }}>{formatDate(row.createdAt)}</td>
                                            <td style={styles.td}>
                                                <button
                                                    style={styles.expandBtn}
                                                    onClick={() => setExpanded(isOpen ? null : row.cancellationFeedbackId)}
                                                >
                                                    {isOpen ? '▲ Hide' : '▼ Reason'}
                                                </button>
                                            </td>
                                        </tr>
                                        {isOpen && (
                                            <tr key={`${row.cancellationFeedbackId}-reason`} style={{ background: '#fff7ed' }}>
                                                <td colSpan={4} style={{ ...styles.td, padding: '12px 20px 16px' }}>
                                                    <p style={styles.reasonLabel}>Reason</p>
                                                    <p style={styles.reasonBody}>{row.reason || <em style={{ color: '#9ca3af' }}>No reason provided</em>}</p>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

const styles = {
    wrapper: {
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
        padding: '28px 24px',
        width: '100%',
    },
    tableHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    heading: {
        margin: 0,
        fontSize: '1.2rem',
        fontWeight: '800',
        color: '#1e1b4b',
    },
    count: {
        fontSize: '0.85rem',
        color: '#6b7280',
        background: '#f3f4f6',
        padding: '3px 12px',
        borderRadius: '999px',
    },
    empty: {
        color: '#9ca3af',
        textAlign: 'center',
        padding: '32px 0',
    },
    tableWrap: {
        overflowX: 'auto',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '0.9rem',
    },
    th: {
        textAlign: 'left',
        padding: '10px 14px',
        borderBottom: '2px solid #e5e7eb',
        color: '#6b7280',
        fontWeight: '700',
        fontSize: '0.78rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        whiteSpace: 'nowrap',
    },
    tr: {
        borderBottom: '1px solid #f3f4f6',
        transition: 'background 0.15s',
    },
    td: {
        padding: '12px 14px',
        color: '#111827',
        verticalAlign: 'top',
    },
    expandBtn: {
        background: 'none',
        border: '1px solid #fed7aa',
        borderRadius: '6px',
        color: '#c2410c',
        fontSize: '0.78rem',
        fontWeight: '600',
        padding: '4px 10px',
        cursor: 'pointer',
    },
    reasonLabel: {
        margin: '0 0 4px',
        fontSize: '0.78rem',
        fontWeight: '700',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: '0.4px',
    },
    reasonBody: {
        margin: 0,
        color: '#374151',
        lineHeight: 1.6,
        whiteSpace: 'pre-wrap',
    },
    center: {
        display: 'flex',
        justifyContent: 'center',
        padding: '48px 0',
    },
    spinner: {
        width: 32,
        height: 32,
        border: '3px solid #e5e7eb',
        borderTop: '3px solid #f97316',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
    },
    errorBox: {
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '12px',
        color: '#991b1b',
        padding: '16px 20px',
        fontSize: '0.9rem',
    },
};
