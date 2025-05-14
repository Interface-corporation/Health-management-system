// authRoutes.js
import express from 'express';
import {
  register,
  login,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  getCurrentUser
} from '../setup/controllers/authController.js';
import { authenticateUser } from '../configuration/middleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword)

// Protected routes
router.get('/me', authenticateUser, getCurrentUser);

export default router;