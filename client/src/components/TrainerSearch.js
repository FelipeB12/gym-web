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
    <div className="trainer-schedule">
      <h2 className="trainer-schedule-title">Buscar usuario</h2>
      
      <div className="search-box">
        <input
          type="text"
          placeholder="Buscar por email..."
          value={searchEmail}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="appointments-container">
        {filteredUsers.length === 0 ? (
          <p className="no-appointments">No clients found</p>
        ) : (
          filteredUsers.map(user => (
            <div key={user._id} className="appointment-card">
              <div className="appointment-detail">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{user.name}</span>
              </div>
              <div className="appointment-detail">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{user.email}</span>
              </div>
              <div className="action-buttons">
                <Link 
                  to={`/TrainerDashboard/edit-routine/${user._id}`}
                  className="accept-button"
                >
                  Edit Routine
                </Link>
                <Link 
                  to={`/TrainerDashboard/edit-progress/${user._id}`}
                  className="reject-button"
                >
                  Edit Progress
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TrainerSearch; 