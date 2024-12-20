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
        if (!token) {
          setError('No authentication token found');
          return;
        }

        console.log('Fetching measurements for userId:', userId);
        const response = await axios.get(
          `http://localhost:5002/api/auth/clients/${userId}/measurements`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        console.log('Received response:', response.data);
        
        if (response.data.measurements && response.data.measurements.length > 0) {
          const latestMeasurements = response.data.measurements[response.data.measurements.length - 1].values;
          setMeasurements(latestMeasurements);
        } else {
          console.log('No measurements found, using default values');
          // Keep the default empty values set in initial state
        }
      } catch (err) {
        console.error('Error details:', err.response || err);
        const errorMessage = err.response?.data?.msg || 'Error fetching client data';
        setError(errorMessage);
      }
    };

    if (userId) {
      fetchClientData();
    }
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
    <div className="container common-form">
      <form onSubmit={handleSubmit}>
        <h1 className="common-title">Actualizar Medidas del Cliente</h1>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="form-section">
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
              className={error && error.peso ? 'error' : ''}
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
              className={error && error.grasaCorporal ? 'error' : ''}
            />
          </div>
        </div>

        <div className="form-section">
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
              className={error && error.pecho ? 'error' : ''}
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
              className={error && error.bicepDerecho ? 'error' : ''}
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
              className={error && error.bicepIzquierdo ? 'error' : ''}
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
              className={error && error.espalda ? 'error' : ''}
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
              className={error && error.cintura ? 'error' : ''}
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
              className={error && error.gluteos ? 'error' : ''}
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
              className={error && error.musloDerecho ? 'error' : ''}
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
              className={error && error.musloIzquierdo ? 'error' : ''}
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
              className={error && error.gemeloDerecho ? 'error' : ''}
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
              className={error && error.gemeloIzquierdo ? 'error' : ''}
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