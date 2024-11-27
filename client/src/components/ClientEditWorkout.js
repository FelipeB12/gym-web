import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles.css';

// Import exercise images
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
// ... import all other exercise images

// Move exercisesByMuscleGroup outside the component
const exercisesByMuscleGroup = {
  espalda: [
    { id: 'espalda1', name: 'Remo con Barra', src: chestExercise1 },
    { id: 'espalda2', name: 'Dominadas', src: chestExercise2 },
  ],
  pecho: [
    { id: 'pecho1', name: 'Press de Banca', src: tricepsExercise1 },
    { id: 'pecho2', name: 'Aperturas', src: tricepsExercise2 },
  ],
  pierna: [
    { id: 'pierna1', name: 'Sentadillas', src: shouldersExercise1 },
    { id: 'pierna2', name: 'Peso Muerto', src: shouldersExercise2 },
  ],
  biceps: [
    { id: 'biceps1', name: 'Curl con Barra', src: backExercise1 },
    { id: 'biceps2', name: 'Curl con Mancuernas', src: backExercise2 },
  ],
  triceps: [
    { id: 'triceps1', name: 'Extensiones', src: forearmsExercise1 },
    { id: 'triceps2', name: 'Press Francés', src: forearmsExercise2 },
  ],
  hombros: [
    { id: 'hombros1', name: 'Press Militar', src: bicepsExercise1 },
    { id: 'hombros2', name: 'Elevaciones Laterales', src: bicepsExercise2 },
  ],
};

const ClientEditWorkout = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [exercises, setExercises] = useState([]);
  const navigate = useNavigate();
  const [exerciseDetails, setExerciseDetails] = useState({});

  const muscleGroups = [
    { value: '', label: 'Elige el grupo muscular que quieres entrenar' },
    { value: 'espalda', label: 'Espalda' },
    { value: 'pecho', label: 'Pecho' },
    { value: 'pierna', label: 'Pierna' },
    { value: 'biceps', label: 'Bíceps' },
    { value: 'triceps', label: 'Tríceps' },
    { value: 'hombros', label: 'Hombros' },
    { value: 'descanso', label: 'Descanso' }
  ];

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (selectedMuscleGroup && selectedMuscleGroup !== 'descanso') {
      setExercises(exercisesByMuscleGroup[selectedMuscleGroup] || []);
    } else {
      setExercises([]);
    }
  }, [selectedMuscleGroup]);

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    setSelectedExercises([]); // Clear selections when changing day
  };

  const handleExerciseSelect = (exercise) => {
    setSelectedExercises(prev => {
      const isSelected = prev.find(ex => ex.id === exercise.id);
      if (isSelected) {
        // Remove exercise and its details
        setExerciseDetails(current => {
          const { [exercise.id]: _, ...rest } = current;
          return rest;
        });
        return prev.filter(ex => ex.id !== exercise.id);
      } else {
        // Add exercise with default details
        setExerciseDetails(current => ({
          ...current,
          [exercise.id]: { sets: 0, reps: 0, weight: 0 }
        }));
        return [...prev, exercise];
      }
    });
  };

  const handleDetailsChange = (exerciseId, field, value) => {
    const numValue = parseInt(value) || 0;
    setExerciseDetails(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [field]: numValue
      }
    }));
  };

  const handleSave = async () => {
    if (!selectedDay) {
      alert('Por favor selecciona un día');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      // Restructure data with exercise details
      const workoutData = {
        [selectedDay]: {
          exercises: selectedMuscleGroup === 'descanso' 
            ? []
            : selectedExercises.map(exercise => ({
                name: exercise.name,
                sets: exerciseDetails[exercise.id]?.sets || 0,
                reps: exerciseDetails[exercise.id]?.reps || 0,
                weight: exerciseDetails[exercise.id]?.weight || 0,
                notes: ''
              })),
          notes: '',
          isRestDay: selectedMuscleGroup === 'descanso'
        }
      };

      const response = await axios.post(
        'http://localhost:5002/api/workouts',
        workoutData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 5000,
          validateStatus: (status) => status >= 200 && status < 300
        }
      );

      if (response.data) {
        alert('Rutina guardada correctamente!');
        navigate('/ClientWorkouts');
      }
    } catch (error) {
      console.error('Error details:', error.response || error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Error al guardar la rutina';
      alert(errorMessage);
    }
  };

  return (
    <div className="edit-workout-container">
      <div className="edit-header">
        <Link to="/ClientWorkouts" className="back-button">
          ← Volver
        </Link>
        <h2>Editar Rutina</h2>
      </div>

      <div className="day-selector">
        {[1, 2, 3, 4, 5, 6, 7].map(day => (
          <button
            key={day}
            className={`day-btn ${selectedDay === day ? 'selected' : ''}`}
            onClick={() => handleDaySelect(day)}
          >
            {day}
          </button>
        ))}
      </div>

      <select
        value={selectedMuscleGroup}
        onChange={(e) => setSelectedMuscleGroup(e.target.value)}
        className="muscle-group-select"
      >
        {muscleGroups.map(group => (
          <option key={group.value} value={group.value}>
            {group.label}
          </option>
        ))}
      </select>

      <div className="exercise-grid">
        {exercises.map(exercise => (
          <div
            key={exercise.id}
            className={`exercise-card ${selectedExercises.find(ex => ex.id === exercise.id) ? 'selected' : ''}`}
          >
            <div 
              className="exercise-image-container"
              onClick={() => handleExerciseSelect(exercise)}
            >
              <img src={exercise.src} alt={exercise.name} />
              <span className="exercise-name">{exercise.name}</span>
            </div>
            
            {selectedExercises.find(ex => ex.id === exercise.id) && (
              <div className="exercise-details-inputs">
                <div className="input-group">
                  <label>Series:</label>
                  <input
                    type="number"
                    min="0"
                    value={exerciseDetails[exercise.id]?.sets || 0}
                    onChange={(e) => handleDetailsChange(exercise.id, 'sets', e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>Reps:</label>
                  <input
                    type="number"
                    min="0"
                    value={exerciseDetails[exercise.id]?.reps || 0}
                    onChange={(e) => handleDetailsChange(exercise.id, 'reps', e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>Peso (kg):</label>
                  <input
                    type="number"
                    min="0"
                    value={exerciseDetails[exercise.id]?.weight || 0}
                    onChange={(e) => handleDetailsChange(exercise.id, 'weight', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button 
        className="save-button"
        onClick={handleSave}
        disabled={!selectedDay}
      >
        Guardar
      </button>
      
      <p className="selection-count">
        Cantidad de imágenes seleccionadas: {selectedExercises.length}
      </p>

      
    </div>
  );
};

export default ClientEditWorkout;
