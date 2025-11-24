import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WrapperJWT({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  // Get API base URL from environment or default to localhost
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  // Function to clear all authentication cookies and session data
  const clearAuthenticationData = () => {
    console.log('Clearing authentication data...');
    
    // Clear all authentication-related cookies
    const cookiesToClear = ['token', 'userId', 'username', 'refreshToken', 'sessionId'];
    
    cookiesToClear.forEach(cookieName => {
      // Clear cookie for current domain
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      // Clear cookie for root domain (in case of subdomain)
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      // Clear cookie for parent domain
      const domainParts = window.location.hostname.split('.');
      if (domainParts.length > 1) {
        const parentDomain = '.' + domainParts.slice(-2).join('.');
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${parentDomain};`;
      }
    });
    
    // Clear localStorage items
    const localStorageKeys = ['token', 'user', 'userId', 'username', 'refreshAccountStatus'];
    localStorageKeys.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Clear sessionStorage items
    const sessionStorageKeys = ['token', 'user', 'userId', 'username'];
    sessionStorageKeys.forEach(key => {
      sessionStorage.removeItem(key);
    });
    
    // Reset component state
    setAuthenticated(false);
    setUser(null);
    setUserId(null);
    
    console.log('Authentication data cleared successfully');
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      // Check session status using the session API
      const response = await fetch(`${API_BASE_URL}/api/session/status`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.success && data.authenticated) {
          setAuthenticated(true);
          setUser(data.user);
            setUserId(data.user.id);
         
            document.cookie = `userId=${data.user.id}; path=/;`;
            // console log cookie for debugging
            console.log('Set userId cookie:', document.cookie);
       
        } else {
          console.log('Authentication status:', data.status, '-', data.message);
          
          // Handle different authentication failure scenarios
          if (data.status === 'EXPIRED' || data.status === 'INVALID_TOKEN') {
            console.log('Session expired or invalid token detected');
            clearAuthenticationData();
            
            // Show user-friendly message about session expiry
            alert('Your session has expired. Please log in again.');
            navigate('/login');
          } else if (data.status === 'NO_TOKEN') {
            console.log('No session token found - user needs to log in');
            // Clear any stale data but don't show alert (could be first visit)
            clearAuthenticationData();
            // Don't auto-redirect, let the parent component decide
          } else {
            // Handle other authentication failures
            console.log('Authentication failed:', data.status);
            clearAuthenticationData();
          }
        }
      } else {
        console.error('Session check failed with status:', response.status);
        
        // Handle different HTTP status codes
        if (response.status === 401 || response.status === 403) {
          console.log('Unauthorized access - clearing authentication data');
          clearAuthenticationData();
          alert('Your session is no longer valid. Please log in again.');
          navigate('/login');
        } else if (response.status >= 500) {
          console.log('Server error, clearing stale data and redirecting');
          clearAuthenticationData();
          navigate('/login');
        } else {
          // Other client errors (400, 404, etc.)
          clearAuthenticationData();
        }
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      
      // Clear authentication data on network errors to prevent stale sessions
      clearAuthenticationData();
      
      // Don't redirect on network errors, but show the authentication required screen
      console.log('Network error during authentication check - authentication data cleared');
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        <div>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          Checking authentication...
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Only render children if authenticated, otherwise show message
  if (!authenticated && !loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <h2>Authentication Required</h2>
        <p>Please log in to access this content.</p>
        <button 
          onClick={() => navigate('/login')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  return authenticated ? children : null;
}
