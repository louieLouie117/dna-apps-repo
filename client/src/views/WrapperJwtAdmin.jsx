import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function WrapperJwtAdmin({ children }) {
    const [status, setStatus] = useState('loading'); // 'loading' | 'authorized' | 'denied' | 'unauthenticated'
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const headers = { 'Content-Type': 'application/json' };
                if (token) headers['Authorization'] = `Bearer ${token}`;

                // Use /api/check-admin which reads SubscriptionType directly from the DB
                // This is reliable even when subscriptionType was missing from the JWT at login time
                const response = await fetch(`${API_BASE_URL}/api/check-admin`, {
                    method: 'GET',
                    credentials: 'include',
                    headers,
                });

                const data = await response.json();

                console.log('[WrapperJwtAdmin] check-admin response:', JSON.stringify(data, null, 2));
                console.log('[WrapperJwtAdmin] isAdmin:', data.isAdmin);
                console.log('[WrapperJwtAdmin] subscriptionType from DB:', data.subscriptionType);

                if (data.reason === 'NO_TOKEN' || data.reason === 'ERROR') {
                    setStatus('unauthenticated');
                    return;
                }

                if (data.isAdmin === true) {
                    setStatus('authorized');
                } else {
                    setStatus('denied');
                }
            } catch (err) {
                console.error('[WrapperJwtAdmin] error:', err);
                setStatus('unauthenticated');
            }
        };

        checkAdmin();
    }, []);

    if (status === 'loading') {
        return (
            <div style={styles.center}>
                <div style={styles.spinner} />
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return (
            <div style={styles.center}>
                <div style={styles.card}>
                    <h2 style={styles.heading}>Session Expired</h2>
                    <p style={styles.text}>Please log in to continue.</p>
                    <button style={styles.btn} onClick={() => navigate('/login')}>Go to Login</button>
                </div>
            </div>
        );
    }

    if (status === 'denied') {
        return (
            <div style={styles.center}>
                <div style={styles.card}>
                    <h2 style={{ ...styles.heading, color: '#dc2626' }}>Access Denied</h2>
                    <p style={styles.text}>Your account does not have Admin permissions.</p>
                    <button style={styles.btn} onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

const styles = {
    center: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f5f5f5',
    },
    spinner: {
        width: 36,
        height: 36,
        border: '4px solid #e5e7eb',
        borderTop: '4px solid #6366f1',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
    },
    card: {
        background: '#fff',
        borderRadius: '14px',
        padding: '40px 32px',
        textAlign: 'center',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        maxWidth: '400px',
    },
    heading: {
        fontSize: '1.4rem',
        fontWeight: '700',
        color: '#1e1b4b',
        margin: '0 0 10px',
    },
    text: {
        fontSize: '0.95rem',
        color: '#6b7280',
        margin: '0 0 20px',
    },
    btn: {
        padding: '10px 24px',
        background: '#6366f1',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '0.95rem',
        fontWeight: '600',
        cursor: 'pointer',
    },
};
