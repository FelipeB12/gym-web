const mongoose = require('mongoose');

const MeasurementSchema = new mongoose.Schema({
    date: { type: String, required: true },
    values: {
        peso: { type: Number, default: 0 },
        grasaCorporal: { type: Number, default: 0 },
        pecho: { type: Number, default: 0 },
        bicepDerecho: { type: Number, default: 0 },
        bicepIzquierdo: { type: Number, default: 0 },
        espalda: { type: Number, default: 0 },
        cintura: { type: Number, default: 0 },
        gluteos: { type: Number, default: 0 },
        musloDerecho: { type: Number, default: 0 },
        musloIzquierdo: { type: Number, default: 0 },
        gemeloDerecho: { type: Number, default: 0 },
        gemeloIzquierdo: { type: Number, default: 0 }
    }
});

const RoutineSchema = new mongoose.Schema({
    date: String,
    values: {
        "1": [mongoose.Schema.Types.Mixed],
        "2": [mongoose.Schema.Types.Mixed],
        "3": [mongoose.Schema.Types.Mixed],
        "4": [mongoose.Schema.Types.Mixed],
        "5": [mongoose.Schema.Types.Mixed],
        "6": [mongoose.Schema.Types.Mixed],
        "7": [mongoose.Schema.Types.Mixed]
    }
});

const AppointmentSchema = new mongoose.Schema({
    date: String,
    time: String,
    clientId: String,
    clientName: String,
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    }
});

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'client'
    },
    gymType: {
        type: String,
        default: 'test-gym'
    },
    membership: {
        type: Number,
        default: 0
    },
    gender: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    objective: {
        type: String,
        required: true
    },
    medicalCondition: {
        type: String,
        default: ''
    },
    measurements: [MeasurementSchema],
    routine: [RoutineSchema],
    appointments: [AppointmentSchema]
});

module.exports = mongoose.model('User', UserSchema);
