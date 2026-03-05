const WeeklyAvailability = require("../models/WeeklyAvailability");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor")
const moment = require("moment");

// avalibilityController.js

exports.saveWeeklySchedule = async (req, res) => {
  try {
      const { doctorId, schedule } = req.body;

      // NEW LOGIC: Check if the ID provided is a User ID or Doctor ID
      // We look for the Doctor document where .user matches the provided ID
      let doctorRecord = await Doctor.findOne({ _id: doctorId });
      
      // If not found by _id, check if it was accidentally passed as the User ID
      if (!doctorRecord) {
          doctorRecord = await Doctor.findOne({ user: doctorId });
      }

      if (!doctorRecord) {
          return res.status(404).json({ message: "Doctor profile not found for this ID" });
      }

      // Always use the DOCTOR collection ID for the availability record
      const actualDoctorId = doctorRecord._id;

      const updatedSchedule = await WeeklyAvailability.findOneAndUpdate(
          { doctor: actualDoctorId }, 
          { schedule },
          { new: true, upsert: true }
      );

      res.status(200).json({
          success: true,
          message: "Weekly schedule saved to Doctor ID: " + actualDoctorId,
          data: updatedSchedule
      });
  } catch (error) {
      res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAvailableSlots = async (req, res) => {
  try {
      const { doctorId, date } = req.query;
      const dayName = moment(date, "YYYY-MM-DD").format("dddd");

      const availability = await WeeklyAvailability.findOne({ doctor: doctorId });
      
      if (!availability) {
          return res.status(200).json({ slots: [], message: "No schedule set" });
      }

      const settings = availability.schedule[dayName];

      if (!settings || !settings.enabled) {
          return res.status(200).json({ slots: [] });
      }

      // --- FIX STARTS HERE ---
      // Make sure these match the keys in your console log exactly
      const startTimeStr = settings.start; 
      const endTimeStr = settings.end;
      const duration = settings.slotDuration;

      if (!startTimeStr || !endTimeStr) {
          throw new Error("Start or End time is missing in database settings");
      }

      let allPossibleSlots = [];
      let startTime = moment(startTimeStr, "HH:mm");
      let endTime = moment(endTimeStr, "HH:mm");

      // Safety check to prevent infinite loops if duration is 0 or invalid
      const interval = parseInt(duration) || 15; 

      while (startTime.isBefore(endTime)) {
          allPossibleSlots.push(startTime.format("HH:mm"));
          startTime.add(interval, 'minutes');
      }
      // --- FIX ENDS HERE ---

      // Fetch already booked slots (Ensure Appointment model is imported)
      const bookedAppointments = await Appointment.find({
          doctor: doctorId,
          date: date,
          status: { $in: ['scheduled', 'pending', 'ongoing'] }
      });

      const bookedSlots = bookedAppointments.map(app => app.slot);
      const availableSlots = allPossibleSlots.filter(slot => !bookedSlots.includes(slot));

      res.status(200).json({
          success: true,
          slots: availableSlots
      });

  } catch (error) {
      console.error("Slot Generation Error:", error);
      res.status(500).json({ success: false, message: error.message });
  }
};