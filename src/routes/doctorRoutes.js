const express = require("express");
const router = express.Router();
const { buildDoctorProfile, getDoctors, getPendingDoctors, getDoctorById, approveDoctor } = require("../controllers/doctorController");
const { protect } = require("../middleware/authMiddleware");

router.post("/build-profile", protect, buildDoctorProfile);
router.get("/get-doctors", getDoctors);
router.get('/pending', getPendingDoctors);
router.get('/:id', getDoctorById);
router.post("/approve/:id", approveDoctor);

module.exports = router;