const Vendor  = require('../models/Vendor');
const Order = require('../models/Order');

// 1. Vendor Registration
exports.registerVendor = async (req, res) => {
  try {

    const vendor = new Vendor({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      shopName: req.body.shopName,

      location: {
        address: req.body.address,
        city: req.body.city
      },

      drugLicenseNumber: req.body.drugLicenseNumber,

      pharmacistDetails: {
        name: req.body.pharmacistName,
        registrationNumber: req.body.pharmacistRegNumber
      },

      certificateImage: req.body.certificateImage
    });

    await vendor.save();

    res.status(201).json({
      message: "Registration successful. Pending admin verification."
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
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