import { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const TYPE_STYLES = {
    bug:     { background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' },
    feature: { background: '#dbeafe', color: '#1e40af', border: '1px solid #93c5fd' },
    issue:   { background: '#fef9c3', color: '#854d0e', border: '1px solid #fde047' },
    other:   { background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db' },
};

function TypeBadge({ type }) {
    const key = (type ?? '').toLowerCase();
    const style = TYPE_STYLES[key] || TYPE_STYLES.other;
    return (
        <span style={{
            ...style,
            padding: '3px 10px',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.4px',
            whiteSpace: 'nowrap',
        }}>
            {type || '—'}
        </span>
    );
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

export default function AppFeedbackTable() {
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

                const res = await fetch(`${API_BASE_URL}/api/admin/app-feedback`, {
                    method: 'GET',
                    credentials: 'include',
                    headers,
                });

                const data = await res.json();

                if (!data.success) {
                    setError(data.error || 'Failed to load app feedback');
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
                <h2 style={styles.heading}>App Feedback</h2>
                <span style={styles.count}>{rows.length} entr{rows.length !== 1 ? 'ies' : 'y'}</span>
            </div>

            {rows.length === 0 ? (
                <p style={styles.empty}>No app feedback found.</p>
            ) : (
                <div style={styles.tableWrap}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                {['Email', 'Type', 'Page', 'Submitted', ''].map(h => (
                                    <th key={h} style={styles.th}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map(row => {
                                const isOpen = expanded === row.feedbackId;
                                return (
                                    <>
                                        <tr
                                            key={row.feedbackId}
                                            style={{
                                                ...styles.tr,
                                                background: isOpen ? '#f0fdf4' : undefined,
                                            }}
                                        >
                                            <td style={styles.td}>{row.email || <em style={{ color: '#9ca3af' }}>Anonymous</em>}</td>
                                            <td style={styles.td}><TypeBadge type={row.feedbackType} /></td>
                                            <td style={{ ...styles.td, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.8rem', color: '#6b7280' }}>
                                                {row.pageUrl || '—'}
                                            </td>
                                            <td style={{ ...styles.td, whiteSpace: 'nowrap' }}>{formatDate(row.createdAt)}</td>
                                            <td style={styles.td}>
                                                <button
                                                    style={styles.expandBtn}
                                                    onClick={() => setExpanded(isOpen ? null : row.feedbackId)}
                                                >
                                                    {isOpen ? '▲ Hide' : '▼ Details'}
                                                </button>
                                            </td>
                                        </tr>
                                        {isOpen && (
                                            <tr key={`${row.feedbackId}-details`} style={{ background: '#f0fdf4' }}>
                                                <td colSpan={5} style={{ ...styles.td, padding: '12px 20px 16px' }}>
                                                    <p style={styles.detailLabel}>Details</p>
                                                    <p style={styles.detailBody}>{row.details || <em style={{ color: '#9ca3af' }}>No details provided</em>}</p>
                                                    {row.pageUrl && (
                                                        <>
                                                            <p style={{ ...styles.detailLabel, marginTop: 10 }}>Page URL</p>
                                                            <p style={{ ...styles.detailBody, wordBreak: 'break-all' }}>{row.pageUrl}</p>
                                                        </>
                                                    )}
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
        border: '1px solid #bbf7d0',
        borderRadius: '6px',
        color: '#15803d',
        fontSize: '0.78rem',
        fontWeight: '600',
        padding: '4px 10px',
        cursor: 'pointer',
    },
    detailLabel: {
        margin: '0 0 4px',
        fontSize: '0.78rem',
        fontWeight: '700',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: '0.4px',
    },
    detailBody: {
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
        borderTop: '3px solid #22c55e',
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
