const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  personalInfo: {
    name: { type: String, required: true },
    age: { type: Number },
    gender: { type: String }
  },

  qualifications: [{ type: String }], 

  specializations: [{ type: String }], 
  
  experienceYears: { type: Number }, //
  consultationFee: { type: Number }, //

  affiliations: [{
    name: { type: String },
    location: { type: String }
  }],

  bio: { type: String },

}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);