import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClientProgress = () => {
  const [measurements, setMeasurements] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/auth/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Response data:', response.data); // Debug log

        // Convert single measurement object to array if needed
        let measurementsArray = [];
        if (response.data.measurements) {
          if (Array.isArray(response.data.measurements)) {
            measurementsArray = response.data.measurements;
          } else {
            // If it's a single object, convert to array
            const today = new Date().toLocaleDateString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            });
            measurementsArray = [{
              date: today,
              values: response.data.measurements
            }];
          }
        }

        // Sort measurements by date (newest first)
        const sortedMeasurements = measurementsArray.sort((a, b) => {
          if (!a.date || !b.date) return 0;
          const dateA = new Date(a.date.split('/').reverse().join('-'));
          const dateB = new Date(b.date.split('/').reverse().join('-'));
          return dateB - dateA;
        });
        
        console.log('Sorted measurements:', sortedMeasurements);
        setMeasurements(sortedMeasurements);
      } catch (err) {
        console.error('Error fetching measurements:', err);
        setError('Error al cargar las medidas');
      }
    };

    fetchMeasurements();
  }, []);

  const handleRowClick = (index) => {
    // Toggle the expanded row
    setExpandedRow(expandedRow === index ? null : index);
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // If no measurements, show a message
  if (!measurements.length) {
    return <div className="progress-container">No hay medidas registradas</div>;
  }

  return (
    <div className="progress-container">
      <h3>Tu progreso en el tiempo</h3>
      <table className="progress-table">
        <thead>
          <tr>
            <th>Fechas</th>
          </tr>
        </thead>
        <tbody>
          {measurements.map((measurement, index) => (
            <React.Fragment key={index}>
              <tr onClick={() => handleRowClick(index)} style={{ cursor: 'pointer' }}>
                <td>{measurement.date}</td>
              </tr>
              {expandedRow === index && (
                <tr>
                  <td colSpan="2">
                    <table className="inner-table">
                      <thead>
                        <tr>
                          <th>Medida</th>
                          <th>Valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {measurement.values && (
                          <>
                            <tr className="measurement-header">
                              <td colSpan="2">Medidas Generales</td>
                            </tr>
                            <tr>
                              <td>Peso (kg)</td>
                              <td>{measurement.values.peso}</td>
                            </tr>
                            <tr>
                              <td>Grasa Corporal (%)</td>
                              <td>{measurement.values.grasaCorporal}</td>
                            </tr>
                            
                            <tr className="measurement-header">
                              <td colSpan="2">Medidas Musculares (cm)</td>
                            </tr>
                            <tr>
                              <td>Pecho</td>
                              <td>{measurement.values.pecho}</td>
                            </tr>
                            <tr>
                              <td>Bicep derecho</td>
                              <td>{measurement.values.bicepDerecho}</td>
                            </tr>
                            <tr>
                              <td>Bicep Izquierdo</td>
                              <td>{measurement.values.bicepIzquierdo}</td>
                            </tr>
                            <tr>
                              <td>Espalda</td>
                              <td>{measurement.values.espalda}</td>
                            </tr>
                            <tr>
                              <td>Cintura</td>
                              <td>{measurement.values.cintura}</td>
                            </tr>
                            <tr>
                              <td>Gluteos</td>
                              <td>{measurement.values.gluteos}</td>
                            </tr>
                            <tr>
                              <td>Muslo derecho</td>
                              <td>{measurement.values.musloDerecho}</td>
                            </tr>
                            <tr>
                              <td>Muslo Izquierdo</td>
                              <td>{measurement.values.musloIzquierdo}</td>
                            </tr>
                            <tr>
                              <td>Gemelo derecho</td>
                              <td>{measurement.values.gemeloDerecho}</td>
                            </tr>
                            <tr>
                              <td>Gemelo Izquierdo</td>
                              <td>{measurement.values.gemeloIzquierdo}</td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientProgress;
