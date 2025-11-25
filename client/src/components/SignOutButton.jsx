import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignOutButton = ({ style, className }) => {
    const [signingOut, setSigningOut] = useState(false);
    const navigate = useNavigate();

    // Get API base URL from environment or default to localhost
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    const handleSignOut = async () => {
        setSigningOut(true);
        // clear cookies and session
        document.cookie = 'username=; Max-Age=0; path=/;';
        document.cookie = 'userId=; Max-Age=0; path=/;';
        document.cookie = 'token=; Max-Age=0; path=/;';

        
        try {
            const response = await fetch(`${API_BASE_URL}/api/session/logout`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Logout successful:', data.message);
                
                // Clear any local storage tokens as well (if you're using them)
                localStorage.removeItem('token');
                // Clear userId cookie
                document.cookie = 'userId=; Max-Age=0; path=/;';
                // Redirect to sign-in page
                navigate('/login');
            } else {
                console.error('Logout failed with status:', response.status);
                // Even if logout fails on server, redirect to login-test
                navigate('/login');
            }
        } catch (error) {
            console.error('Error during logout:', error);
            // Even if there's a network error, redirect to login-test
            navigate('/login');
        } finally {
            setSigningOut(false);
        }
    };

    // Default button styles
    const defaultStyle = {
        padding: '8px 16px',
        backgroundColor: signingOut ? '#ccc' : '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: signingOut ? 'not-allowed' : 'pointer',
        fontSize: '14px',
        transition: 'background-color 0.2s'
    };

    // Merge custom styles with default styles
    const buttonStyle = style ? { ...defaultStyle, ...style } : defaultStyle;

    return (
        <button 
            onClick={handleSignOut}
            disabled={signingOut}
            style={buttonStyle}
            className={className}
            aria-label="Sign out of your account"
        >
            {signingOut ? 'Signing Out...' : 'Sign Out'}
        </button>
    );
};

export default SignOutButton;