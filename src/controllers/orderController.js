const Order = require('../models/Order');
const Product = require('../models/Product'); // Make sure to require the Product model
const mongoose = require('mongoose'); // Add this at the top

exports.createOrder = async (req, res) => {
  try {
    const { items, userId, shippingAddress, totalAmount, orderNumber } = req.body;

    // --- FIX IS HERE ---
    // Instead of item._id, reach into item.medicineId._id
    const productIds = items.map(item => {
      return item.medicineId && item.medicineId._id 
        ? item.medicineId._id 
        : item._id; 
    });
    // -------------------

    console.log("Searching for Product IDs:", productIds);

    const productsFromDb = await Product.find({ _id: { $in: productIds } });
    console.log("Found Products in DB:", productsFromDb);

    const uniqueVendorIds = [...new Set(
      productsFromDb
        .map(p => p.vendorId ? p.vendorId.toString() : null)
        .filter(v => v !== null)
    )];

    const newOrder = new Order({
      userId,
      orderNumber,
      items, 
      vendorIds: uniqueVendorIds, 
      totalAmount,
      shippingAddress,
      status: "Pending"
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Order Save Error:", err);
    res.status(400).json({ message: err.message });
  }
};

exports.getOrderHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Validate the ID format to prevent server crashes
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    // 2. Find orders and populate the medicine details inside the items array
    const orders = await Order.find({ userId: userId })
      .populate({
        path: 'items.medicineId', // This reaches into the items array to get product details
        select: 'name price productImage' 
      })
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error("Order History Error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
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
    const vendorId = req.params.vendorId;

    if (!vendorId) {
      return res.status(400).json({ message: "Vendor ID is required" });
    }

    // 1. Find orders where this vendor's ID exists in the vendorIds array
    const orders = await Order.find({ vendorIds: vendorId })
      .populate("userId", "name email") // Get customer details
      .populate({ path: "items.medicineId", model: "Product", select: "name price productImage vendorId" }) // populate medicineId if exists
      .populate({ path: "items.productId", model: "Product", select: "name price productImage vendorId" }) // populate productId if exists
      .sort({ createdAt: -1 })
      .lean(); // lean() makes the data a plain JS object so we can modify 'items'

    // 2. Filter the items list for each order 
    // This ensures Vendor A doesn't see Vendor B's products
    const filteredOrders = orders.map(order => {
      const myItems = order.items.filter(item => {
        // Look into the nested medicineId or productId object we found earlier
        const vendorFromMedicine = item.medicineId?.vendorId?.toString();
        const vendorFromProduct = item.productId?.vendorId?.toString();
        
        // Also check if item itself has vendorId directly
        const vendorDirect = item.vendorId?.toString();

        const itemVendorId = vendorFromMedicine || vendorFromProduct || vendorDirect;
        return itemVendorId === vendorId;
      });

      return {
        ...order,
        items: myItems,
        // Optional: Recalculate total for JUST this vendor's items
        vendorTotal: myItems.reduce((sum, item) => sum + ((item.price || item.medicineId?.price || item.productId?.price || 0) * (item.quantity || 1)), 0)
      };
    });

    res.status(200).json(filteredOrders);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};