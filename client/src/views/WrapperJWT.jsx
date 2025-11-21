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
          setAuthenticated(false);
          setUser(null);
          
          // Only redirect if it's not just "no session found" (could be a fresh visit)
          // Allow component to render and let parent handle redirect logic
          if (data.status === 'EXPIRED' || data.status === 'INVALID_TOKEN') {
            console.log('Session expired or invalid, redirecting to sign-in');
            navigate('/login-test');
          } else if (data.status === 'NO_TOKEN') {
            console.log('No session token found - user needs to log in');
            // Don't auto-redirect, let the parent component decide
          }
        }
      } else {
        console.error('Session check failed with status:', response.status);
        setAuthenticated(false);
        setUser(null);
        // Only redirect on server errors, not on expected auth failures
        if (response.status >= 500) {
          console.log('Server error, redirecting to sign-in');
          navigate('/sign-in');
        }
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setAuthenticated(false);
      setUser(null);
      // Only redirect on network errors, not on expected responses
      console.log('Network error during authentication check');
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
          onClick={() => navigate('/login-test')}
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
