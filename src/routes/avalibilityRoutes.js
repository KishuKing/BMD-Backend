const express = require("express");
const router = express.Router();
const { saveWeeklySchedule, getAvailableSlots } = require("../controllers/avalibilityController");
const { protect } = require("../middleware/authMiddleware");

router.post("/save-weekly", protect, saveWeeklySchedule);

router.get("/get-slots", getAvailableSlots); 

module.exports = router;