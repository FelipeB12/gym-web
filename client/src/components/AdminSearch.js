import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminSearch = () => {
    const [trainers, setTrainers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');

    const fetchTrainers = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Fetching trainers with token:', token ? 'Present' : 'Missing');
            
            const response = await axios.get('http://localhost:5002/api/auth/trainers', {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Trainers response:', response.data);
            setTrainers(response.data);
        } catch (err) {
            console.error('Error fetching trainers:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });
            setError(`Failed to load trainers: ${err.response?.data?.msg || err.message}`);
        }
    };

    useEffect(() => {
        fetchTrainers();
    }, []);

    const handleStatusUpdate = async (trainerId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            console.log('Updating trainer status:', {
                trainerId,
                newStatus,
                token: token ? 'Present' : 'Missing'
            });

            const response = await axios.put(
                `http://localhost:5002/api/auth/trainer-status/${trainerId}`,
                { status: newStatus },
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            console.log('Server response:', response.data);
            fetchTrainers(); // Refresh the trainers list
        } catch (err) {
            console.error('Error details:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });
            setError('Failed to update trainer status');
        }
    };

    const filteredTrainers = trainers.filter(trainer =>
        trainer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-search">
            <h1>Search Trainers</h1>
            <input
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {error && <p className="error-message">{error}</p>}
            <div className="trainers-list">
                {filteredTrainers.map(trainer => (
                    <div key={trainer._id} className="trainer-card">
                        <h3>{trainer.name}</h3>
                        <p>Email: {trainer.email}</p>
                        <p>Usuarios Actuales: {trainer.clientCount || 0}</p>
                        <p>Usuarios Estimados: {trainer.estimatedUsers || 'No especificado'}</p>
                        <p>Status: <span className={`status-${trainer.status}`}>{trainer.status}</span></p>
                        <button
                            onClick={() => handleStatusUpdate(trainer._id, trainer.status === 'active' ? 'inactive' : 'active')}
                            className={`status-button ${trainer.status}`}
                        >
                            {trainer.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminSearch; 