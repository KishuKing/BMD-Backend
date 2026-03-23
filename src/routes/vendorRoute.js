const express = require("express");
const router = express.Router();
const {getPendingVendors, registerVendor, approveVendor, getVendorById, login} = require('../controllers/vendorController');
const upload = require('../middleware/cloudinaryConfig');

router.get('/pending', getPendingVendors);
router.post('/login', login);
router.post(
    '/register-vendor', 
    upload.single('certificateImage'), 
    registerVendor
  );
router.post("/approve/:id", approveVendor); // Approval route
router.get("/:id", getVendorById);

module.exports = router;