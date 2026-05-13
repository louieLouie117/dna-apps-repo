import { useState } from 'react';
import CustomerSupportTable from '../components/CustomerSupportTable';
import CancellationFeedbackTable from '../components/CancellationFeedbackTable';
import AppFeedbackTable from '../components/AppFeedbackTable';

const TABS = [
    { key: 'support',      label: 'Support Tickets' },
    { key: 'cancellation', label: 'Cancellations' },
    { key: 'feedback',     label: 'App Feedback' },
];

export default function DashboardSqlAdmin() {
    const [activeTab, setActiveTab] = useState('support');

    return (
        <div style={styles.page}>
            <div style={styles.inner}>
                <h1 style={styles.title}>Admin Dashboard</h1>

                <div style={styles.content}>
                    {activeTab === 'support'      && <CustomerSupportTable />}
                    {activeTab === 'cancellation' && <CancellationFeedbackTable />}
                    {activeTab === 'feedback'     && <AppFeedbackTable />}
                </div>
            </div>

            {/* Bottom nav */}
            <nav style={styles.nav}>
                {TABS.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        style={{
                            ...styles.navBtn,
                            ...(activeTab === tab.key ? styles.navBtnActive : {}),
                        }}
                    >
                        {tab.label}
                        {activeTab === tab.key && <span style={styles.navIndicator} />}
                    </button>
                ))}
            </nav>
        </div>
    );
}

const styles = {
    page: {
        minHeight: '100vh',
        background: '#f5f5f5',
        padding: '32px 16px 80px',
        display: 'flex',
        flexDirection: 'column',
    },
    inner: {
        maxWidth: '960px',
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        flex: 1,
    },
    title: {
        fontSize: '1.75rem',
        fontWeight: '800',
        color: '#1e1b4b',
        margin: 0,
    },
    content: {
        flex: 1,
    },
    nav: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        background: '#fff',
        borderTop: '1px solid #e5e7eb',
        boxShadow: '0 -2px 12px rgba(0,0,0,0.07)',
        zIndex: 100,
    },
    navBtn: {
        flex: 1,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px 8px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.82rem',
        fontWeight: '600',
        color: '#9ca3af',
        transition: 'color 0.15s',
        gap: 4,
    },
    navBtnActive: {
        color: '#1e1b4b',
    },
    navIndicator: {
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 32,
        height: 3,
        borderRadius: '0 0 3px 3px',
        background: '#1e1b4b',
    },
};



