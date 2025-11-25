import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignOutButton = ({ style, className }) => {
    const [signingOut, setSigningOut] = useState(false);
    const navigate = useNavigate();

    // Get API base URL from environment or default to localhost
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    const handleSignOut = async () => {
        setSigningOut(true);
        
        // Comprehensive cookie clearing function
        const clearAllAuthCookies = () => {
            const cookiesToClear = ['token', 'userId', 'username', 'refreshToken', 'sessionId'];
            
            cookiesToClear.forEach(cookieName => {
                // Clear cookie for current domain with different path variations
                document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
                
                // Clear for parent domain if applicable
                const domainParts = window.location.hostname.split('.');
                if (domainParts.length > 1) {
                    const parentDomain = '.' + domainParts.slice(-2).join('.');
                    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${parentDomain};`;
                }
                
                // Also try Max-Age method as backup
                document.cookie = `${cookieName}=; Max-Age=0; path=/;`;
            });
        };
        
        // Clear cookies immediately
        clearAllAuthCookies();

        
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
                
                // Clear all storage items
                const localStorageKeys = ['token', 'user', 'userId', 'username', 'refreshAccountStatus'];
                localStorageKeys.forEach(key => localStorage.removeItem(key));
                
                const sessionStorageKeys = ['token', 'user', 'userId', 'username'];
                sessionStorageKeys.forEach(key => sessionStorage.removeItem(key));
                
                // Clear cookies again to be sure
                clearAllAuthCookies();
                
                // Trigger custom event to notify other components
                window.dispatchEvent(new CustomEvent('userSignedOut'));
                
                // Force page reload to reset all component states
                window.location.href = '/login';
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