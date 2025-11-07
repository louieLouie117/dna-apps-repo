import React, { useEffect, useState } from 'react';
import supabase from '../config/SupaBaseClient';
import SignOut from '../components/SignOut';
import AppLogosFooter from '../components/AppLogosFooter';
import Unsubscribe from '../components/Unsubscribe';
import PageHeader from '../components/PageHeader';
import IssueReporting from '../components/IssueReporting';

const UserDashboard = () => {
    const [user, setUser] = useState(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [accountStatus, setAccountStatus] = useState('Pending Verification not set'); // Default status
    const [tempName, setTempName] = useState('temp_login');
    const [tempPass, setTempPass] = useState('temp_pass');  
    const [reportContainer, setReportContainer] = useState(false);

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
            <header>
                <PageHeader/>
            </header>
            
            <nav>
                <SignOut />
            </nav>

    <aside>
                <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#ffffff',
                    padding: '24px',
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    marginBottom: '32px',
                    marginTop: '16px',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    {/* Background decoration */}
                    <div style={{
                        position: 'absolute',
                        top: '-50%',
                        right: '-50%',
                        width: '200%',
                        height: '200%',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                        pointerEvents: 'none'
                    }}></div>
                    
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <h2 style={{
                            margin: '0 0 16px 0',
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <span style={{
                                display: 'inline-block',
                                width: '8px',
                                height: '8px',
                                background: '#fbbf24',
                                borderRadius: '50%',
                                animation: 'pulse 2s infinite'
                            }}></span>
                            Important Notice
                        </h2>
                        <p style={{
                            margin: '0 0 20px 0',
                            lineHeight: '1.6',
                            fontSize: '1rem',
                            opacity: '0.95'
                        }}>
                            <strong>New User Alert:</strong> Some new users registered in November 2025 are experiencing sign-in difficulties with one or more applications. If you're encountering login issues, please report them using the form below so our team can assist you promptly.
                        </p>
                        <div>
                            <button  style={{
                            background: 'rgba(255, 255, 255, 0.15)',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            color: '#ffffff',
                            cursor: 'pointer'   
                        }}
                        onClick={() => setReportContainer(!reportContainer)}
                        
                        
                        >Report Issue</button>
                        </div>
                    </div>
                </div>
                
                <div style={{
                    display: `${reportContainer ? "block" : "none"}`,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '16px',
                    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
                    border: '1px solid #e5e7eb',
                    overflow: 'hidden'
                }}>
                    <IssueReporting />
                </div>
            </aside>
            <main style={{maxWidth: '35em', margin: '0 auto'}}>
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
                        Your account is active! You can sign in to all apps using the email and password you set during registration.
                    </div>
                    <br />
                  
                </div>
            )}


               <header>
                <AppLogosFooter />
            </header>

            </main>
        

              {accountStatus === 'Request to Unsubscribed' ? (
                        <>
                        <Unsubscribe />

                         <button
                        style={{
                            background: 'whitesmoke',
                            padding: '10px 20px',
                            borderRadius: '3px',
                            color: '#646cff',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                        onClick={async () => {
                            alert('Great news! 🎉\n\nWe\'re so happy you want to keep your account active! 😊');
                            if (!userLoggedIn) return;
                            const { error } = await supabase
                                .from('Users')
                                .update({ status: 'Active' })
                                    .eq('auth_uid', userLoggedIn);
                                if (!error) {
                                    alert('Your account has been reactivated.');
                                    window.location.reload();
                                } else {
                                    alert('Error unsubscribing. Please try again.');
                                }
                        }}
                    >
                        Cancel Request
                    </button>
                        
                        </>

                    ) : null}
           {accountStatus === 'Active' ? (
              <button
                        style={{
                            background: 'whitesmoke',
                            padding: '10px 20px',
                            borderRadius: '3px',
                            color: '#646cff',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                        onClick={async () => {
                            const confirmed = window.confirm('Oops! Did you click this by accident? 😅\n\nIf you really want to request to unsubscribe and deactivate your account, click OK.\n\nOtherwise, click Cancel and pretend this never happened! 😉');
                            
                            if (confirmed) {
                                if (!userLoggedIn) return;
                                const { error } = await supabase
                                    .from('Users')
                                    .update({ status: 'Request to Unsubscribed' })
                                    .eq('auth_uid', userLoggedIn);
                                if (!error) {
                                    alert('Please send us your feedback.');
                                    window.location.reload();
                                } else {
                                    alert('Error unsubscribing. Please try again.');
                                }
                            }
                        }}
                    >
                        Request to Unsubscribe
                    </button>
              ) : null}
                      

                   

        </div>

        
    );
};

export default UserDashboard;