const express = require('express');
const router = express.Router();
const {getProducts, getProductById, addProduct} = require('../controllers/productController');

router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.post('/add-product/:vendorId', addProduct);

module.exports = router;