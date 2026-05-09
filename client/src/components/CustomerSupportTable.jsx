import { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const STATUS_STYLES = {
    open:     { background: '#fef9c3', color: '#854d0e', border: '1px solid #fde047' },
    closed:   { background: '#dcfce7', color: '#166534', border: '1px solid #86efac' },
    pending:  { background: '#dbeafe', color: '#1e40af', border: '1px solid #93c5fd' },
    default:  { background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db' },
};

function StatusBadge({ status }) {
    const key = (status ?? '').toLowerCase();
    const style = STATUS_STYLES[key] || STATUS_STYLES.default;
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
            {status || '—'}
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

export default function CustomerSupportTable() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(null); // customerSupportId of expanded row

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const headers = { 'Content-Type': 'application/json' };
                if (token) headers['Authorization'] = `Bearer ${token}`;

                const res = await fetch(`${API_BASE_URL}/api/admin/customer-support`, {
                    method: 'GET',
                    credentials: 'include',
                    headers,
                });

                const data = await res.json();

                if (!data.success) {
                    setError(data.error || 'Failed to load tickets');
                } else {
                    setTickets(data.tickets);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
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
                <h2 style={styles.heading}>Customer Support Tickets</h2>
                <span style={styles.count}>{tickets.length} ticket{tickets.length !== 1 ? 's' : ''}</span>
            </div>

            {tickets.length === 0 ? (
                <p style={styles.empty}>No support tickets found.</p>
            ) : (
                <div style={styles.tableWrap}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                {['From', 'Subject', 'Status', 'Submitted', ''].map(h => (
                                    <th key={h} style={styles.th}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map(ticket => {
                                const isOpen = expanded === ticket.customerSupportId;
                                return (
                                    <>
                                        <tr
                                            key={ticket.customerSupportId}
                                            style={{
                                                ...styles.tr,
                                                background: isOpen ? '#f0f4ff' : undefined,
                                            }}
                                        >
                                            <td style={styles.td}>{ticket.fromEmail || '—'}</td>
                                            <td style={{ ...styles.td, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {ticket.subject || <em style={{ color: '#9ca3af' }}>No subject</em>}
                                            </td>
                                            <td style={styles.td}><StatusBadge status={ticket.status} /></td>
                                            <td style={{ ...styles.td, whiteSpace: 'nowrap' }}>{formatDate(ticket.createdAt)}</td>
                                            <td style={styles.td}>
                                                <button
                                                    style={styles.expandBtn}
                                                    onClick={() => setExpanded(isOpen ? null : ticket.customerSupportId)}
                                                >
                                                    {isOpen ? '▲ Hide' : '▼ View'}
                                                </button>
                                            </td>
                                        </tr>
                                        {isOpen && (
                                            <tr key={`${ticket.customerSupportId}-msg`} style={{ background: '#f0f4ff' }}>
                                                <td colSpan={5} style={{ ...styles.td, padding: '12px 20px 16px' }}>
                                                    <p style={styles.messageLabel}>Message</p>
                                                    <p style={styles.messageBody}>{ticket.message || '—'}</p>
                                                    <p style={{ ...styles.messageLabel, marginTop: 10 }}>
                                                        Last updated: <span style={{ fontWeight: 400 }}>{formatDate(ticket.updatedAt)}</span>
                                                    </p>
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
        border: '1px solid #c7d2fe',
        borderRadius: '6px',
        color: '#4338ca',
        fontSize: '0.78rem',
        fontWeight: '600',
        padding: '4px 10px',
        cursor: 'pointer',
    },
    messageLabel: {
        margin: '0 0 4px',
        fontSize: '0.78rem',
        fontWeight: '700',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: '0.4px',
    },
    messageBody: {
        margin: 0,
        color: '#374151',
        lineHeight: 1.6,
        whiteSpace: 'pre-wrap',
    },
    center: {
        display: 'flex',
        justifyContent: 'center',
        padding: '40px 0',
    },
    spinner: {
        width: 32,
        height: 32,
        border: '3px solid #e5e7eb',
        borderTop: '3px solid #6366f1',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
    },
    errorBox: {
        background: '#fef2f2',
        border: '1px solid #fca5a5',
        color: '#dc2626',
        borderRadius: '10px',
        padding: '16px 20px',
        fontSize: '0.9rem',
    },
};
