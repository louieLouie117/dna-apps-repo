import React from 'react';
import SignOutButton from '../components/SignOutButton';

const DashboardUser = () => {
    // get user ID from cookie and username
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
                <p>User ID: {userId}</p>
                <p>Username: {username}</p>

            </div>
        </div>
    );
};

export default DashboardUser;