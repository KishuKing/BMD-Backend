const Cart = require('../models/Cart');

// 1. Add to Cart (or update quantity if already exists)
exports.addToCart = async (req, res) => {
    const { userId, medicineId, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ userId });

        if (cart) {
            // Check if medicine already exists in cart
            const itemIndex = cart.items.findIndex(p => p.medicineId.toString() === medicineId);
            
            if (itemIndex > -1) {
                // If exists, update quantity
                cart.items[itemIndex].quantity += quantity;
            } else {
                // If not, push new item
                cart.items.push({ medicineId, quantity });
            }
            cart = await cart.save();
        } else {
            // Create new cart for user
            cart = await Cart.create({
                userId,
                items: [{ medicineId, quantity }]
            });
        }
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. Delete item from Cart
exports.removeFromCart = async (req, res) => {
    const { userId, medicineId } = req.params;
    try {
        const cart = await Cart.findOne({ userId });
        if (cart) {
            cart.items = cart.items.filter(item => item.medicineId.toString() !== medicineId);
            await cart.save();
            return res.status(200).json({ message: "Item removed", cart });
        }
        res.status(404).json({ message: "Cart not found" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. Get Cart with populated details
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId })
                               .populate('items.medicineId');
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update item quantity
exports.updateQuantity = async (req, res) => {
    const { userId, medicineId, action } = req.body; // action: 'increment' or 'decrement'
    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const itemIndex = cart.items.findIndex(p => p.medicineId.toString() === medicineId);
        if (itemIndex > -1) {
            if (action === 'increment') {
                cart.items[itemIndex].quantity += 1;
            } else if (action === 'decrement' && cart.items[itemIndex].quantity > 1) {
                cart.items[itemIndex].quantity -= 1;
            }
            await cart.save();
            const updatedCart = await Cart.findOne({ userId }).populate('items.medicineId');
            res.status(200).json(updatedCart);
        } else {
            res.status(404).json({ message: "Item not found in cart" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteEntireCart = async (req, res) => {
    try {
        await Cart.findOneAndUpdate(
            { userId: req.params.userId },
            { $set: { items: [] } } // This empties the items array
        );
        res.status(200).json({ message: "Cart cleared" });
    } catch (error) {
        res.status(500).json(error);
    }
}

