const express = require("express");
const router = express.Router();
const upload = require('../middleware/cloudinaryConfig');
const { protect } = require('../middleware/authMiddleware');
const { uploadPrescription, getPrescriptions } = require('../controllers/prescriptionController');

// Endpoint: POST /api/prescriptions/upload
// Uses 'protect' middleware for user authentication
// Uses 'upload.single('pdf')' to handle the file upload from the 'pdf' field
router.post('/upload', protect, upload.single('pdf'), uploadPrescription);

router.get('/getPrescriptions', protect, getPrescriptions);

module.exports = router;