import express from 'express';
import { addToCart, getCart, removeFromCart } from '../controllers/cart.controller.js';
import { protectedRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Route to add an item to the cart
router.post('/add',protectedRoute,addToCart);

// Route to get the user's cart
router.get('/',protectedRoute, getCart);

// Route to remove an item from the cart
router.delete('/remove/:productId',protectedRoute, removeFromCart); // Use productId here

export default router;
