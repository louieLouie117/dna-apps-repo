import React, { useEffect, useState } from 'react';
import supabase from '../config/SupaBaseClient';
import SignOut from '../components/SignOut';


const UserDashboard = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
        };
        getUser();
    }, []);

    if (!user) {
        return (
            <div>
                Please log in to access the dashboard.{' '}
                <a href="/sign-in">Go to Sign In</a>
            </div>
        );
    }

    return (
        <div>
            <nav>
                <SignOut />
            </nav>
            <h1>Welcome to your dashboard</h1>
            <div
                style={{
                    background: '#fffbe6',
                    color: '#856404',
                    padding: '20px',
                    marginBottom: '24px',
                    borderRadius: '8px',
                    border: '2px solid #ffe066',
                    boxShadow: '0 2px 8px rgba(255, 224, 102, 0.2)',
                    maxWidth: '420px',
                    margin: '0 auto',
                    textAlign: 'center',
                    fontSize: '1.1rem',
                }}
            >
                <strong style={{ fontSize: '1.2rem', display: 'block', marginBottom: '8px' }}>
                    Account Status: <span style={{ fontWeight: 'bold', color: '#d39e00' }}>Pending Verification</span>
                </strong>
                <div style={{ marginBottom: '12px' }}>
                    Please use this <span style={{ fontWeight: 'bold', color: '#d39e00' }}>temporary password</span> to log in to the app while your account is being verified.<br />
                    You will receive an email notification once your verification is complete.
                </div>
                <div
                    style={{
                        background: '#ffeeba',
                        padding: '12px',
                        borderRadius: '6px',
                        display: 'inline-block',
                        marginTop: '8px',
                        border: '1px dashed #ffe066',
                    }}
                >
                    <div>
                        <strong>Temporary Username:</strong>{' '}
                        <span style={{ fontWeight: 'bold', background: '#fff3cd', padding: '2px 8px', borderRadius: '3px', color: '#856404' }}>
                            dnapass
                        </span>
                    </div>
                    <div style={{ marginTop: '6px' }}>
                        <strong>Temporary Password:</strong>{' '}
                        <span style={{ fontWeight: 'bold', background: '#fff3cd', padding: '2px 8px', borderRadius: '3px', color: '#856404' }}>
                            Fv123c
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;