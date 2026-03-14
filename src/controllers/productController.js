const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(404).json({ message: "Product not found" });
  }
};

exports.addProduct = async (req, res) => {
  try {
      // req.body is populated by Multer middleware in your routes
      const { name, brand, description, price, unitQuantity, category } = req.body;

      const productData = {
          name,
          brand,
          description,
          price,
          unitQuantity,
          category: category || "TABLETS",
          vendorId: req.params.vendorId,
          productImage: req.file ? req.file.path : "" 
      };

      const product = new Product(productData);
      await product.save();
      res.status(201).json(product);
  } catch (err) {
      res.status(400).json({ error: err.message });
  }
};
  
  // Update Product
  exports.updateProduct = async (req, res) => {
    try {
      const updated = await Product.findOneAndUpdate(
        { _id: req.params.id, vendorId: req.params.vendorId }, 
        req.body, 
        { new: true }
      );
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: "Update failed" });
    }
  };
  
  // Delete Product
  exports.deleteProduct = async (req, res) => {
    try {
      await Product.findOneAndDelete({ _id: req.params.id, vendorId: req.params.vendorId });
      res.json({ message: "Product deleted" });
    } catch (err) {
      res.status(400).json({ error: "Delete failed" });
    }
  };