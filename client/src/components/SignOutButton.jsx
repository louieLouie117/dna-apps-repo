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
        const clearAllCookies = () => {
            try {
                const cookiesToClear = ['username', 'userId', 'token', 'refreshToken', 'sessionId'];
                
                cookiesToClear.forEach(cookieName => {
                    // Multiple clearing methods for better compatibility
                    document.cookie = `${cookieName}=; Max-Age=0; path=/;`;
                    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                    
                    // Clear for different domains if needed
                    if (window.location && window.location.hostname) {
                        document.cookie = `${cookieName}=; Max-Age=0; path=/; domain=${window.location.hostname};`;
                        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
                        
                        // Clear for parent domain
                        const domainParts = window.location.hostname.split('.');
                        if (domainParts.length > 1) {
                            const parentDomain = '.' + domainParts.slice(-2).join('.');
                            document.cookie = `${cookieName}=; Max-Age=0; path=/; domain=${parentDomain};`;
                            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${parentDomain};`;
                        }
                    }
                });
            } catch (error) {
                console.warn('Error clearing cookies:', error);
            }
        };

        // Clear cookies immediately
        clearAllCookies();
        
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
                try {
                    const storageKeys = ['token', 'user', 'userId', 'username', 'refreshAccountStatus'];
                    storageKeys.forEach(key => {
                        localStorage.removeItem(key);
                        sessionStorage.removeItem(key);
                    });
                } catch (error) {
                    console.warn('Error clearing storage:', error);
                }
                
                // Clear cookies again to be absolutely sure
                clearAllCookies();
                
                // Small delay before navigation to ensure cleanup completes
                setTimeout(() => {
                    navigate('/login');
                }, 100);
            } else {
                console.error('Logout failed with status:', response.status);
                // Clear local data even if server logout fails
                clearAllCookies();
                try {
                    const storageKeys = ['token', 'user', 'userId', 'username', 'refreshAccountStatus'];
                    storageKeys.forEach(key => {
                        localStorage.removeItem(key);
                        sessionStorage.removeItem(key);
                    });
                } catch (error) {
                    console.warn('Error clearing storage on logout failure:', error);
                }
                setTimeout(() => navigate('/login'), 100);
            }
        } catch (error) {
            console.error('Error during logout:', error);
            // Clear local data even on network error
            clearAllCookies();
            try {
                const storageKeys = ['token', 'user', 'userId', 'username', 'refreshAccountStatus'];
                storageKeys.forEach(key => {
                    localStorage.removeItem(key);
                    sessionStorage.removeItem(key);
                });
            } catch (storageError) {
                console.warn('Error clearing storage on network error:', storageError);
            }
            setTimeout(() => navigate('/login'), 100);
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