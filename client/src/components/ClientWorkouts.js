import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
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
  const [editingExercise, setEditingExercise] = useState(null);
  const [updatedValues, setUpdatedValues] = useState({});
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

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

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleUpdateExercise = async (day, exerciseIndex, exerciseName) => {
    const exercise = routine[day][exerciseIndex];
    setEditingExercise({
      day,
      index: exerciseIndex,
      name: exerciseName,
      values: {
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight
      }
    });
    setUpdatedValues({
      sets: exercise.sets,
      reps: exercise.reps,
      weight: exercise.weight
    });
  };

  const handleSaveUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const updatedRoutine = { ...routine };
      const exercise = updatedRoutine[editingExercise.day][editingExercise.index];
      
      // Update exercise values and add timestamp
      exercise.sets = updatedValues.sets;
      exercise.reps = updatedValues.reps;
      exercise.weight = updatedValues.weight;
      exercise.lastUpdated = new Date().toISOString();

      const response = await axios.post(
        'https://gymapp.site/api/workouts',
        { [editingExercise.day]: updatedRoutine[editingExercise.day] },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        setRoutine(updatedRoutine);
        setEditingExercise(null);
      }
    } catch (error) {
      console.error('Error updating exercise:', error);
      alert('Error al actualizar el ejercicio');
    }
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(0);
  };

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderTimer = () => (
    <div className="timer-container">
      <div className="timer-display">
        {formatTime(time)}
      </div>
      <div className="timer-controls">
        <button className="timer-button" onClick={isRunning ? pauseTimer : startTimer}>
          {isRunning ? '⏸️' : '▶️'}
        </button>
        <button className="timer-button reset" onClick={resetTimer}>
          ↺
        </button>
      </div>
    </div>
  );

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
      {renderTimer()}
      <h5>Mi Rutina</h5>
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
      </div>
      <Link to="/ClientEditWorkout" className="edit-button">
        Editar rutinas
      </Link>
      
      <div className="routine-grid">
        {Object.entries(filteredRoutine).map(([day, exercises]) => (
          <div 
            key={day} 
            className={`day-card ${selectedDay === day ? 'visible' : ''}`}
          >
            <h3>Día {day}</h3>
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
                    
                    {editingExercise?.day === day && editingExercise?.index === index ? (
                      <div className="exercise-edit-form">
                        <div className="exercise-values editing">
                          <span className="exercise-value">
                            <label>Series:</label>
                            <input
                              type="number"
                              value={updatedValues.sets}
                              onChange={(e) => setUpdatedValues({
                                ...updatedValues,
                                sets: parseInt(e.target.value) || 0
                              })}
                            />
                          </span>
                          <span className="exercise-value">
                            <label>Reps:</label>
                            <input
                              type="number"
                              value={updatedValues.reps}
                              onChange={(e) => setUpdatedValues({
                                ...updatedValues,
                                reps: parseInt(e.target.value) || 0
                              })}
                            />
                          </span>
                          <span className="exercise-value">
                            <label>Peso:</label>
                            <input
                              type="number"
                              value={updatedValues.weight}
                              onChange={(e) => setUpdatedValues({
                                ...updatedValues,
                                weight: parseInt(e.target.value) || 0
                              })}
                            />
                          </span>
                        </div>
                        <div className="edit-actions">
                          <button onClick={handleSaveUpdate} className="save-btn">
                            Guardar
                          </button>
                          <button 
                            onClick={() => setEditingExercise(null)} 
                            className="cancel-btn"
                          >
                            Cancelar
                          </button>
                        </div>
                        {exercise.lastUpdated && (
                          <div className="last-updated">
                            Última actualización: {new Date(exercise.lastUpdated).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ) : (
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
                        {exercise.lastUpdated && (
                          <div className="last-updated">
                            Última actualización: {new Date(exercise.lastUpdated).toLocaleDateString()}
                          </div>
                        )}
                        <button 
                          className="update-btn"
                          onClick={() => handleUpdateExercise(day, index, exercise.name)}
                        >
                          Actualizar
                        </button>
                      </div>
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