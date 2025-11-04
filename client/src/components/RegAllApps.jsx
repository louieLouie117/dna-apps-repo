import React, { useState } from 'react';
import supabase from '../config/SupaBaseClient';
import emailjs from '@emailjs/browser';
import PageHeader from './PageHeader';

const RegAllApps = () => {
  const [userList, setUserList] = useState([]);

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // useeffect to fetch existing users can be added here if needed
  React.useEffect(() => {
    console.log('API Base URL:', API_BASE_URL);
    
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}api/users`);
        const data = await response.json();
        setUserList(data.data || []);
        console.log('Fetched users:', data.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    subscriptionType: '1234567',
    expired: ''
  });
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
      const response = await fetch(`${API_BASE_URL}api/create-user`, {
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
              subject: 'Your account is now active',
              message: `Welcome!

                Thank you for joining us. Your account has been successfully activated.

                🎉 You can now enjoy All App Access services!

                Need help? If you have any questions, feel free to reach out to our support team.

                Best regards,
                The Support Team`,
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
        setMessage('User created successfully!');
        setFormData({
          username: '',
          password: '',
          subscriptionType: '',
          expired: ''
        });
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
      const response = await fetch(`${API_BASE_URL}api/delete-user/${id}`, {
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
      
      {message && (
        <div style={{ color: 'green', marginBottom: '10px' }}>
          {message}
        </div>
      )}
      
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
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>
            Username:
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
                        <strong>Important:</strong> You must must use the <span style={{ color: '#1976d2' }}>same email</span> you used during your subscription process.
                    </div>

                      <div>
         
          <select 
            className='hidden'
            id="subscriptionType"
            name="subscriptionType"
            value={formData.subscriptionType}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          >
            <option value="1234567">All App Access</option>
            <option value="135">Student Access</option>
          </select>
        </div>
      </form>
      {/* loading indicator */}
                   
      </div>

      
     
    </div>
  );
};

export default RegAllApps;