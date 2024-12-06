import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles.css';

const AdminTrainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5002/api/auth/trainers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTrainers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los entrenadores');
      setLoading(false);
    }
  };

  const handleStatusToggle = async (trainerId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      await axios.put(
        `http://localhost:5002/api/auth/trainer-status/${trainerId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      // Update local state
      setTrainers(trainers.map(trainer => 
        trainer._id === trainerId 
          ? { ...trainer, status: newStatus }
          : trainer
      ));
    } catch (err) {
      setError('Error al actualizar el estado del entrenador');
    }
  };

  const filteredTrainers = trainers.filter(trainer =>
    trainer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-trainers">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar entrenador..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="trainers-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredTrainers.map(trainer => (
            <tr key={trainer._id}>
              <td>{trainer.name}</td>
              <td>{trainer.email}</td>
              <td>
                <span className={`status-badge ${trainer.status}`}>
                  {trainer.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td>
                <button
                  className={`status-toggle-btn ${trainer.status}`}
                  onClick={() => handleStatusToggle(trainer._id, trainer.status)}
                >
                  {trainer.status === 'active' ? 'Desactivar' : 'Activar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTrainers; 