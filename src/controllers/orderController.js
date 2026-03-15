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
    const { vendorId } = req.params;

    const orders = await Order.find({ vendorId: vendorId }) // filter
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json(orders);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recent orders" });
  }
};