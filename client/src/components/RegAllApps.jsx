import React, { useState } from 'react';
import supabase from '../config/SupaBaseClient';
import emailjs from '@emailjs/browser';
import PageHeader from './PageHeader';
import safeCookieParser from '../utils/cookieUtils';

/*
=== SUBSCRIPTION URL REFERENCES ===

*/

const RegAllApps = () => {
  const [userList, setUserList] = useState([]);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const currentUrl = window.location.href;
    const [paymentMethod, setPaymentMethod] = useState('Stripe'); // Track payment method
    const [SubscriptTypeBaseOnUrl, setSubscriptTypeBaseOnUrl] = useState('All App Access');

    React.useEffect(() => {
        // Determine subscription type based on URL - run only once on mount
        let detectedType = 'All App Access';
        let logMessage = 'Default: All App Access';

        if (currentUrl.includes('student-membership')) {
            detectedType = 'All App Access';
            logMessage = 'Detected Student Subscription URL';
        } else if (currentUrl.includes('all-app-subscription')) {
            detectedType = 'All App Access';
            logMessage = 'Detected All App Access Subscription URL';
        } else if (currentUrl.includes('budget-monthly') || currentUrl.includes('MyBudgetMonthly')) {
            detectedType = 'My Budget Monthly';
            logMessage = 'Detected My Budget Monthly Subscription URL';
        } else if (currentUrl.includes('locked-passwords') || currentUrl.includes('MyLockedPasswords')) {
            detectedType = 'My Locked Passwords';
            logMessage = 'Detected My Locked Passwords Subscription URL';
        } else if (currentUrl.includes('flashcards') || currentUrl.includes('MyFlashcards')) {
            detectedType = 'My Flashcards';
            logMessage = 'Detected My Flashcards Subscription URL';
        } else if (currentUrl.includes('todo-list') || currentUrl.includes('MyTodoList')) {
            detectedType = 'My Todo List';
            logMessage = 'Detected My Todo List Subscription URL';
        }

        setSubscriptTypeBaseOnUrl(detectedType);
        
        // Single console log with correct detected type
        console.log('🔍 URL Detection:', {
            url: currentUrl,
            detectedSubscriptionType: detectedType,
            message: logMessage
        });
        
    }, []); // Empty dependency array - run only once

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    subscriptionType: SubscriptTypeBaseOnUrl || '1234567',
    expired: ''
  });

  // Update formData when SubscriptTypeBaseOnUrl changes
  React.useEffect(() => {
    setFormData(prev => ({
      ...prev,
      subscriptionType: SubscriptTypeBaseOnUrl
    }));
  }, [SubscriptTypeBaseOnUrl]);

  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    // Debug logging
    console.log('Form data being sent:', formData);

    try {
      const response = await fetch(`${API_BASE_URL}/api/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      let data;
      let responseText;
      
      // Clone the response to read it multiple times if needed
      const responseClone = response.clone();
      
      try {
        data = await response.json();
        console.log('Response data:', data.data);
        setUserList(data.data || []);

        // update Supabase table Users filter by email
        const { data: updateData, error: updateError } = await supabase
          .from('Users')
          .update({
            status: 'Active',
          })
          .eq('email', formData.username);
          console.log('Supabase update complete:');
          // email js notification your account is active
            emailjs.send(
            serviceId,
            templateId,
            {
              to_email: formData.username,
              subject: '🎉 Welcome to DNA Apps - Your Account is Active!',
              message: `
                <!DOCTYPE html>
                <html>
                <head>
                  <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .welcome-text { font-size: 24px; font-weight: bold; margin-bottom: 20px; }
                    .button { display: inline-block; background: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
                    .highlight { background: #e8f5e8; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 30px; color: #666; }
                  </style>
                </head>
                <body>
                  <div class="container">
                  
                    <div class="content">
                      <div class="welcome-text">
                       <h3>🎉 Welcome to DNA Apps!</h3>
                      <p>Your All App Access account is now active</p>
                      </div>
                      <p>Thank you for joining the DNA Apps community! We're excited to have you on board.</p>
                      
                      <div class="highlight">
                        <strong>✅ Your account has been successfully activated!</strong><br>
                        You now have full access to all our premium applications and services.
                      </div>
                      
                      <p>Ready to get started? Access your personalized dashboard to explore all available apps:</p>
                      
                      <div style="text-align: center;">
                        <a href="${window.location.origin}/dashboard" class="button">🚀 Go to Dashboard</a>
                      </div>
                      
                      <h3>What's Next?</h3>
                      <ul>
                        <li>🎯 Browse and launch all available applications</li>
                        <li>⚙️ Customize your preferences in settings</li>
                        <li>📞 Contact support if you need any assistance</li>
                      </ul>
                      
                      <div class="footer">
                        <p><strong>Need Help?</strong><br>
                        Our support team is here to help! Feel free to reach out anytime.</p>
                        <p>Best regards,<br><strong>The DNA Apps Team</strong></p>
                      </div>
                    </div>
                  </div>
                </body>
                </html>
              `,
              status: 'Active'
            },
            
            publicKey

            );
            console.log('EmailJS notification sent.')


        if (updateError) {
          console.error('Error updating user in Supabase:', updateError);
          setError(`Error updating user: ${updateError.message}`);
        } else {
          console.log('User updated successfully in Supabase:', updateData);
        }
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        try {
          responseText = await responseClone.text();
          console.log('Raw response:', responseText);
          setError(`Server error: ${response.status} - ${responseText}`);
        } catch (textError) {
          console.error('Failed to read response as text:', textError);
          setError(`Server error: ${response.status} - Unable to read response`);
        }
        return;
      }

      if (response.ok) {
        // 1. Sign up user with Supabase Auth
        try {
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: formData.username,
            password: formData.password,
          });         

          if (authError) {
            if (
              authError.message &&
              (authError.message.toLowerCase().includes('user already registered') ||
               authError.message.toLowerCase().includes('user already exists') ||
               (authError.message.toLowerCase().includes('account') && authError.message.toLowerCase().includes('exists')))
            ) {
              setMessage('Account already has been created. Please log in or contact support if you need assistance.');
            } else {
              setError(`Auth Error: ${authError.message}`);
            }
            return;
          }

          // 2. Insert into Users table
          const { error: tableError } = await supabase
            .from('Users')
            .insert([{ 
              email: formData.username, 
              status: 'Active', 
              // auth_uid: userId,
              payment_method: paymentMethod,
            }]);

          if (tableError) {
            setError(`Table Error: ${tableError.message}`);
            alert('Error creating user account. Please try again.');
            return;
          }

          // const cookieSet = safeCookieParser.setCookie('username', formData.username);
          // console.log('Cookie set:', cookieSet);

          // 3. Send notification email to support
          try {
            await emailjs.send(
              serviceId,
              templateId,
              {
                to_email: 'customersupport@projectdnaapps.com',
                subject: '🎉 New DNA Apps Subscriber Registration',
                message: `
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <style>
                      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                      .header { background: #2196F3; color: white; padding: 20px; text-align: center; border-radius: 5px; }
                      .content { background: #f5f5f5; padding: 20px; margin-top: 20px; border-radius: 5px; }
                      .info-box { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #4CAF50; }
                      .timestamp { color: #666; font-size: 14px; }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <div class="header">
                        <h2>🎉 New Subscriber Alert</h2>
                      </div>
                      <div class="content">
                        <p><strong>Great news!</strong> A new user has successfully subscribed to DNA Apps.</p>
                        
                        <div class="info-box">
                          <h3>📊 Subscription Details:</h3>
                          <p><strong>📧 Email:</strong> ${formData.username}</p>
                          <p><strong>💳 Payment Method:</strong> ${paymentMethod}</p>
                          <p><strong>📦 Subscription Type:</strong> All App Access</p>
                          <p class="timestamp"><strong>🕒 Registration Time:</strong> ${new Date().toLocaleString()}</p>
                        </div>
                        
                        <div class="info-box">
                          <h3>✅ Actions Completed:</h3>
                          <ul>
                            <li>Account created in system</li>
                            <li>User status set to 'Active'</li>
                            <li>Welcome email sent to customer</li>
                            <li>Dashboard access granted</li>
                          </ul>
                        </div>
                        
                        <p><em>This is an automated notification from the DNA Apps registration system.</em></p>
                      </div>
                    </div>
                  </body>
                  </html>
                `,
              },
              publicKey
            );
          } catch (emailError) {
            console.error('Failed to send notification email:', emailError);
          }

          setMessage('Please wait. You are being redirected to the dashboard...');

          // 4. Redirect to user dashboard
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 2000);

        } catch (supabaseError) {
          console.error('Supabase error:', supabaseError);
          setError(`Account creation error: ${supabaseError.message}`);
        }

      } else {
        setError(data.message || data.error || `Server error: ${response.status} - ${JSON.stringify(data)}`);
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };



  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    try {
      console.log('Attempting to delete user with ID:', id);
      const response = await fetch(`${API_BASE_URL}/api/delete-user/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Delete response status:', response.status);
      console.log('Delete response headers:', response.headers);
      
      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete failed with status:', response.status, 'Error:', errorText);
        setError(`Failed to delete user: ${response.status} - ${errorText}`);
        return;
      }
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Expected JSON but got:', contentType, 'Response:', textResponse);
        setError('Server returned unexpected response format');
        return;
      }
      
      const data = await response.json();
      console.log('Delete response data:', data);
      
      // Refresh user list after successful deletion
      setUserList(prevList => prevList.filter(user => user.id !== id));
      setMessage('User deleted successfully!');
      
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(`Error deleting user: ${error.message}`);
    }
  } ;

  return (
    <div style={{ margin: '0 auto', padding: '20px' }}>
        <header>
            <PageHeader />
        </header>
      
   
      
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          {error}
        </div>
      )}

      <div className='new-user-form'>
         <header>
                    <h2>Thank you for your payment! </h2>
                    <p>Final step: Create your account to access the apps.</p>
                </header>
        <form  className='reg-form' onSubmit={handleSubmit}>
               {message && (
                <div style={{ color: 'green', marginBottom: '10px', fontSize: '20px', fontWeight: 'bold' }}>
                {message}
                </div>
            )}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>
            email :
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>

      

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>

         <div style={{ background: '#fff3cd', color: '#856404', padding: '10px', marginBottom: '16px', borderRadius: '4px', border: '1px solid #ffeeba' }}>
                        <strong>Important:</strong> <br /> You must must use the <span style={{ color: '#1976d2' }}>same email</span> that was used during your subscription process.
                    </div>

                      <div style={{ marginTop: '15px', padding: '10px', background: '#f0f8ff', borderRadius: '4px', border: '1px solid #007bff' }}>
            <p style={{ margin: '0', color: '#007bff', fontWeight: 'bold' }}>
              📦 Subscription Type: {SubscriptTypeBaseOnUrl}
            </p>
          </div>
      </form>
      {/* loading indicator */}
                   
      </div>

      
     
    </div>
  );
};

export default RegAllApps;