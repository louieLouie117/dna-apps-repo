import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

export default function WrapperJWT({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [authFailureReason, setAuthFailureReason] = useState(null);
  const navigate = useNavigate();

  // Get API base URL from environment or default to localhost
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  // Simple function to reset authentication state
  const resetAuthState = () => {
    setAuthenticated(false);
    setUser(null);
    setUserId(null);
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
         
          try {
            document.cookie = `userId=${data.user.id}; path=/;`;
            // console log cookie for debugging
            console.log('Set userId cookie:', document.cookie);
          } catch (error) {
            console.warn('Error setting userId cookie:', error);
          }
       
        } else {
          console.log('Authentication status:', data.status, '-', data.message);
          
          // Handle different authentication failure scenarios
          if (data.status === 'EXPIRED' || data.status === 'INVALID_TOKEN') {
            console.log('Session expired or invalid token detected');
            setAuthFailureReason('EXPIRED');
            resetAuthState();
          } else if (data.status === 'NO_TOKEN') {
            console.log('No session token found - user needs to log in');
            setAuthFailureReason('NO_TOKEN');
            resetAuthState();
            // Don't auto-redirect, let the parent component decide
          } else {
            // Handle other authentication failures
            console.log('Authentication failed:', data.status);
            setAuthFailureReason('OTHER');
            resetAuthState();
          }
        }
      } else {
        console.error('Session check failed with status:', response.status);
        
        // Handle different HTTP status codes
        if (response.status === 401 || response.status === 403) {
          console.log('Unauthorized access - resetting auth state');
          resetAuthState();
          alert('Your session is no longer valid. Please log in again.');
          navigate('/login');
        } else if (response.status >= 500) {
          console.log('Server error, resetting auth state and redirecting');
          resetAuthState();
          navigate('/login');
        } else {
          // Other client errors (400, 404, etc.)
          resetAuthState();
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
    // Determine message based on failure reason
    const getAuthMessage = () => {
      switch (authFailureReason) {
        case 'EXPIRED':
          return {
            title: 'Welcome back!',
            message: 'Your session has expired. Please log in again to continue.'
          };
        case 'NO_TOKEN':
          return {
            title: 'Your account has been created.',
            message: 'Please log in to access this content.'
          };
        default:
          return {
            title: 'Your account has been created.',
            message: 'Please log in to continue.'
          };
      }
    };

    const authMessage = getAuthMessage();

    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <PageHeader />
        <h2>{authMessage.title}</h2>
        <p>{authMessage.message}</p>
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
          Login to your account.
        </button>
      </div>
    );
  }

  return authenticated ? children : null;
}
