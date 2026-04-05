const express = require('express');
const router = express.Router();
const {getProducts, getProductById, getProductsByVendor, addProduct, updateProduct, deleteProduct} = require('../controllers/productController');
const upload = require("../middleware/cloudinaryConfig");

router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.get('/vendor/:vendorId', getProductsByVendor);
router.post('/add-product/:vendorId', upload.single('productImage'), addProduct);
router.put('/update/:vendorId/:id', updateProduct);
router.delete('/delete/:vendorId/:id', deleteProduct);

module.exports = router;