// routes/payment.routes.js
import express from 'express';
import { protectedRoute } from '../middleware/auth.middleware.js';
import { createPaymentIntent } from '../controllers/payment.controller.js';

const router = express.Router();

// Route to create a payment intent
router.post('/', protectedRoute, createPaymentIntent);

export default router;
