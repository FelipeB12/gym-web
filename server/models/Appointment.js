const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String,
    required: true,
    validate: {
      validator: function(date) {
        const [day, month, year] = date.split('/');
        const appointmentDate = new Date(year, month - 1, day);
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return appointmentDate >= now;
      },
      message: 'Appointment date must be in the future'
    }
  },
  time: {
    type: String,
    required: true,
    validate: {
      validator: function(time) {
        const [day, month, year] = this.date.split('/');
        const [hours, minutes] = time.split(':');
        const appointmentDateTime = new Date(year, month - 1, day, hours, minutes);
        return appointmentDateTime > new Date();
      },
      message: 'Appointment time must be in the future'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Appointment', AppointmentSchema); 