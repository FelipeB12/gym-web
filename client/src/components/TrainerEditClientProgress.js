import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TrainerEditClientProgress = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [measurements, setMeasurements] = useState({
    peso: '',
    grasaCorporal: '',
    pecho: '',
    bicepDerecho: '',
    bicepIzquierdo: '',
    espalda: '',
    cintura: '',
    gluteos: '',
    musloDerecho: '',
    musloIzquierdo: '',
    gemeloDerecho: '',
    gemeloIzquierdo: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5002/api/auth/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Get the latest measurements
        const latestMeasurements = response.data.measurements[response.data.measurements.length - 1].values;
        setMeasurements(latestMeasurements);
      } catch (err) {
        setError('Error fetching client data');
        console.error(err);
      }
    };

    fetchClientData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeasurements(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const today = new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      const newMeasurement = {
        date: today,
        values: measurements
      };

      console.log('Sending measurement data:', newMeasurement);

      const response = await axios({
        method: 'post',
        url: `http://localhost:5002/api/auth/measurements/${userId}`,
        data: { measurement: newMeasurement },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Server response:', response.data);

      if (response.data.msg === 'Measurements updated successfully') {
        alert('Progreso actualizado correctamente');
        setSuccess('Medidas actualizadas correctamente');
        setTimeout(() => {
          navigate('/TrainerDashboard/search');
        }, 2000);
      }
    } catch (err) {
      console.error('Error details:', err.response || err);
      setError(err.response?.data?.msg || 'Error al actualizar las medidas');
    }
  };

  return (
    <div className="edit-progress-container">
      <h2>Actualizar Medidas del Cliente</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="measurements-form">
        <div className="measurements-section">
          <h3>Medidas Generales</h3>
          <div className="form-group">
            <label htmlFor="peso">Peso (kg):</label>
            <input
              type="number"
              step="0.1"
              id="peso"
              name="peso"
              value={measurements.peso}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="grasaCorporal">Grasa Corporal (%):</label>
            <input
              type="number"
              step="0.1"
              id="grasaCorporal"
              name="grasaCorporal"
              value={measurements.grasaCorporal}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="measurements-section">
          <h3>Medidas Musculares (cm)</h3>
          <div className="form-group">
            <label htmlFor="pecho">Pecho:</label>
            <input
              type="number"
              step="0.1"
              id="pecho"
              name="pecho"
              value={measurements.pecho}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="bicepDerecho">Bícep Derecho:</label>
            <input
              type="number"
              step="0.1"
              id="bicepDerecho"
              name="bicepDerecho"
              value={measurements.bicepDerecho}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="bicepIzquierdo">Bícep Izquierdo:</label>
            <input
              type="number"
              step="0.1"
              id="bicepIzquierdo"
              name="bicepIzquierdo"
              value={measurements.bicepIzquierdo}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="espalda">Espalda:</label>
            <input
              type="number"
              step="0.1"
              id="espalda"
              name="espalda"
              value={measurements.espalda}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="cintura">Cintura:</label>
            <input
              type="number"
              step="0.1"
              id="cintura"
              name="cintura"
              value={measurements.cintura}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="gluteos">Glúteos:</label>
            <input
              type="number"
              step="0.1"
              id="gluteos"
              name="gluteos"
              value={measurements.gluteos}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="musloDerecho">Muslo Derecho:</label>
            <input
              type="number"
              step="0.1"
              id="musloDerecho"
              name="musloDerecho"
              value={measurements.musloDerecho}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="musloIzquierdo">Muslo Izquierdo:</label>
            <input
              type="number"
              step="0.1"
              id="musloIzquierdo"
              name="musloIzquierdo"
              value={measurements.musloIzquierdo}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="gemeloDerecho">Gemelo Derecho:</label>
            <input
              type="number"
              step="0.1"
              id="gemeloDerecho"
              name="gemeloDerecho"
              value={measurements.gemeloDerecho}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="gemeloIzquierdo">Gemelo Izquierdo:</label>
            <input
              type="number"
              step="0.1"
              id="gemeloIzquierdo"
              name="gemeloIzquierdo"
              value={measurements.gemeloIzquierdo}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className="submit-button">
          Guardar Medidas
        </button>
      </form>
    </div>
  );
};

export default TrainerEditClientProgress; 