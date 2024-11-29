import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClientAppointment = () => {
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedHour, setSelectedHour] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState('');
    
    // Generate next 7 days for the dropdown
    const generateDays = () => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            days.push(date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }));
        }
        return days;
    };

    const days = generateDays();
    const hours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                'http://localhost:5002/api/auth/appointments',
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data && response.data.appointments) {
                setAppointments(response.data.appointments);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setError('Failed to load appointments');
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleBook = async () => {
        if (selectedDay && selectedHour) {
            try {
                const hasActiveAppointment = appointments.some(apt => 
                    apt.status !== 'completed' && apt.status !== 'cancelled'
                );

                if (hasActiveAppointment) {
                    alert('You already have an active appointment. Please cancel it before booking a new one.');
                    return;
                }

                const token = localStorage.getItem('token');
                const response = await axios.post(
                    'http://localhost:5002/api/auth/appointments',
                    {
                        date: selectedDay,
                        time: selectedHour
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                if (response.data.appointment) {
                    fetchAppointments();
                    setSelectedDay('');
                    setSelectedHour('');
                    alert('Appointment booked successfully!');
                }
            } catch (error) {
                console.error('Error booking appointment:', error);
                alert(error.response?.data?.msg || 'Failed to book appointment');
            }
        }
    };

    const handleDelete = async (appointmentId) => {
        if (window.confirm('Are you sure you want to delete this appointment?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.delete(
                    `http://localhost:5002/api/auth/appointments/${appointmentId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                if (response.data.success) {
                    fetchAppointments(); // Refresh appointments after deletion
                    alert('Appointment deleted successfully!');
                }
            } catch (error) {
                console.error('Error deleting appointment:', error);
                alert('Failed to delete appointment');
            }
        }
    };

    return (
        <div className="appointment-container common-form">
            <h1 className="common-title">Book an Appointment</h1>
            
            <div className="appointment-selection">
                <select 
                    value={selectedDay} 
                    onChange={(e) => setSelectedDay(e.target.value)} 
                    className="appointment-select"
                >
                    <option value="" disabled>Select Date</option>
                    {days.map((day, index) => (
                        <option key={index} value={day}>{day}</option>
                    ))}
                </select>
                <select 
                    value={selectedHour} 
                    onChange={(e) => setSelectedHour(e.target.value)} 
                    className="appointment-select"
                >
                    <option value="" disabled>Select Hour</option>
                    {hours.map((hour, index) => (
                        <option key={index} value={hour}>{hour}</option>
                    ))}
                </select>
                <button onClick={handleBook} className="book-button">BOOK</button>
            </div>

            <div className="current-appointments">
                <h2>Your Appointments</h2>
                {error && <p className="error-message">{error}</p>}
                {appointments.length === 0 ? (
                    <p>No appointments scheduled</p>
                ) : (
                    <table className="appointments-table">
                        <thead>
                            <tr>
                                <th>Day</th>
                                <th>Time</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appointment, index) => (
                                <tr key={index}>
                                    <td>{appointment.date}</td>
                                    <td>{appointment.time}</td>
                                    <td>{appointment.status}</td>
                                    <td>
                                        <button
                                            onClick={() => handleDelete(appointment._id)}
                                            className="delete-button"
                                            disabled={appointment.status === 'confirmed'}
                                        >
                                            Delete
                                        </button>
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

export default ClientAppointment;
