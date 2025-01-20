import e from "express";
import { 
  signup, 
  verifyEmail, 
  logout, 
  login, 
  forgotPassword, 
  resetPassword, 
  checkAuth, 
  resendCode, 
  addToFavorites,
  removeFromFavorites,
  getFavorites
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";
const router = e.Router();

// Route Definitions
router.get('/check-auth', protectedRoute, checkAuth); // Verify user is authenticated
router.post('/signup', signup); // Register new user
router.post('/login', login); // Authenticate user
router.put('/verify-email', verifyEmail); // Verify email address
router.post('/resend-code', resendCode); // Resend verification code
router.post('/forgot-password', forgotPassword); // Initiate password reset
router.put('/reset-password', resetPassword); // Update password
router.post('/logout', logout); // Log out user
router.post("/favorites/add", protectedRoute, addToFavorites);
router.post("/favorites/remove", protectedRoute, removeFromFavorites);
router.get("/favorites", protectedRoute, getFavorites);
export default router;
