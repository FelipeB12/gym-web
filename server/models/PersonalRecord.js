const mongoose = require('mongoose');

const PersonalRecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  exercise: {
    type: String,
    required: true,
  },
  weight: Number,
  reps: Number,
  date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('PersonalRecord', PersonalRecordSchema);