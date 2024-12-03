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

            console.log('Fetching appointments with token:', token);
            const response = await axios.get(
                'http://localhost:5002/api/auth/appointments',
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            console.log('Full response:', response);
            console.log('Response data:', response.data);
            console.log('Raw appointments:', response.data.appointments);

            if (response.data && response.data.appointments) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const futureAppointments = response.data.appointments.filter(apt => {
                    console.log('Processing appointment:', apt);
                    const [day, month, year] = apt.date.split('/');
                    const appointmentDate = new Date(year, month - 1, day);
                    const isFuture = appointmentDate >= today;
                    console.log('Appointment date:', appointmentDate, 'Is future:', isFuture);
                    return isFuture;
                }).sort((a, b) => {
                    const [dayA, monthA, yearA] = a.date.split('/');
                    const [dayB, monthB, yearB] = b.date.split('/');
                    const dateA = new Date(yearA, monthA - 1, dayA);
                    const dateB = new Date(yearB, monthB - 1, dayB);
                    
                    const dateCompare = dateA - dateB;
                    if (dateCompare !== 0) return dateCompare;
                    return a.time.localeCompare(b.time);
                });

                console.log('Setting appointments state with:', futureAppointments);
                setAppointments(futureAppointments);
            } else {
                console.log('No appointments found in response');
                setAppointments([]);
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
            const response = await axios.put(
                `http://localhost:5002/api/auth/appointments/${appointmentId}`,
                { status: newStatus },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                fetchAppointments();
                alert(`Appointment ${newStatus} successfully`);
            }
        } catch (error) {
            console.error('Error updating appointment status:', error);
            alert('Failed to update appointment status');
        }
    };

    useEffect(() => {
        console.log('Component mounted, fetching appointments...');
        fetchAppointments();
        const intervalId = setInterval(fetchAppointments, 30000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        console.log('Appointments state updated:', appointments);
    }, [appointments]);

    if (loading) {
        console.log('Rendering loading state');
        return <div className="trainer-schedule"><h2>Loading appointments...</h2></div>;
    }
    
    if (error) {
        console.log('Rendering error state:', error);
        return <div className="trainer-schedule"><h2>Error: {error}</h2></div>;
    }

    console.log('Rendering appointments table with:', appointments);

    return (
        <div >
            <h2 className="trainer-schedule-title">
                Pending Appointments
            </h2>
            
            <button 
                onClick={fetchAppointments} 
                className="refresh-button"
            >
                Refresh Appointments
            </button>

            <div className="table-container">
                {appointments.length === 0 ? (
                    <p className="no-appointments">
                        No pending appointments
                    </p>
                ) : (
                    <table className="appointments-table">
                        <thead>
                            <tr>
                                <th>Client Name</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appointment, index) => (
                                <tr key={appointment._id || index}>
                                    <td>{appointment.clientName}</td>
                                    <td>{appointment.date}</td>
                                    <td>{appointment.time}</td>
                                    <td>{appointment.status}</td>
                                    <td>
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
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default TrainerSchedule;