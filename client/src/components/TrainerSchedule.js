import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';

const TrainerSchedule = () => {
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState('');

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/auth/trainer/appointments', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            console.log('Trainer appointments:', response.data);
            setAppointments(response.data.appointments);
        } catch (err) {
            console.error('Error fetching trainer appointments:', err);
            setError('Failed to load appointments');
        }
    };

    const handleAppointmentStatus = async (appointmentId, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/auth/trainer/appointments/${appointmentId}`, 
                { status },
                { headers: { Authorization: `Bearer ${token}` }}
            );
            fetchAppointments(); // Refresh the list
            alert(`Appointment ${status} successfully`);
        } catch (err) {
            console.error('Error updating appointment:', err);
            alert('Failed to update appointment status');
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    return (
        <div className="schedule-container common-form">
            <h1 className="common-title">Gestión de Citas</h1>
            
            {error && <p className="error-message">{error}</p>}
            
            <div className="appointments-list">
                {appointments.length === 0 ? (
                    <p>No hay citas pendientes</p>
                ) : (
                    appointments.map((appointment, index) => (
                        <div key={index} className="appointment-card">
                            <div className="appointment-info">
                                <p><strong>Cliente:</strong> {appointment.userName}</p>
                                <p><strong>Fecha:</strong> {appointment.date}</p>
                                <p><strong>Hora:</strong> {appointment.time}</p>
                                <p><strong>Estado:</strong> {appointment.status}</p>
                            </div>
                            
                            {appointment.status === 'pending' && (
                                <div className="appointment-actions">
                                    <button
                                        onClick={() => handleAppointmentStatus(appointment._id, 'confirmed')}
                                        className="confirm-button"
                                    >
                                        Confirmar
                                    </button>
                                    <button
                                        onClick={() => handleAppointmentStatus(appointment._id, 'cancelled')}
                                        className="cancel-button"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TrainerSchedule;