const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Contact person name
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    shopName: { type: String, required: true },
    location: {
      address: String,
      city: String,
      coordinates: { lat: Number, lng: Number }
    },
    pharmacyCertificateUrl: { type: String }, // URL to uploaded document/image
    drugLicenseNumber: { type: String, required: true, unique: true }, // The "special register number"
    pharmacistDetails: {
      name: String,
      registrationNumber: String // Professional pharmacist ID
    },
    isVerified: { type: Boolean, default: false }, // Admin must approve before they can sell
    joinedAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('Vendor', vendorSchema);
