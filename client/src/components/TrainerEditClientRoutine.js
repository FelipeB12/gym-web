import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TrainerEditClientRoutine = () => {
  const { userId } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5002/api/auth/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setClient(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching client data: ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };

    fetchClientData();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!client) return <div>Client not found</div>;

  return (
    <div className="edit-routine-container">
      <h2>Edit Routine for {client.name}</h2>
      {/* Add routine editing form here */}
      <div className="routine-form">
        {/* TODO: Add routine editing functionality */}
        <p>Routine editing interface coming soon...</p>
      </div>
    </div>
  );
};

export default TrainerEditClientRoutine;
