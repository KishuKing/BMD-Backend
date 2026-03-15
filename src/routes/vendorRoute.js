const express = require("express");
const router = express.Router();
const {getPendingVendors, registerVendor, approveVendor, getVendorById} = require('../controllers/vendorController');
const { protect } = require("../middleware/authMiddleware");

router.get('/pending', getPendingVendors);
router.post('/register-vendor', protect, registerVendor);
router.post("/approve/:id", approveVendor); // Approval route
router.get("/:id", getVendorById);

module.exports = router;