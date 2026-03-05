const mongoose = require('mongoose');

const weeklyAvailabilitySchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  schedule: {
    Monday:    { enabled: { type: Boolean, default: false }, start: String, end: String, slotDuration: Number },
    Tuesday:   { enabled: { type: Boolean, default: false }, start: String, end: String, slotDuration: Number },
    Wednesday: { enabled: { type: Boolean, default: false }, start: String, end: String, slotDuration: Number },
    Thursday:  { enabled: { type: Boolean, default: false }, start: String, end: String, slotDuration: Number },
    Friday:    { enabled: { type: Boolean, default: false }, start: String, end: String, slotDuration: Number },
    Saturday:  { enabled: { type: Boolean, default: false }, start: String, end: String, slotDuration: Number },
    Sunday:    { enabled: { type: Boolean, default: false }, start: String, end: String, slotDuration: Number },
  }
}, { timestamps: true });

module.exports = mongoose.model('WeeklyAvailability', weeklyAvailabilitySchema);