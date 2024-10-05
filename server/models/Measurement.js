const mongoose = require('mongoose');

const MeasurementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  weight: Number,
  bodyFat: Number,
  // Add more measurement fields as needed
});

module.exports = mongoose.model('Measurement', MeasurementSchema);