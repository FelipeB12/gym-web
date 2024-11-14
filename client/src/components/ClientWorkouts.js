import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Layout from './Layout';
import '../styles.css';

const ClientWorkouts = () => {
  const [routines, setRoutines] = useState({
    1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: []
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/workouts', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setRoutines(response.data.routine || {});
        setLoading(false);
      } catch (err) {
        console.error('Error fetching routines:', err);
        setErrorMessage('Error al cargar las rutinas. Por favor, intente más tarde.');
        setLoading(false);
      }
    };

    fetchRoutines();
  }, []);

  const getDayName = (day) => {
    const days = {
      1: 'Lunes',
      2: 'Martes',
      3: 'Miércoles',
      4: 'Jueves',
      5: 'Viernes',
      6: 'Sábado',
      7: 'Domingo'
    };
    return days[day];
  };

  if (loading) return <div className="loading">Cargando...</div>;

  const hasRoutines = Object.values(routines).some(day => day.length > 0);

  return (
    <Layout>
      <div className="workouts-container">
        <div className="workouts-header">
          <h2>Mi Rutina de Ejercicios</h2>
          <Link to="/ClientEditWorkout" className="edit-button">
            {hasRoutines ? 'Editar Rutina' : 'Crear Rutina'}
          </Link>
        </div>

        {errorMessage ? (
          <div className="error-message">{errorMessage}</div>
        ) : (
          <div className="routine-table-container">
            <table className="routine-table">
              <thead>
                <tr>
                  <th>Día</th>
                  <th>Ejercicios</th>
                  <th>Series</th>
                  <th>Repeticiones</th>
                  <th>Peso (kg)</th>
                  <th>Última Actualización</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(routines).map(([day, exercises]) => (
                  <tr key={day}>
                    <td className="day-cell">{getDayName(day)}</td>
                    <td className="exercises-cell">
                      {exercises.length > 0 ? (
                        <ul>
                          {exercises.map((exercise, index) => (
                            <li key={index}>{exercise.name || 'Ejercicio sin nombre'}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="rest-day">Sin ejercicios asignados</span>
                      )}
                    </td>
                    <td>
                      {exercises.length > 0 ? (
                        exercises.map((exercise, index) => (
                          <div key={index}>{exercise.series || '0'}</div>
                        ))
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      {exercises.length > 0 ? (
                        exercises.map((exercise, index) => (
                          <div key={index}>{exercise.rep || '0'}</div>
                        ))
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      {exercises.length > 0 ? (
                        exercises.map((exercise, index) => (
                          <div key={index}>{exercise.peso || '0'}</div>
                        ))
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      {exercises.length > 0 ? (
                        exercises.map((exercise, index) => (
                          <div key={index}>{exercise.lastUpdate || '-'}</div>
                        ))
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ClientWorkouts;