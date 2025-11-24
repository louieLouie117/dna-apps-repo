import {React, useState, useEffect, use} from 'react';
import SignOutButton from '../components/SignOutButton';
import supabase from '../config/SupaBaseClient';

const DashboardUser = () => {
    // get user ID from cookie and username
    const [userLoggedIn, setUserLoggedIn] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [AccountStatus, setAccountStatus] = useState(null);

    useEffect(() => {
        // call fetchUserInfo when userLoggedIn changes
        fetchUserInfo();
    }, [userLoggedIn]);

        

    const getUserIdFromCookie = () => {
        const match = document.cookie.match(new RegExp('(^| )userId=([^;]+)'));
        return match ? match[2] : null;
    };
    // get username from cookie
    const userId = getUserIdFromCookie();
    const getUsernameFromCookie = () => {
        const match = document.cookie.match(new RegExp('(^| )username=([^;]+)'));
        return match ? match[2] : null;
    };
    const username = getUsernameFromCookie();
    console.log('User ID from cookie:', userId);
    console.log('Username from cookie:', username);

    // get user info from supabase using username
    const fetchUserInfo = async () => {
        if (!username) return;      
        // Fetch user info logic here
        const { data, error } = await supabase
            .from('Users')
            .select('*')
            .eq('email', username);

        if (error) {
            console.error('Error fetching user info:', error);
        } else {
            console.log('User info:', data);
            setUserInfo(data);
            setAccountStatus(data?.[0]?.status || null);
            console.log('-------User info state updated:', data);
        }
    };


    return (
        <div className="dashboard-container">
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                padding: '10px 0',
                borderBottom: '1px solid #eee'
            }}>
                <h1>Hello New Dashboard</h1>
                <SignOutButton />
            </header>
           
            
            <div className="dashboard-content">
                <p>Welcome to your user dashboard!</p>
                <p>Username: {username}</p>
                 <main>
                <p>Account Status: {AccountStatus}</p>
            </main>

            </div>
        </div>
    );
};

export default DashboardUser;