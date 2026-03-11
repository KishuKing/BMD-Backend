const express = require("express");
const router = express.Router();
const {addToCart, removeFromCart, getCart, updateQuantity, deleteEntireCart} = require("../controllers/cartController");

router.post('/add', addToCart);
router.delete('/remove/:userId/:medicineId', removeFromCart);
router.get('/:userId', getCart);
router.put('/update-quantity', updateQuantity);
router.delete('/clear/:userId', deleteEntireCart);

module.exports = router;