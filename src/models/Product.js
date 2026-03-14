const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    vendorId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor', 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    brand: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        enum: ['ANTIBIOTIC', 'VITAMINS', 'TABLETS', 'SYRUPS'], 
        default: 'TABLETS' 
    },
    price: { 
        type: Number, 
        required: true 
    },
    description: { 
        type: String 
    },
    dosage: { 
        type: String 
    },
    unitQuantity: { 
        type: String 
    }, // e.g., "30 Capsules"
    stockStatus: { 
        type: Boolean, 
        default: true 
    },
    productImage: { 
        type: String, 
        default: 'default-avatar-url'
    }
  });

module.exports = mongoose.model('Product', productSchema);