import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminSearch = () => {
    const [trainers, setTrainers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');

    const fetchTrainers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5002/api/auth/trainers', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTrainers(response.data);
        } catch (err) {
            console.error('Error fetching trainers:', err);
            setError('Failed to load trainers');
        }
    };

    useEffect(() => {
        fetchTrainers();
    }, []);

    const handleStatusUpdate = async (trainerId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:5002/api/auth/trainer-status/${trainerId}`,
                { status: newStatus },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            fetchTrainers(); // Refresh the trainers list
        } catch (err) {
            console.error('Error updating trainer status:', err);
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