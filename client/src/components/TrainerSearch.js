import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TrainerSearch = () => {
    const [clients, setClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchClients = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5002/api/auth/clients', {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Clients fetched:', response.data);
            setClients(response.data);
        } catch (err) {
            console.error('Error fetching clients:', err);
            setError('Failed to load clients');
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleEditProgress = (userId) => {
        navigate(`/TrainerDashboard/edit-progress/${userId}`);
    };

    const handleEditRoutine = (userId) => {
        navigate(`/TrainerDashboard/edit-routine/${userId}`);
    };

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="trainer-search">
            <h2>Mis Clientes</h2>
            <input
                type="text"
                placeholder="Buscar por nombre"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />
            
            {error && <p className="error-message">{error}</p>}
            
            <div className="clients-list">
                {filteredClients.map(client => (
                    <div key={client._id} className="client-card">
                        <h3>{client.name}</h3>
                        <p>Email: {client.email}</p>
                        <p>Objetivo: {client.objective}</p>
                        <div className="action-buttons">
                            <button 
                                onClick={() => handleEditProgress(client._id)}
                                className="edit-button"
                            >
                                Editar Progreso
                            </button>
                            <button 
                                onClick={() => handleEditRoutine(client._id)}
                                className="edit-button"
                            >
                                Editar Rutina
                            </button>
                        </div>
                    </div>
                ))}
                {filteredClients.length === 0 && (
                    <p className="no-results">No se encontraron clientes</p>
                )}
            </div>
        </div>
    );
};

export default TrainerSearch; 