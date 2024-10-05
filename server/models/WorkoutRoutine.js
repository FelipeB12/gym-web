const mongoose = require('mongoose');

const WorkoutRoutineSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
  },
  exercises: [{
    name: String,
    sets: Number,
    reps: Number,
    weight: Number,
  }],
});

module.exports = mongoose.model('WorkoutRoutine', WorkoutRoutineSchema);