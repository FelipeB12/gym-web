import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Layout from './Layout';
import '../styles.css';

const ClientWorkouts = () => {
  const [routine, setRoutine] = useState({
    "1": [], "2": [], "3": [], "4": [], "5": [], "6": [], "7": []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get('http://localhost:5002/api/workouts', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data && response.data.routine) {
          setRoutine(response.data.routine);
        }
      } catch (err) {
        console.error('Error fetching routine:', err);
        setError('Error loading workout routine');
      } finally {
        setLoading(false);
      }
    };

    fetchRoutine();
  }, []);

  const getDayName = (day) => {
    const days = {
      '1': 'Lunes',
      '2': 'Martes',
      '3': 'Miércoles',
      '4': 'Jueves',
      '5': 'Viernes',
      '6': 'Sábado',
      '7': 'Domingo'
    };
    return days[day];
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="workouts-container">
      <h2>Mi Rutina</h2>
      <Link to="/ClientEditWorkout" className="edit-button">
        Editar
      </Link>
      
      <div className="routine-grid">
        {Object.entries(routine).map(([day, exercises]) => (
          <div key={day} className="day-card">
            <h3>{getDayName(day)}</h3>
            {exercises && exercises.length > 0 ? (
              <ul className="exercise-list">
                {exercises.map((exercise, index) => (
                  <li key={index} className="exercise-item">
                    <span className="exercise-name">{exercise.name}</span>
                    {exercise.sets > 0 && (
                      <span className="exercise-details">
                        {exercise.sets}x{exercise.reps} @ {exercise.weight}kg
                      </span>
                    )}
                    {exercise.notes && (
                      <span className="exercise-notes">{exercise.notes}</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rest-day">Día de descanso</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientWorkouts;