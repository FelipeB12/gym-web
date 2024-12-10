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
            
            setAppointments(response.data.appointments);
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

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="schedule-container">
            <h2>Appointments Management</h2>
            
            <div className="appointments-list">
                {appointments.length === 0 ? (
                    <p className="no-appointments">No pending appointments</p>
                ) : (
                    appointments.map((appointment) => (
                        <div key={appointment._id} className="appointment-card">
                            <div className="appointment-info">
                                <h3>{appointment.userName}</h3>
                                <p><strong>Date:</strong> {appointment.date}</p>
                                <p><strong>Time:</strong> {appointment.time}</p>
                                <p><strong>Status:</strong> 
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
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleAppointmentStatus(appointment._id, 'cancelled')}
                                        className="cancel-button"
                                    >
                                        Reject
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