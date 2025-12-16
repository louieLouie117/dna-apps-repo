import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { safeCookieParser } from '../utils/cookieUtils';
import ComingSoon from '../components/ComingSoon';
import './WrapperJWT.css';

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
         
          // Use safe cookie setter
          const cookieSet = safeCookieParser.setCookie('userId', data.user.id);
          if (cookieSet) {
            console.log('Set userId cookie successfully');
          } else {
            console.warn('Failed to set userId cookie');
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
      <div className="loading-container">
        <div>
          <div className="loading-spinner"></div>
          Checking authentication...
        </div>
      </div>
    );
  }

  // More specific condition handling to prevent edge cases
  if (loading) {
    // Already handled above
    return null;
  }

  if (!authenticated) {
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
            title: 'Welcome!',
            message: 'Manage your account in your dashboard.'
          };
        default:
          return {
            title: 'Welcome!',
            message: 'Manage your account in your dashboard.'
          };
      }
    };

    const authMessage = getAuthMessage();

    return (
      <>
      <div className="auth-layout">
        
        <div className="auth-content">
          <PageHeader />
        <h2>{authMessage.title}</h2>
        <p>{authMessage.message}</p>
        <button 
          onClick={() => navigate('/login')}
          className="dashboard-button"
        >
          Dashboard
        </button>
        </div>
         {/* render component here */}
        <ComingSoon />
      </div>
     
      </>
      
    );
  }

  // Only render children if we're authenticated AND have user data
  if (authenticated && user && userId) {
    return children;
  }

  // Fallback: if authenticated but missing user data, show loading
  return (
    <div className="fallback-loading">
      <div>
        <div className="loading-spinner"></div>
        Loading user data...
      </div>
    </div>
  );
}
