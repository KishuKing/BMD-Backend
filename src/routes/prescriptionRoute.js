const express = require("express");
const router = express.Router();
const upload = require('../middleware/cloudinaryConfig');
const { protect } = require('../middleware/authMiddleware');
const { uploadPrescription } = require('../controllers/prescriptionController');

// The endpoint will be /api/prescriptions/upload
// Note: We use protect middleware for Authorization token validation
// and upload.single('pdf') to look for the file field named 'pdf'
router.post('/upload', protect, upload.single('pdf'), uploadPrescription);

module.exports = router;
