const express = require('express');
const router = express.Router();
const orderCtrl = require('../controllers/orderController');

router.post('/orders', orderCtrl.createOrder);
router.get('/orders/history/:userId', orderCtrl.getOrderHistory);
router.get("/recent/:vendorId", orderCtrl.getRecentOrders);   
router.get('/getAllOrders', orderCtrl.getAllOrders);

module.exports = router;