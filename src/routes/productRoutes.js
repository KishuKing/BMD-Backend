const express = require('express');
const router = express.Router();
const {getProducts, getProductById, addProduct} = require('../controllers/productController');
const upload = require("../middleware/cloudinaryConfig");

router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.post('/add-product/:vendorId', upload.single('productImage'), addProduct);

module.exports = router;