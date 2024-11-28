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
                const sortedAppointments = response.data.appointments.sort((a, b) => {
                    const dateCompare = a.date.localeCompare(b.date);
                    if (dateCompare !== 0) return dateCompare;
                    return a.time.localeCompare(b.time);
                });
                
                setAppointments(sortedAppointments);
            } else {
                console.log('No appointments found in response');
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            console.error('Error response:', error.response);
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
            }
        } catch (error) {
            console.error('Error updating appointment status:', error);
            alert('Failed to update appointment status');
        }
    };

    const getStatusClass = (status) => {
        return `status-${status.toLowerCase()}`;
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
            <h2>Appointments Schedule</h2>
            <button onClick={fetchAppointments} className="refresh-button">
                Refresh Appointments
            </button>
            {appointments.length === 0 ? (
                <p style={{ color: 'white', textAlign: 'center' }}>No appointments scheduled</p>
            ) : (
                <table className="appointments-table">
                    <thead>
                        <tr>
                            <th>Client Name</th>
                            <th>Day</th>
                            <th>Time</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((appointment, index) => (
                            <tr key={index}>
                                <td>{appointment.clientName}</td>
                                <td>{appointment.date}</td>
                                <td>{appointment.time}</td>
                                <td className={getStatusClass(appointment.status)}>
                                    {appointment.status}
                                </td>
                                <td>
                                    {appointment.status === 'pending' && (
                                        <button
                                            onClick={() => handleStatusUpdate(appointment._id, 'confirmed')}
                                            className="confirm-button"
                                        >
                                            Confirm
                                        </button>
                                    )}
                                    {appointment.status !== 'cancelled' && (
                                        <button
                                            onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                                            className="cancel-button"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default TrainerSchedule;