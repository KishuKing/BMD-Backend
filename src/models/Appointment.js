const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // Format: "2026-03-03"
  slot: { type: String, required: true }, // Format: "09:30"
  reason: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'scheduled', 'ongoing', 'completed', 'cancelled'], 
    default: 'pending' 
  }
}, { timestamps: true });

// Prevent double booking: A doctor cannot have two appointments at the same time on the same day
appointmentSchema.index({ doctor: 1, date: 1, slot: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', appointmentSchema);