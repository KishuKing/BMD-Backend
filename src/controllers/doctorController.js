const User = require("../models/User");
const Doctor = require("../models/Doctor");

exports.buildDoctorProfile = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      UniqueRegisterationNumber,
      qualifications,
      specializations, // Ensure this matches the Flutter key
      experience,
      fee,
      affiliations,
      profileImage,
      certificateImage,
      bio
    } = req.body;

    const profileData = {
      user: req.user._id,
      personalInfo: { name, age, gender },
      UniqueRegisterationNumber,
      qualifications,
      specializations, // This will now correctly save the array
      profileImage: profileImage,
      certificateImage: certificateImage,
      experienceYears: experience,
      consultationFee: fee,
      affiliations,
      bio,
    };

    const profile = await Doctor.findOneAndUpdate(
      { user: req.user._id },
      profileData,
      { new: true, upsert: true }
    );

    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    // Populate the 'user' field, but only select the 'name' field
    const doctors = await Doctor.find().populate("user", "name");

    res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.getPendingDoctors = async (req, res) => {
  try {
    // Fetch doctors where verified property is false
    const pendingDoctors = await Doctor.find({ verified: 'false' })
      .select('-password') // Exclude sensitive data
      .sort({ createdAt: -1 });

    res.status(200).json(pendingDoctors);
  } catch (error) {
    res.status(500).json({
      message: 'Server Error: Could not fetch pending doctors',
      error: error.message
    });
  }
};

// controllers/doctorController.js
exports.getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching Doctor with ID:", id); // Check your terminal for this!

    if (!id || id === 'undefined') {
      return res.status(400).json({ message: "No Doctor ID provided" });
    }

    let doctor = await Doctor.findById(id).populate('user', 'email');

    // If doctor is not found by Doctor _id, attempt to find by the associated User _id
    if (!doctor) {
      doctor = await Doctor.findOne({ user: id }).populate('user', 'email');
    }

    if (!doctor) {
      console.log("Doctor not found in Database");
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json(doctor);
  } catch (error) {
    console.error("Error in getDoctorById:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.approveDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findByIdAndUpdate(
      id,
      { verified: true },
      { new: true } // Returns the updated document
    );

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({
      message: "Doctor verified successfully",
      doctor
    });
  } catch (error) {
    console.error("Error approving doctor:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getDoctorMe = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id }).populate('user', '-password');
    if (doctor) {
      res.status(200).json(doctor);
    } else {
      res.status(404).json({ message: "Doctor profile not found" });
    }
  } catch (error) {
    console.error("Error fetching doctor profile:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};