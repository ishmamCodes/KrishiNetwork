import express from 'express';
import {
  addProduct,
  findProductById,
  getAllProducts,
  removeProduct,
  updateProductDescription,
  addProductReview,
  getProductReviews
} from '../controllers/productcontroller.js';

import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Choose one: memory storage or disk storage (below is memory)
const storage = multer.memoryStorage(); // or use diskStorage if needed
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// ✅ Routes
router.post('/add', upload.single('file'), addProduct);       // Add product with file upload
router.get('/all', getAllProducts);                           // Get all products
router.post('/remove', removeProduct);                        // Remove a product
router.get('/:id', findProductById);                          // Find a product by ID
router.put('/:id/description', updateProductDescription);     // Update product description
router.post('/:id/review', addProductReview);                 // Add review
router.get('/:id/reviews', getProductReviews);                // Get reviews

export default router;