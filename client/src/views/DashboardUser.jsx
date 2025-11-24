import {React, useState, useEffect, use} from 'react';
import SignOutButton from '../components/SignOutButton';
import supabase from '../config/SupaBaseClient';
import IssueReporting from '../components/IssueReporting';
import PageHeader from '../components/PageHeader';
import AccountStatus from '../components/AccountStatus';
import AppLogosFooter from '../components/AppLogosFooter';

const DashboardUser = () => {
    const [reportContainer, setReportContainer] = useState(false);


    // Get username from cookie for handleReportIssue function
    const getUsernameFromCookie = () => {
        const match = document.cookie.match(new RegExp('(^| )username=([^;]+)'));
        return match ? match[2] : null;
    };
    const username = getUsernameFromCookie();

     const handleReportIssue = async () => {
            setReportContainer(true);
            
            // Update user status to 'Subscription Has been Paused'

            try {
                const { error } = await supabase
                    .from('Users')
                    .update({ status: 'Request to Pause Subscription' })
                    .eq('email', username);
                    
                if (error) {
                    console.error('Error updating account status:', error);
                    alert('Error updating account status. Please try again.');
                    return;
                }
    
                // Send message to customerContact table in supabase
                const { error: contactError } = await supabase
                    .from('CustomerContact')
                    .insert([{
                        email: username,
                        subject: 'Request to Paused Subscription - Issue Reporting Initiated',
                        message: 'User has initiated issue reporting and request to pause subscription has been made.',
                        payment_method: 'Supabase Update'
                    }]);
    
                if (contactError) {
                    console.error('Error inserting contact record:', contactError);
                }
    
                // Trigger immediate refresh of AccountStatus component
                window.localStorage.setItem('refreshAccountStatus', Date.now().toString());
                window.dispatchEvent(new CustomEvent('refreshAccountStatus', { detail: 'refreshAccountStatus' }));
                
                alert('Your subscription has been paused and you will not be charged during this outage. Please fill out the issue report form.');
        
                
            } catch (error) {
                console.error('Error in handleReportIssue:', error);
                alert('An error occurred. Please try again.');
            }
        };


    return (
        <>
        <PageHeader title="User Dashboard" />
        <div className="dashboard-container">
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                padding: '10px 0',
                borderBottom: '1px solid #eee'
            }}>
                <h1>Welcome to Your Dashboard</h1>
                <SignOutButton />
            </header>
           
            
            <div className="dashboard-content">
                
             
           

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
                                        <strong>New User Alert:</strong> Some new users registered on or after November 1 2025 are experiencing sign-in difficulties with one or more applications. If you're encountering login issues, please report them using the form below so our team can assist you promptly. During this period, you can pause your subscription to <b>avoid charges</b> while we resolve the issue.
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
                                    onClick={() => handleReportIssue()}
                                    
                                    
                                    >Pause Subscription and Report Issue</button>
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

                                 <main>
                {/* <p>Username: {username}</p> */}

                <AccountStatus/>
            </main>
            <footer style={{display: 'grid', justifyItems: 'center'}}>
            <h3>Apps available in the Microsoft Store with your subscription.</h3>

                <AppLogosFooter />
            </footer>

            </div>
        </div>
        
        </>
    );
};

export default DashboardUser;