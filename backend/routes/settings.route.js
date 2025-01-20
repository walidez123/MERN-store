import express from 'express';
import { getSettings, updateSettings } from '../controllers/settings.controller.js';

const router = express.Router();

// Route to get website settings (Public access)
router.get('/', getSettings);

// Route to update website settings (Admin-only access)
router.put('/', updateSettings);

export default router;
