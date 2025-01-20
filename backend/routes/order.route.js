import express from "express"
import  { createOrderFromCart, getOrderById, deleteOrderById , getAllOrders, updateOrderStatus, getCurrentUserOrders} from'../controllers/order.controller.js';
import { protectedRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

// Protected routes (requires authentication)
router.post('/', protectedRoute, createOrderFromCart);                // Create a new order
router.get('/', protectedRoute, getAllOrders);               // Get all orders for a user
router.get('/currentUser', protectedRoute, getCurrentUserOrders);               // Get all orders for a user
router.get('/:id', protectedRoute, getOrderById);             // Get single order by ID
router.delete('/:id', protectedRoute, deleteOrderById);             // Get single order by ID
router.patch("/:orderId/status", protectedRoute, updateOrderStatus); // Update order status

export default router;
