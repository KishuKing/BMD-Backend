const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
      const orders = await Order.find()
          .populate('userId', 'name email') 
          .populate('items.medicineId')     
          .sort({ createdAt: -1 });         // Most recent first
          
      res.status(200).json(orders);
  } catch (error) {
      res.status(500).json({ message: "Error fetching orders", error });
  }
};

exports.getRecentOrders = async (req, res) => {
  try {
    // 1. Match the parameter name used in your route. 
    // If your route is /recent/:id, use req.params.id
    const vendorId = req.params.id || req.params.vendorId;

    console.log("Fetching orders for Vendor ID:", vendorId);

    // 2. Query the database. 
    // IMPORTANT: Ensure your Order schema actually uses the field name 'vendorId'.
    // If your schema uses 'vendor', change the key below to 'vendor: vendorId'
    const orders = await Order.find({ vendorId: vendorId })
      .populate("userId", "name email") // Optional: brings in customer details if needed
      .sort({ createdAt: -1 })
      .limit(5);

    console.log(`Found ${orders.length} orders`);

    // 3. Always return an array, even if empty, so the frontend doesn't crash
    res.status(200).json(orders);

  } catch (error) {
    console.error("Order Fetch Error:", error.message);
    res.status(500).json({ 
      message: "Failed to fetch recent orders",
      error: error.message 
    });
  }
};