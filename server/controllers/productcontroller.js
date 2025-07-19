import Product from '../models/Product.js';

// Add Product Controller
export const addProduct = async (req, res) => {
  try {
    const products = await Product.find({});
    const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

    const { name, old_price, new_price, category, available } = req.body;

    // Handle uploaded image file
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image file is required." });
    }

    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const product = new Product({
      id,
      name,
      old_price,
      new_price,
      category,
      available,
      image: base64Image
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to add product", error: err.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};


// Remove a product
export const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;
    const deletedProduct = await Product.findOneAndDelete({ id: id });

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    console.log("Product removed:", deletedProduct);
    res.status(200).json({
      success: true,
      message: "Product removed successfully",
      product: deletedProduct,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to remove product",
      error: err.message,
    });
  }
};

export const findProductById = async (req, res) => {
    try {
      // Get the product ID from the request parameters
      const { id } = req.params;
  
      // Find the product by ID
      const product = await Product.findOne({ id });
  
      // If product not found, return an error
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
  
      // Return the product if found
      res.status(200).json({
        success: true,
        product,
      });
    } catch (err) {
      // Handle error
      res.status(500).json({
        success: false,
        message: "Failed to fetch product",
        error: err.message,
      });
    }
};



export const updateProductDescription = async (req, res) => {
  try {
    const productId    = Number(req.params.id);
    const { description } = req.body;

    if (typeof description !== "string") {
      return res.status(400).json({ success: false, message: "Description is required" });
    }

    const updated = await Product.findOneAndUpdate(
      { id: productId },
      { description },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Update failed", error: err.message });
  }
};

// Add a review to a product
export const addProductReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, username, rating, comment } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: "Rating and comment required" });
    }
    const product = await Product.findOne({ id });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    product.reviews.push({ userId, username, rating, comment });
    await product.save();
    res.status(201).json({ success: true, reviews: product.reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to add review", error: err.message });
  }
};

// Get all reviews for a product
export const getProductReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ id });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, reviews: product.reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch reviews", error: err.message });
  }
};