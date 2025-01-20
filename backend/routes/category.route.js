import express from 'express';
import { createCategory, deleteCategoryById, getCategories, getCategoryById } from'../controllers/category.controller.js';
const router = express.Router();

// Public routes
router.get('/', getCategories);             // Fetch all categories
router.get('/:id', getCategoryById);        // Fetch single category by ID
router.delete('/:id', deleteCategoryById);        // Fetch single category by ID

// Admin routes (Add admin authentication middleware if necessary)
router.post('/', createCategory);           // Create a new category

export default  router;
