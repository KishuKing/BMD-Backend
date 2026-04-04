const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const ChatMessage = require("../models/ChatMessage");

exports.bookAppointment = async (req, res) => {
    try{
    const { doctorId, date, slot, reason } = req.body; // <--- Get reason here
    const patientId = req.user._id;

    const existing = await Appointment.findOne({ 
        doctor: doctorId, 
        date, 
        slot, 
        status: { $ne: 'cancelled' } 
    });

    if (existing) {
        return res.status(400).json({ success: false, message: "This slot has just been booked." });
    }

    const newAppointment = new Appointment({
        doctor: doctorId,
        patient: patientId,
        date,
        slot,
        reason,
        status: 'pending'
    });

    await newAppointment.save();

        res.status(201).json({
            success: true,
            message: "Appointment booked successfully!",
            data: newAppointment
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getDoctorAppointments = async (req, res) => {
    try {
        const userId = req.user._id; 
        const { type } = req.query;

        const doctor = await Doctor.findOne({ user: userId });
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor profile not found" });
        }

        let query = { doctor: doctor._id };
        if (type === 'upcoming') {
            query.status = { $in: ['pending'] };
        } else if (type === 'ongoing') {
            query.status = { $in: ['scheduled', 'ongoing'] };
        } else if (type === 'completed') {
            query.status = { $in: ['completed', 'cancelled'] };
        }

        const appointments = await Appointment.find(query)
        .populate({
            path: 'patient',
            select: 'name email'
        })
        .sort({ date: 1, slot: 1 });

        res.status(200).json({ success: true, count: appointments.length, fee: doctor.consultationFee, data: appointments });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { appointmentId, status } = req.body; // status: 'scheduled' or 'cancelled'

        const appointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            { status },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        res.status(200).json({
            success: true,
            message: `Appointment ${status === 'scheduled' ? 'confirmed' : 'cancelled'} successfully`,
            data: appointment
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getPatientAppointments = async (req, res) => {
    try {
        const patientId = req.user._id; // Extracted from your 'protect' middleware

        // Fetch appointments and populate Doctor's user name
        const appointments = await Appointment.find({ patient: patientId })
            .populate({
                path: 'doctor',
                populate: { path: 'user', select: 'name' }
            })
            .sort({ date: -1 });

        res.status(200).json({ success: true, data: appointments });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getChatHistory = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        
        // This looks for all messages where the 'appointment' field matches your ID
        const messages = await ChatMessage.find({ appointment: appointmentId })
            .sort({ createdAt: 1 });

        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};