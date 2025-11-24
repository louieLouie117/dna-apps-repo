import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from './PageHeader';

export default function LoginTest() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'

  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      
      if (response.ok) {
        // Set username cookie
        document.cookie = `username=${data.user.username}; path=/;`;
               
        console.log('Login response:', data);
        console.log('Cookies after login:', document.cookie);
        
        setMessage('✅ Login successful! Verifying session...');
        setMessageType('success');
        
        // Test session status immediately after login
        setTimeout(() => {
          checkSession();
        }, 1000);
        
      } else {
        setMessage(`❌ ${data.error || 'Login failed. Please check your credentials.'}`);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage(`❌ Network error: ${error.message}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const checkSession = async () => {
    try {
      setMessage('🔄 Checking session status...');
      setMessageType('info');
      
      const response = await fetch(`${API_BASE_URL}/api/session/status`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      console.log('Session check after login:', data);
      
      if (data.authenticated) {
        setMessage('✅ Authentication verified! Redirecting to dashboard...');
        setMessageType('success');
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        setMessage(`⚠️ Session Status: ${data.status} - ${data.message}`);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Session check error:', error);
      setMessage(`❌ Session check failed: ${error.message}`);
      setMessageType('error');
    }
  };

  return (
    <>
    <PageHeader  />
    <div style={styles.container}>
      <div style={styles.formCard}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>
            Sign in to your DNA Apps account
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="username">
              Email *
            </label>
            <input
              id="username"
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              placeholder="Enter your email"
              style={styles.input}
              disabled={loading}
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="password">
              Password *
            </label>
            <input
              id="password"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              placeholder="Enter your password"
              style={styles.input}
              disabled={loading}
              required
            />
          </div>

          {/* Message Display */}
          {message && (
            <div style={{
              ...styles.message,
              ...(messageType === 'success' ? styles.messageSuccess : 
                 messageType === 'info' ? styles.messageInfo : styles.messageError)
            }}>
              {message}
            </div>
          )}
          
          {/* Login Button */}
          <button 
            type="submit" 
            disabled={loading}
            style={{
              ...styles.submitButton,
              ...(loading ? styles.submitButtonDisabled : {})
            }}
          >
            {loading ? (
              <>
                <span style={styles.spinner}></span>
                Signing in...
              </>
            ) : (
              '🔐 Sign In'
            )}
          </button>
        </form>

        {/* Additional Actions */}
      

        {/* Help Links */}
        <div style={styles.helpSection}>
          <p style={styles.helpText}>
            Forgot your password? 
            <a href="/request-password-reset" style={styles.link}> Reset it here</a>
          </p>
          <p style={styles.helpText}>
            Don't have an account? 
            <a href="/register" style={styles.link}> Create one now</a>
          </p>
        </div>

        {/* Debug Info (Development Only) */}
        {/* {process.env.NODE_ENV !== 'production' && (
          <div style={styles.debugSection}>
            <details style={styles.debugDetails}>
              <summary style={styles.debugSummary}>🔧 Debug Information</summary>
              <div style={styles.debugContent}>
                <p><strong>Cookies:</strong> {document.cookie || 'None'}</p>
                <p><strong>Origin:</strong> {window.location.origin}</p>
                <p><strong>API URL:</strong> {API_BASE_URL}</p>
              </div>
            </details>
          </div>
        )} */}
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
    </>
    
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px',
    backgroundColor: '#f5f7fa',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    border: '1px solid #e1e5e9',
    animation: 'slideIn 0.3s ease-out'
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  title: {
    margin: '0 0 12px 0',
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1f2937',
    lineHeight: '1.2'
  },
  subtitle: {
    margin: 0,
    fontSize: '1rem',
    color: '#6b7280',
    lineHeight: '1.5'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '4px'
  },
  input: {
    padding: '14px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    outline: 'none',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box'
  },
  message: {
    padding: '14px 18px',
    borderRadius: '12px',
    fontSize: '0.9rem',
    fontWeight: '500',
    marginTop: '8px',
    animation: 'slideIn 0.3s ease-out'
  },
  messageSuccess: {
    backgroundColor: '#ecfdf5',
    color: '#065f46',
    border: '2px solid #a7f3d0'
  },
  messageError: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    border: '2px solid #fca5a5'
  },
  messageInfo: {
    backgroundColor: '#eff6ff',
    color: '#1e40af',
    border: '2px solid #93c5fd'
  },
  submitButton: {
    padding: '16px 24px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '8px',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed',
    boxShadow: 'none'
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  actionsSection: {
    marginTop: '24px',
    display: 'flex',
    justifyContent: 'center'
  },
  secondaryButton: {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    color: '#6b7280',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  helpSection: {
    marginTop: '32px',
    textAlign: 'center',
    paddingTop: '24px',
    borderTop: '1px solid #e5e7eb'
  },
  helpText: {
    margin: '8px 0',
    fontSize: '0.9rem',
    color: '#6b7280'
  },
  link: {
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'color 0.2s ease'
  },
  debugSection: {
    marginTop: '24px',
    paddingTop: '20px',
    borderTop: '1px solid #f3f4f6'
  },
  debugDetails: {
    cursor: 'pointer'
  },
  debugSummary: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#9ca3af',
    outline: 'none',
    userSelect: 'none'
  },
  debugContent: {
    marginTop: '12px',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    fontSize: '0.75rem',
    color: '#6b7280',
    fontFamily: 'Monaco, Consolas, monospace'
  }
};