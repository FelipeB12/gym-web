import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles.css';

const TrainerSchedule = () => {
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                'http://localhost:5002/api/auth/trainer/appointments',
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            // Filter out past appointments
            const now = new Date();
            const futureAppointments = response.data.appointments.filter(apt => {
                const [day, month, year] = apt.date.split('/');
                const [hours, minutes] = apt.time.split(':');
                const appointmentDate = new Date(year, month - 1, day, hours, minutes);
                return appointmentDate > now;
            });
            
            setAppointments(futureAppointments);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching trainer appointments:', err);
            setError('Failed to load appointments');
            setLoading(false);
        }
    };

    const handleAppointmentStatus = async (appointmentId, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:5002/api/auth/trainer/appointments/${appointmentId}`,
                { status },
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Refresh appointments after update
            fetchAppointments();
            alert(`Appointment ${status} successfully`);
        } catch (err) {
            console.error('Error updating appointment:', err);
            setError('Failed to update appointment');
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    if (loading) return <div className="loading">Cargando...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="schedule-container">
            <h2>Agenda</h2>
            
            <div className="appointments-list">
                {appointments.length === 0 ? (
                    <p className="no-appointments">No citas pendientes</p>
                ) : (
                    appointments.map((appointment) => (
                        <div key={appointment._id} className="appointment-card">
                            <div className="appointment-info">
                                <h3>{appointment.userName}</h3>
                                <p><strong>Fecha: </strong> {appointment.date}</p>
                                <p><strong>Hora: </strong> {appointment.time}</p>
                                <p><strong>Estado: </strong> 
                                    <span className={`status-${appointment.status}`}>
                                        {appointment.status}
                                    </span>
                                </p>
                            </div>
                            
                            {appointment.status === 'pending' && (
                                <div className="appointment-actions">
                                    <button
                                        onClick={() => handleAppointmentStatus(appointment._id, 'confirmed')}
                                        className="confirm-button"
                                    >
                                        Aceptar
                                    </button>
                                    <button
                                        onClick={() => handleAppointmentStatus(appointment._id, 'cancelled')}
                                        className="cancel-button"
                                    >
                                        Rechazar
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