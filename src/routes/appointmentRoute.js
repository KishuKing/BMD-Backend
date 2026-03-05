const express = require("express");
const router = express.Router();
const {bookAppointment, getDoctorAppointments, updateAppointmentStatus, getPatientAppointments, getChatHistory} = require('../controllers/appointmentController');
const appointmentController = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/book', protect, bookAppointment);
router.get('/doctor-appointments', protect, getDoctorAppointments);
router.post('/update-status', protect, updateAppointmentStatus);
router.get('/my-appointments', protect, getPatientAppointments);
// router.get("/chat-history/:appointmentId", getChatHistory);
router.get("/chat-history/:appointmentId", appointmentController.getChatHistory);

module.exports = router;