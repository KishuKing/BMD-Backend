const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    shopName: { type: String, required: true },
    location: {
      address: String,
      city: String,
      coordinates: { lat: Number, lng: Number }
    },
    drugLicenseNumber: { type: String, required: true, unique: true },
    pharmacistDetails: {
      name: String,
      registrationNumber: String
    },
    verified: {
      type: Boolean,
      default: false
    },
    certificateImage: {
      type: String,
    },
    joinedAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('Vendor', vendorSchema);
