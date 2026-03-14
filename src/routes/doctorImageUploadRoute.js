const express = require("express");
const router = express.Router();
const upload = require('../middleware/cloudinaryConfig'); // Path to your multer/cloudinary config
const { uploadProfileImageAndCertificate } = require("../controllers/doctorImageUploadController");

// Added the upload.fields middleware here
router.post('/upload-temp', upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'certificateImage', maxCount: 1 }
]), uploadProfileImageAndCertificate);

module.exports = router;