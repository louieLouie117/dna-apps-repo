import React, { useState } from 'react';
import supabase from '../config/SupaBaseClient';
import emailjs from '@emailjs/browser';

const CreateUser = () => {
  const [userList, setUserList] = useState([]);

  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  // useeffect to fetch existing users can be added here if needed
  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users');
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
      const response = await fetch('http://localhost:5000/api/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      let data;
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
        const textResponse = await response.text();
        console.log('Raw response:', textResponse);
        setError(`Server error: ${response.status} - ${textResponse}`);
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
      const response = await fetch(`http://localhost:5000/api/delete-user/${id}`, {
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
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Create New User</h2>
      
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

      <form onSubmit={handleSubmit}>
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

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="subscriptionType" style={{ display: 'block', marginBottom: '5px' }}>
            Subscription Type:
          </label>
          <select
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
          {loading ? 'Creating User...' : 'Create User'}
        </button>
      </form>
      {/* loading indicator */}
      {loading && <div>Loading...</div>}
      <ul style={{ display: "grid", rowGap: "10px", marginTop: "20px" }}>
        {userList.map(user => (
          <li key={user.id}>
             <strong>Username:</strong> {user.username} <br />
            <strong>Subscription:</strong> {user.subscriptiontype} <br />
            <strong>Created:</strong> {user.__createdAt}
            <button onClick={() => handleDelete(user.id)}>delete</button>
          </li>
         
        ))}
      </ul>   
    </div>
  );
};

export default CreateUser;