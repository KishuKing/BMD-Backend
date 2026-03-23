const Vendor  = require('../models/Vendor');
const Order = require('../models/Order');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// 1. Vendor Registration
exports.registerVendor = async (req, res) => {
  try {
    const { 
      name, email, password, shopName, address, city, 
      drugLicenseNumber, pharmacistName, pharmacistRegNo 
    } = req.body;

    // Check if vendor already exists
    const existing = await Vendor.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get Cloudinary URL from req.file (provided by your cloudinaryConfig storage)
    const certificateUrl = req.file ? req.file.path : null;

    if (!certificateUrl) {
      return res.status(400).json({ message: "Certificate image is required" });
    }

    const newVendor = new Vendor({
      name,
      email,
      password: hashedPassword,
      shopName,
      location: { address, city },
      drugLicenseNumber,
      pharmacistDetails: {
        name: pharmacistName,
        registrationNumber: pharmacistRegNo
      },
      certificateImage: certificateUrl
    });

    await newVendor.save();
    res.status(201).json({ success: true, message: "Vendor registered!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Vendor.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: "vendor",
        token: generateToken(user._id),
      });

    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. View Orders (Only for this specific vendor)
exports.getVendorOrders = async (req, res) => {
  try {
    // Finds orders where items belong to this vendor
    const orders = await Order.find({ "items.vendorId": req.params.vendorId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch orders" });
  }
};

exports.getPendingVendors = async (req, res) => {
  try {
    // This will now work because Vendor is defined
    const pendingVendors = await Vendor.find({ verified: false })
      .sort({ createdAt: -1 });

    res.status(200).json(pendingVendors);
  } catch (err) {
    res.status(500).json({ 
      message: "Server Error: Could not fetch pending vendors", 
      error: err.message 
    });
  }
};

exports.getVendorById = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await Vendor.findById(id);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json(vendor);
  } catch (error) {
    console.error("Error fetching vendor:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Approve Vendor
exports.approveVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await Vendor.findByIdAndUpdate(
      id,
      { verified: true },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json({ message: "Vendor verified successfully", vendor });
  } catch (error) {
    res.status(500).json({ message: "Failed to verify vendor" });
  }
};