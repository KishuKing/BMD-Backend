const express = require("express");
const router = express.Router();
const { buildDoctorProfile, getDoctors } = require("../controllers/doctorController");
const { protect } = require("../middleware/authMiddleware");

router.post("/build-profile", protect, buildDoctorProfile);
router.get("/get-doctors", getDoctors);

module.exports = router;