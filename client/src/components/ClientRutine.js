const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
    name: String,
    sets: Number,
    reps: Number,
    weight: Number,
    notes: String
});

const DaySchema = new mongoose.Schema({
    exercises: [ExerciseSchema],
    notes: String,
    isRestDay: { type: Boolean, default: false }
});

const RoutineSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    1: DaySchema,
    2: DaySchema,
    3: DaySchema,
    4: DaySchema,
    5: DaySchema,
    6: DaySchema,
    7: DaySchema
});

module.exports = mongoose.model('ClientRoutine', RoutineSchema);