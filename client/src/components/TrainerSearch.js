import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles.css';

const TrainerSearch = () => {
  const [searchEmail, setSearchEmail] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState('');

  // Fetch all clients when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found');
          return;
        }

        const response = await axios.get('http://localhost:5002/api/auth/clients', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Fetched users:', response.data); // Debug log
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (err) {
        console.error('Error details:', err); // Debug log
        setError('Error fetching users: ' + (err.response?.data?.message || err.message));
      }
    };

    fetchUsers();
  }, []);

  // Handle search input changes
  const handleSearchChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchEmail(searchTerm);
    
    const filtered = users.filter(user => 
      user.email.toLowerCase().includes(searchTerm)
    );
    console.log('Filtered users:', filtered); // Debug log
    setFilteredUsers(filtered);
  };

  return (
    <div className="search-container">
      <h2>Client Search</h2>
      
      <div className="search-box">
        <input
          type="text"
          placeholder="Search by email..."
          value={searchEmail}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="users-table">
        {filteredUsers.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Link 
                      to={`/TrainerDashboard/edit-routine/${user._id}`}
                      className="edit-routine-link"
                    >
                      Edit Routine
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No clients found</p>
        )}
      </div>
    </div>
  );
};

export default TrainerSearch; 