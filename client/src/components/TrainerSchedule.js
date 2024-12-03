import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TrainerSchedule = () => {
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No authentication token found');
                setLoading(false);
                return;
            }

            const response = await axios.get(
                'http://localhost:5002/api/auth/appointments',
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data && response.data.appointments) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const futureAppointments = response.data.appointments.filter(apt => {
                    const [day, month, year] = apt.date.split('/');
                    const appointmentDate = new Date(year, month - 1, day);
                    return appointmentDate >= today;
                }).sort((a, b) => {
                    const [dayA, monthA, yearA] = a.date.split('/');
                    const [dayB, monthB, yearB] = b.date.split('/');
                    const dateA = new Date(yearA, monthA - 1, dayA);
                    const dateB = new Date(yearB, monthB - 1, dayB);
                    
                    const dateCompare = dateA - dateB;
                    if (dateCompare !== 0) return dateCompare;
                    return a.time.localeCompare(b.time);
                });

                setAppointments(futureAppointments);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setError('Failed to load appointments: ' + (error.response?.data?.msg || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (appointmentId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:5002/api/auth/appointments/${appointmentId}`,
                { status: newStatus },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            fetchAppointments();
        } catch (error) {
            console.error('Error updating appointment status:', error);
            alert('Failed to update appointment status');
        }
    };

    useEffect(() => {
        fetchAppointments();
        const intervalId = setInterval(fetchAppointments, 30000);
        return () => clearInterval(intervalId);
    }, []);

    if (loading) return <div className="trainer-schedule"><h2>Loading appointments...</h2></div>;
    if (error) return <div className="trainer-schedule"><h2>Error: {error}</h2></div>;

    return (
        <div className="trainer-schedule">
            <h2 className="trainer-schedule-title">
                Pending Appointments
            </h2>
            
            <button 
                onClick={fetchAppointments} 
                className="refresh-button"
            >
                Refresh Appointments
            </button>

            <div className="appointments-container">
                {appointments.length === 0 ? (
                    <p className="no-appointments">
                        No pending appointments
                    </p>
                ) : (
                    appointments.map((appointment, index) => (
                        <div key={appointment._id || index} className="appointment-card">
                            <div className="appointment-detail">
                                <span className="detail-label">Client:</span>
                                <span className="detail-value">{appointment.clientName}</span>
                            </div>
                            <div className="appointment-detail">
                                <span className="detail-label">Date:</span>
                                <span className="detail-value">{appointment.date}</span>
                            </div>
                            <div className="appointment-detail">
                                <span className="detail-label">Time:</span>
                                <span className="detail-value">{appointment.time}</span>
                            </div>
                            <div className="appointment-detail">
                                <span className="detail-label">Status:</span>
                                <span className="detail-value">{appointment.status}</span>
                            </div>
                            {appointment.status === 'pending' && (
                                <div className="action-buttons">
                                    <button
                                        onClick={() => handleStatusUpdate(appointment._id, 'confirmed')}
                                        className="accept-button"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                                        className="reject-button"
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