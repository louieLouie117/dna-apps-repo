import React, { useState, useEffect } from 'react';

const GetUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        console.log('Users:', data.data);
        // Ensure data is an array
        // const usersArray = Array.isArray(data.data) ? data.data : (data.data.users || []);
        // console.log('Users Array:', usersArray);
        setUsers(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching users:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {users.map((user, index) => (
            <li key={user.id || index}>
              {user.name || user.username || `User ${index + 1}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GetUsers;