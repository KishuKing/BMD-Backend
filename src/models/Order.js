const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    orderNumber: { 
        type: String, 
        unique: true 
    },
    items: Array,
    totalAmount: { 
        type: Number 
    },
    shippingAddress: {
        type: String,
        require: true
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Confirmed', 'Delivered'], 
        default: 'Pending' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
  });

module.exports = mongoose.model('Order', orderSchema);