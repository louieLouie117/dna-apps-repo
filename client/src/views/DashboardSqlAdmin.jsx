import CustomerSupportTable from '../components/CustomerSupportTable';

export default function DashboardSqlAdmin() {
    return (
        <div style={styles.page}>
            <div style={styles.inner}>
                <h1 style={styles.title}>Admin Dashboard</h1>
                <CustomerSupportTable />
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: '100vh',
        background: '#f5f5f5',
        padding: '32px 16px 64px',
    },
    inner: {
        maxWidth: '960px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
    },
    title: {
        fontSize: '1.75rem',
        fontWeight: '800',
        color: '#1e1b4b',
        margin: 0,
    },
};


