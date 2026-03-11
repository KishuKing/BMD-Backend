const { Vendor } = require('../models/Vendor');
const Order = require('../models/Order');

// 1. Vendor Registration
exports.registerVendor = async (req, res) => {
  try {
    const vendor = new Vendor(req.body);
    await vendor.save();
    res.status(201).json({ message: "Registration successful. Pending admin verification." });
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