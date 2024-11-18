import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Layout from './Layout';
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

const ClientEditWorkout = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const userName = localStorage.getItem('userName') || 'User';
  const navigate = useNavigate();

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

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }
      setIsLoading(false);
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
    setSelectedExercises(prev => 
      prev.find(ex => ex.id === exercise.id)
        ? prev.filter(ex => ex.id !== exercise.id)
        : [...prev, exercise]
    );
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

      // Restructure data to match the ClientRoutine schema
      const workoutData = {
        [selectedDay]: {
          exercises: selectedMuscleGroup === 'descanso' 
            ? []
            : selectedExercises.map(exercise => ({
                name: exercise.name,
                sets: 0,  // Changed from series
                reps: 0,  // Changed from rep
                weight: 0, // Changed from peso
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
          // Add timeout and validate status for better error handling
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
            onClick={() => handleExerciseSelect(exercise)}
          >
            <img src={exercise.src} alt={exercise.name} />
            <span>{exercise.name}</span>
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
