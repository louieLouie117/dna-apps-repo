import React, { useEffect, useState } from 'react';
import supabase from '../config/SupaBaseClient';
import SignOut from '../components/SignOut';
import AppLogosFooter from '../components/AppLogosFooter';


const UserDashboard = () => {
    const [user, setUser] = useState(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [accountStatus, setAccountStatus] = useState('Pending Verification not set'); // Default status

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
            setUserLoggedIn(session?.user?.id || null);
            // console.log('User logged in:', session?.user?.id || 'No user logged in');
        };
        getUser();
    }, []);

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (!userLoggedIn) return; // Only fetch if userLoggedIn is a valid id
            const { data, error } = await supabase
                .from('Users')
                .select('*')
                .eq('auth_uid', userLoggedIn);

            if (error) {
                console.error('Error fetching user uuid:', error);
            } else {
                // console.log('User uuid', data);
                setUser(data[0]); // Assuming data returns an array with user info
                setAccountStatus(data[0]?.status || 'Pending Verification Error'); // Set account status from
                // You can set this data to state if needed
            }
        };
        fetchUserInfo();
    }, [userLoggedIn]);

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
            {accountStatus === 'Pending Verification' || accountStatus === 'Pending Verification not set' ? (
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
                        We're sorry for the wait! Our team is working on verifying your account as quickly as possible.
                        <br />
                        In the meantime, please use the <span style={{ fontWeight: 'bold', color: '#d39e00' }}>temporary password</span> below to log in to the apps.
                        <br />
                        You'll receive an email as soon as your verification is complete. Thank you for your patience!
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
                    {/* button to refresh page and check status */}
                    <button
                        onClick={() => window.location.reload()}
                        style={{ 
                            fontWeight: 'bold', 
                            background: '#856404', 
                            padding: '10px', 
                            marginTop: '16px',
                            borderRadius: '3px', 
                            color: '#fff3cd' }}
                      
                    >
                        Check Status
                    </button>
                </div>
            ) : (
                <div
                    style={{
                        background: '#e6ffed',
                        color: '#155724',
                        padding: '20px',
                        marginBottom: '24px',
                        borderRadius: '8px',
                        border: '2px solid #b7eb8f',
                        boxShadow: '0 2px 8px rgba(183, 235, 143, 0.2)',
                        maxWidth: '420px',
                        margin: '0 auto',
                        textAlign: 'center',
                        fontSize: '1.1rem',
                    }}
                >
                    <strong style={{ fontSize: '1.2rem', display: 'block', marginBottom: '8px' }}>
                        Account Status: <span style={{ fontWeight: 'bold', color: '#389e0d' }}>Active</span>
                    </strong>
                    <div>
                        Your account is now active! You can sign in using the email and password you set during registration.
                    </div>
                </div>
            )}
            <footer>
                <h2>Download Apps</h2>
                <AppLogosFooter />
            </footer>
        </div>
    );
};

export default UserDashboard;