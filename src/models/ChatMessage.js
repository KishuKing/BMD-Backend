const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  appointment: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Appointment', 
    required: true 
},
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
},
  message: { 
    type: String, 
    required: true 
},
}, { timestamps: true });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);