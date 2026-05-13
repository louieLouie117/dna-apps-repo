import {React, useState, useEffect, use} from 'react';
import SignOutButton from '../components/SignOutButton';
import supabase from '../config/SupaBaseClient';
import IssueReporting from '../components/IssueReporting';
import PageHeader from '../components/PageHeader';
import AccountStatus from '../components/AccountStatus';
import AppLogosFooter from '../components/AppLogosFooter';
import { safeCookieParser } from '../utils/cookieUtils';
import CommingSoon from '../components/ComingSoon';
import AccountStripeStatus from '../components/AccountStripeStatus';

const DashboardUser = () => {
    const [reportContainer, setReportContainer] = useState(false);

    // Get username from cookie using safe parser
    const username = safeCookieParser.getUserEmail('userEmail');
    const userId = safeCookieParser.getCookie('userId');

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

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
                
             
           

           
                                 <main>

                <AccountStatus/>
                <AccountStripeStatus />
            </main>
            <aside>
                <CommingSoon />
            </aside>
            

            </div>
        </div>
        
        </>
    );
};

export default DashboardUser;