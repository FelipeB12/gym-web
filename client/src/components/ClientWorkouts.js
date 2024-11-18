import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Layout from './Layout';
import '../styles.css';

// Import exercise images (use the same imports as in ClientEditWorkout.js)
import backExercise1 from './img/bicep_1.png';
import backExercise2 from './img/bicep_2.png';
import chestExercise1 from './img/espalda_1.png';
import chestExercise2 from './img/espalda_2.png';        
import bicepsExercise1 from './img/hombro_1.png';
import bicepsExercise2 from './img/hombro_2.png';
import tricepsExercise1 from './img/pecho_1.png';
import tricepsExercise2 from './img/pecho_2.png';
import shouldersExercise1 from './img/pierna_1.png';
import shouldersExercise2 from './img/pierna_2.png';
import forearmsExercise1 from './img/tricep_1.png';
import forearmsExercise2 from './img/tricep_2.png';

const ClientWorkouts = () => {
  const [routine, setRoutine] = useState({
    "1": [], "2": [], "3": [], "4": [], "5": [], "6": [], "7": []
  });
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedExercise, setExpandedExercise] = useState(null);

  // Exercise image mapping
  const exerciseImages = {
    'Remo con Barra': chestExercise1,
    'Dominadas': chestExercise2,
    'Press de Banca': tricepsExercise1,
    'Aperturas': tricepsExercise2,
    'Sentadillas': shouldersExercise1,
    'Peso Muerto': shouldersExercise2,
    'Curl con Barra': backExercise1,
    'Curl con Mancuernas': backExercise2,
    'Extensiones': forearmsExercise1,
    'Press Francés': forearmsExercise2,
    'Press Militar': bicepsExercise1,
    'Elevaciones Laterales': bicepsExercise2,
  };

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
      '1': 'Día 1',
      '2': 'Día 2',
      '3': 'Día 3',
      '4': 'Día 4',
      '5': 'Día 5',
      '6': 'Día 6',
      '7': 'Día 7'
    };
    return days[day];
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Filter routine based on selected day
  const filteredRoutine = selectedDay 
    ? { [selectedDay]: routine[selectedDay] }
    : routine;

  const toggleExerciseImage = (exerciseName) => {
    setExpandedExercise(expandedExercise === exerciseName ? null : exerciseName);
  };

  return (
    <div className="workouts-container">
      <h2>Mi Rutina</h2>
      <div className="workout-nav">
        <div className="day-buttons">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <button
              key={day}
              className={`day-nav-btn ${selectedDay === String(day) ? 'active' : ''}`}
              onClick={() => setSelectedDay(selectedDay === String(day) ? null : String(day))}
            >
              {day}
            </button>
          ))}
        </div>
        <Link to="/ClientEditWorkout" className="edit-button">
          Editar
        </Link>
      </div>
      
      <div className="routine-grid">
        {Object.entries(filteredRoutine).map(([day, exercises]) => (
          <div key={day} className="day-card">
            {/*<h3>{getDayName(day)}</h3>*/}
            {exercises && exercises.length > 0 ? (
              <ul className="exercise-list">
                {exercises.map((exercise, index) => (
                  <li key={index} className="exercise-item">
                    <span 
                      className="exercise-name clickable"
                      onClick={() => toggleExerciseImage(exercise.name)}
                    >
                      {exercise.name}
                    </span>
                    {expandedExercise === exercise.name && exerciseImages[exercise.name] && (
                      <div className="exercise-image-container">
                        <img 
                          src={exerciseImages[exercise.name]} 
                          alt={exercise.name}
                          className="exercise-image"
                        />
                      </div>
                    )}
                    <div className="exercise-values">
                      <span className="exercise-value">
                        <label>Series:</label>
                        {exercise.sets}
                      </span>
                      <span className="exercise-value">
                        <label>Reps:</label>
                        {exercise.reps}
                      </span>
                      <span className="exercise-value">
                        <label>Peso:</label>
                        {exercise.weight}kg
                      </span>
                    </div>
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