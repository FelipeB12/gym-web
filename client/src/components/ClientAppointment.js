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
            if (!token) {
                setError('No authentication token found');
                return;
            }

            console.log('Fetching appointments with token:', token);
            const response = await axios.get(
                'https://gymapp.site/api/auth/appointments',
                {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Appointments response:', response.data);
            if (response.data && response.data.appointments) {
                // Filter only future appointments
                const now = new Date();
                const futureAppointments = response.data.appointments.filter(apt => {
                    const [day, month, year] = apt.date.split('/');
                    const [hours, minutes] = apt.time.split(':');
                    const appointmentDate = new Date(year, month - 1, day, hours, minutes);
                    return appointmentDate > now;
                });
                setAppointments(futureAppointments);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setError(error.response?.data?.msg || 'Failed to load appointments');
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleBook = async () => {
        if (selectedDay && selectedHour) {
            try {
                // Check for existing future appointments
                const [day, month, year] = selectedDay.split('/');
                const [hours, minutes] = selectedHour.split(':');
                const selectedDate = new Date(year, month - 1, day, hours, minutes);
                const now = new Date();

                if (selectedDate <= now) {
                    alert('Cannot book appointments in the past');
                    return;
                }

                const hasFutureAppointment = appointments.length > 0;
                if (hasFutureAppointment) {
                    alert('You already have a future appointment. Please cancel it before booking a new one.');
                    return;
                }

                const token = localStorage.getItem('token');
                const response = await axios.post(
                    'https://gymapp.site/api/auth/appointments',
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
        if (window.confirm('¿Estás seguro de que quieres eliminar esta cita?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.delete(
                    `https://gymapp.site/api/auth/appointments/${appointmentId}`,
                    {
                        headers: { 
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.data.success) {
                    fetchAppointments(); // Refresh appointments after deletion
                    alert('Cita eliminada con éxito');
                }
            } catch (error) {
                console.error('Error deleting appointment:', error);
                alert(error.response?.data?.msg || 'Error al eliminar la cita');
            }
        }
    };

    return (
        <div className="appointment-container common-form">
            <h1 className="common-title">Reservar una Cita</h1>
            
            <div className="appointment-selection">
                <select 
                    value={selectedDay} 
                    onChange={(e) => setSelectedDay(e.target.value)} 
                    className="appointment-select"
                >
                    <option value="" disabled>Seleccionar Fecha</option>
                    {days.map((day, index) => (
                        <option key={index} value={day}>{day}</option>
                    ))}
                </select>
                <select 
                    value={selectedHour} 
                    onChange={(e) => setSelectedHour(e.target.value)} 
                    className="appointment-select"
                >
                    <option value="" disabled>Seleccionar Hora</option>
                    {hours.map((hour, index) => (
                        <option key={index} value={hour}>{hour}</option>
                    ))}
                </select>
                <button onClick={handleBook} className="book-button">RESERVAR</button>
            </div>

            <div className="current-appointments">
                <h2>Tus Citas</h2>
                {error && <p className="error-message">{error}</p>}
                {appointments.length === 0 ? (
                    <p>No hay citas programadas</p>
                ) : (
                    appointments.map((appointment, index) => (
                        <div key={index} className="appointment-card">
                            <div className="appointment-detail">
                                <span className="detail-label">Fecha</span>
                                <span className="detail-value">{appointment.date}</span>
                            </div>
                            <div className="appointment-detail">
                                <span className="detail-label">Hora</span>
                                <span className="detail-value">{appointment.time}</span>
                            </div>
                            <div className="appointment-detail">
                                <span className="detail-label">Estado</span>
                                <span className="detail-value">{appointment.status}</span>
                            </div>
                            <button
                                onClick={() => handleDelete(appointment._id)}
                                className="delete-button"
                                disabled={appointment.status === 'confirmed'}
                            >
                                Eliminar
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ClientAppointment;
