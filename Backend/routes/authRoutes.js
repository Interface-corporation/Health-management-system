import express from 'express';
import { body } from 'express-validator';
import { authController } from '../setup/controllers/authController.js';

const router = express.Router();

// Validation middleware
const validateRegistration = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

const validateLogin = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
];

const validatePasswordReset = [
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// Routes
router.post('/register', validateRegistration, authController.register);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/login', validateLogin, authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', body('email').isEmail().withMessage('Valid email is required'), authController.requestPasswordReset);
router.post('/reset-password/:token', validatePasswordReset, authController.resetPassword);

export default router;