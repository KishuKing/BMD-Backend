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
          bio 
      } = req.body;

      const profileData = {
          user: req.user._id,
          personalInfo: { name, age, gender },
          UniqueRegisterationNumber,
          qualifications,
          specializations, // This will now correctly save the array
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