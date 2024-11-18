const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  day: {
    type: Number,
    required: true,
    min: 1,
    max: 7
  },
  exercises: [{
    name: String,
    peso: String,
    rep: String,
    series: String,
    lastUpdate: String
  }],
  lastUpdate: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure unique combination of userId and day
WorkoutSchema.index({ userId: 1, day: 1 }, { unique: true });

module.exports = mongoose.model('Workout', WorkoutSchema); 