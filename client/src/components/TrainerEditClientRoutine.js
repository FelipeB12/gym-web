import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
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

const TrainerEditClientRoutine = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exerciseDetails, setExerciseDetails] = useState({});
  const [currentRoutine, setCurrentRoutine] = useState({});

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
    const fetchClientData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5002/api/auth/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setClient(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching client data: ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };

    fetchClientData();
  }, [userId]);

  useEffect(() => {
    if (selectedMuscleGroup && selectedMuscleGroup !== 'descanso') {
      setExercises(exercisesByMuscleGroup[selectedMuscleGroup] || []);
    } else {
      setExercises([]);
    }
  }, [selectedMuscleGroup]);

  useEffect(() => {
    const fetchClientRoutine = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found');
          return;
        }

        console.log('Fetching routine for user:', userId);
        const response = await axios.get(`http://localhost:5002/api/workouts/client/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Received response:', response.data);
        setCurrentRoutine(response.data.routine);
      } catch (err) {
        console.error('Full error:', err);
        setError('Error fetching routine: ' + (err.response?.data?.message || err.message));
      }
    };

    if (userId) {
      fetchClientRoutine();
    }
  }, [userId]);

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    
    const existingExercises = currentRoutine[day] || [];
    setSelectedExercises(existingExercises.map(ex => ({
      id: ex.id,
      name: ex.name,
      src: exercisesByMuscleGroup[ex.id.split('1')[0]]?.[0]?.src
    })));

    const details = {};
    existingExercises.forEach(ex => {
      details[ex.id] = {
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight
      };
    });
    setExerciseDetails(details);
  };

  const handleExerciseSelect = (exercise) => {
    setSelectedExercises(prev => {
      const isSelected = prev.find(ex => ex.id === exercise.id);
      if (isSelected) {
        setExerciseDetails(current => {
          const { [exercise.id]: _, ...rest } = current;
          return rest;
        });
        return prev.filter(ex => ex.id !== exercise.id);
      } else {
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
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      // Format exercises with their details
      const exercisesWithDetails = selectedExercises.map(exercise => ({
        name: exercise.name,
        id: exercise.id,
        sets: exerciseDetails[exercise.id]?.sets || 0,
        reps: exerciseDetails[exercise.id]?.reps || 0,
        weight: exerciseDetails[exercise.id]?.weight || 0
      }));

      // Prepare the data to be sent
      const routineData = {
        day: selectedDay.toString(),
        exercises: exercisesWithDetails
      };

      // Send the update request
      const response = await axios.post(
        `http://localhost:5002/api/workouts/client/${userId}`,
        routineData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        alert('Rutina guardada con éxito');
        // Redirect to TrainerDashboard after successful save
        navigate('/TrainerDashboard/search');
      }
    } catch (err) {
      console.error('Error saving routine:', err);
      setError('Error saving routine: ' + (err.response?.data?.msg || err.message));
    }
  };

  const renderRoutineSummary = () => (
    <div className="routine-summary">
      <h3>Current Routine</h3>
      {Object.entries(currentRoutine).map(([day, exercises]) => (
        exercises.length > 0 && (
          <div key={day} className="day-summary">
            <h4>Day {day}</h4>
            <ul>
              {exercises.map((ex, index) => (
                <li key={index}>
                  {ex.name} - {ex.sets}x{ex.reps} ({ex.weight}kg)
                </li>
              ))}
            </ul>
          </div>
        )
      ))}
    </div>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!client) return <div>Client not found</div>;

  return (
    <div className="edit-workout-container">
      <div className="edit-header">
        <Link to="/TrainerDashboard/search" className="back-button">
          ← Volver
        </Link>
        <h2>Editar Rutina para {client.name}</h2>
      </div>

      <div className="routine-layout">
        <div className="current-routine">
          {renderRoutineSummary()}
        </div>

        <div className="edit-section">
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
            Ejercicios seleccionados: {selectedExercises.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrainerEditClientRoutine;
