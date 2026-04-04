const Appointment = require("../models/Appointment");

const uploadPrescription = async (req, res) => {
    try {
        const { appointmentId, patientId } = req.body;

        // 1. Check if file exists
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No PDF file uploaded. Please upload a file under the key 'pdf'." });
        }

        // 2. Validate input
        if (!appointmentId) {
            return res.status(400).json({ success: false, message: "Appointment ID is required." });
        }

        const prescriptionUrl = req.file.path; // URL returned by Cloudinary

        // 3. Find the Appointment
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found." });
        }

        // Ensure that the appointment belongs to the specified patient or doctor.
        // We rely on 'req.user' set by the `protect` middleware to ensure the caller is authenticated.
        if (patientId && appointment.patient.toString() !== patientId) {
            return res.status(403).json({ success: false, message: "Appointment does not belong to the specified patient." });
        }

        // 4. Save URL to database
        appointment.prescriptionUrl = prescriptionUrl;
        await appointment.save();

        res.status(200).json({
            success: true,
            message: "Prescription uploaded successfully",
            prescriptionUrl: prescriptionUrl,
            appointment: appointment
        });

    } catch (error) {
        console.error("Prescription Upload Error:", error);
        res.status(500).json({ success: false, message: "Server error during upload", error: error.message });
    }
};

const getPrescriptions = async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch all appointments for this user that have a valid prescriptionUrl
        const prescriptions = await Appointment.find({
            patient: userId,
            prescriptionUrl: { $exists: true, $ne: null, $ne: "" }
        })
            .populate('doctor', 'personalInfo.name specializations profileImage.url') // Correctly targeting nested fields
            .sort({ createdAt: -1 });

        // Map the result to flatten 'personalInfo.name' into 'name' for the frontend
        const formattedPrescriptions = prescriptions.map(p => {
            const appt = p.toObject();
            if (appt.doctor) {
                appt.doctor = {
                    ...appt.doctor,
                    name: appt.doctor.personalInfo?.name || "Dr. Unknown",
                    specialization: appt.doctor.specializations?.[0] || ""
                };
            }
            return appt;
        });

        res.status(200).json({
            success: true,
            prescriptions: formattedPrescriptions
        });
    } catch (error) {
        console.error("Fetch Prescriptions Error:", error);
        res.status(500).json({ success: false, message: "Server error while fetching prescriptions", error: error.message });
    }
};

module.exports = {
    uploadPrescription,
    getPrescriptions
};