import React, { useEffect, useState } from 'react';
import supabase from '../config/SupaBaseClient';
import SignOut from '../components/SignOut';
import AppLogosFooter from '../components/AppLogosFooter';

const UserDashboard = () => {
    const [user, setUser] = useState(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [accountStatus, setAccountStatus] = useState('Pending Verification not set'); // Default status
    const [tempName, setTempName] = useState('temp_login');
    const [tempPass, setTempPass] = useState('temp_pass');  

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
            setUserLoggedIn(session?.user?.id || null);
        };
        getUser();
    }, []);

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (!userLoggedIn) return;
            const { data, error } = await supabase
                .from('Users')
                .select('*')
                .eq('auth_uid', userLoggedIn);

            if (error) {
                console.error('Error fetching user uuid:', error);
            } else {
                setUser(data[0]);
                setAccountStatus(data[0]?.status || 'Pending Verification Error');
                // console.log('User data:', data[0].temp_login);
                if (data[0].temp_login) {
                    setTempName(data[0].temp_login.temp_name || 'temp_name_error');
                    setTempPass(data[0].temp_login.temp_pass || 'temp_pass_error');
                } else {
                    setTempName('temp_name_error');
                    setTempPass('temp_pass_error');
                }

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

    // Utility function to copy text to clipboard
    const handleCopy = (text) => {
        if (!text) return;
        navigator.clipboard.writeText(text)
            .then(() => {
                alert('Copied to clipboard!');
            })
            .catch(() => {
                alert('Failed to copy.');
            });
    };

    return (
        <div>
            <nav>
                <SignOut />
            </nav>


            <h1>Welcome to your dashboard</h1>
             <header>
                <h2>Download Apps From Microsoft Store.</h2>
                <AppLogosFooter />
            </header>
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
                    <div style={{ marginBottom: 12 }}>
                        We're sorry for the wait! Our team is working on verifying your account.
                        Use the <b style={{ color: '#d39e00' }}>temporary user name and password</b> below to log in to the apps.
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
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>

                            <strong>Username:</strong>{' '}
                            <span style={{ fontWeight: 'bold', background: '#fff3cd', padding: '2px 8px', borderRadius: '3px', color: '#856404' }}>
                                {tempName ? tempName : 'temp_name_error'}
                            </span>
                            <button
                                style={{
                                    marginLeft: 4,
                                    padding: '2px 8px',
                                    fontSize: '0.9rem',
                                    borderRadius: '3px',
                                    border: '1px solid #ffe066',
                                    background: '#fffbe6',
                                    color: '#856404',
                                    cursor: 'pointer'
                                }}
                                onClick={() => handleCopy(tempName)}
                                title="Copy Username"
                            >
                                Copy
                            </button>
                        </div>
                        <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                            <strong>Password:</strong>{' '}
                            <span style={{ fontWeight: 'bold', background: '#fff3cd', padding: '2px 8px', borderRadius: '3px', color: '#856404' }}>
                                {tempPass ? tempPass : 'temp_pass_error'}
                            </span>
                            <button
                                style={{
                                    marginLeft: 4,
                                    padding: '2px 8px',
                                    fontSize: '0.9rem',
                                    borderRadius: '3px',
                                    border: '1px solid #ffe066',
                                    background: '#fffbe6',
                                    color: '#856404',
                                    cursor: 'pointer'
                                }}
                                onClick={() => handleCopy(tempPass)}
                                title="Copy Password"
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            fontWeight: 'bold',
                            background: '#856404',
                            marginTop: '16px',
                            borderRadius: '3px',
                            color: '#fff3cd'
                        }}
                    >
                        Check Status
                    </button>
                    <br />
                    You'll receive an email when verification is complete or click check status to refresh.
                </div>
            ) : accountStatus === 'Request to Unsubscribed' ? (
                <div
                    style={{
                        background: '#fff3cd',
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
                        Account Status: <span style={{ fontWeight: 'bold', color: '#d39e00' }}>Pending Unsubscribe</span>
                    </strong>
                    <div>
                        Your request to unsubscribe is being processed. You will receive an email confirmation once your account has been unsubscribed.
                    </div>
                    <br />
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            fontWeight: 'bold',
                            background: '#856404',
                            padding: '10px',
                            marginTop: '16px',
                            borderRadius: '3px',
                            color: '#fff3cd'
                        }}
                    >
                        Refresh Status
                    </button>
                </div>
                // check if account is Request to Active
            ) : accountStatus === 'Request to Active' ? (
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
                        Account Status: <span style={{ fontWeight: 'bold', color: '#d39e00' }}>Pending Activation</span>
                    </strong>
                    <div>
                        Your request to reactivate your account is being processed. You will receive an email once your account is active.
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            fontWeight: 'bold',
                            background: '#856404',
                            padding: '10px',
                            marginTop: '16px',
                            borderRadius: '3px',
                            color: '#fff3cd'
                        }}
                    >
                        Refresh Status
                    </button>
                </div>
            ) : accountStatus === 'Unsubscribed' ? (
                <div
                    style={{
                        background: '#f8d7da',
                        color: '#721c24',
                        padding: '20px',
                        marginBottom: '24px',
                        borderRadius: '8px',
                        border: '2px solid #f5c6cb',
                        boxShadow: '0 2px 8px rgba(245, 198, 203, 0.2)',
                        maxWidth: '420px',
                        margin: '0 auto',
                        textAlign: 'center',
                        fontSize: '1.1rem',
                    }}
                >
                    <strong style={{ fontSize: '1.2rem', display: 'block', marginBottom: '8px' }}>
                        Account Status: <span style={{ fontWeight: 'bold', color: '#c82333' }}>Unsubscribed</span>
                    </strong>
                    <div>
                        Your account has been unsubscribed. You can reactivate it by clicking the button below.
                    </div>
                    <button
                        style={{
                            fontWeight: 'bold',
                            background: '#28a745',
                            padding: '10px 20px',
                            marginTop: '16px',
                            borderRadius: '3px',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                        onClick={async () => {
                            if (!userLoggedIn) return;
                            const { error } = await supabase
                                .from('Users')
                                .update({ status: 'Request to Active' })
                                .eq('auth_uid', userLoggedIn);
                            if (!error) {
                                alert('Your account reactivation request has been submitted.');
                                window.location.reload();
                            } else {
                                alert('Error reactivating account. Please try again.');
                            }
                        }}
                    >
                        Reactivate Account
                    </button>
                    <br />
                  
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
                        Your account is now active! You can sign in to all apps using the email and password you set during registration.
                    </div>
                    <br />
                    <button
                        style={{
                            fontWeight: 'bold',
                            background: '#d9534f',
                            padding: '10px 20px',
                            borderRadius: '3px',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                        onClick={async () => {
                            if (!userLoggedIn) return;
                            const { error } = await supabase
                                .from('Users')
                                .update({ status: 'Request to Unsubscribed' })
                                .eq('auth_uid', userLoggedIn);
                            if (!error) {
                                alert('Unsubscribe request has been submitted.');
                                window.location.reload();
                            } else {
                                alert('Error unsubscribing. Please try again.');
                            }
                        }}
                    >
                        Request to Unsubscribe
                    </button>
                </div>
            )}
           
        </div>
    );
};

export default UserDashboard;