import React, { useState } from 'react';


const ClientAppointment = () => {
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedHour, setSelectedHour] = useState('');
  const [nextBooking, setNextBooking] = useState(''); // State to hold the next booking

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const hours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  const handleBook = () => {
    if (selectedDay && selectedHour) {
      const bookingDate = `${selectedDay} ${selectedHour}`;
      setNextBooking(bookingDate); // Set the next booking
      setSelectedDay(''); // Reset selection
      setSelectedHour(''); // Reset selection
    }
  };

  return (
    <div className="appointment-container">
      <h1>Book Appointment</h1>
      <div className="appointment-selection">
        <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} className="appointment-select">
          <option value="" disabled>Select Day</option>
          {days.map((day, index) => (
            <option key={index} value={day}>{day}</option>
          ))}
        </select>
        <select value={selectedHour} onChange={(e) => setSelectedHour(e.target.value)} className="appointment-select">
          <option value="" disabled>Select Hour</option>
          {hours.map((hour, index) => (
            <option key={index} value={hour}>{hour}</option>
          ))}
        </select>
        <button onClick={handleBook} className="book-button">BOOK</button>
      </div>
      {nextBooking && (
        <div className="next-booking">
          <h2>Next Booking</h2>
          <div className="booking-details">
            <span>{nextBooking}</span>
            <button className="cancel-button">X</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientAppointment;
