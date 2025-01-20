import express from 'express';
import { createProduct, getProducts, getProductById, deleteProductById, editProduct, getReviews, getAverageRating, addReview } from "../controllers/product.controller.js"
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.get('/', getProducts);                // Fetch all products
router.get('/:id', getProductById);          // Fetch single product by ID
router.delete('/:id',protectedRoute ,  deleteProductById);          // Fetch single product by ID
router.patch('/:id',protectedRoute ,editProduct);          // Fetch single product by ID

router.post('/',protectedRoute , createProduct);             // Create a new product
router.post("/:productId/reviews", protectedRoute, addReview);

// Get all reviews for a product
router.get("/:productId/reviews", getReviews);

// Get the average rating for a product
router.get("/:productId/average-rating", getAverageRating);
export default router;
