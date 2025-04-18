import { authService } from '../../services/authService.js';
import { validationResult } from 'express-validator';

export const authController = {
    // Register user
    register: async (req, res) => {
        try {
            // Check validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const userData = req.body;
            const result = await authService.register(userData);

            res.status(201).json({
                message: 'User registered successfully. Please check your email to verify your account.',
                user: result
            });
        } catch (error) {
            if (error.message === 'Email already registered') {
                return res.status(409).json({ message: error.message });
            }
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // Verify email
    verifyEmail: async (req, res) => {
        try {
            const { token } = req.params;

            await authService.verifyEmail(token);

            res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Login user
    login: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password } = req.body;
            const result = await authService.login(email, password);

            res.status(200).json({
                message: 'Login successful',
                ...result
            });
        } catch (error) {
            if (['User not found', 'Invalid password', 'Email not verified', 'Account is not active'].includes(error.message)) {
                return res.status(401).json({ message: error.message });
            }
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // Refresh token
    refreshToken: async (req, res) => {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).json({ message: 'Refresh token is required' });
            }

            const result = await authService.refreshToken(refreshToken);

            res.status(200).json({
                message: 'Token refreshed successfully',
                ...result
            });
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    },

    // Request password reset
    requestPasswordReset: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email } = req.body;
            await authService.requestPasswordReset(email);

            res.status(200).json({
                message: 'Password reset instructions have been sent to your email'
            });
        } catch (error) {
            // Always return success to prevent email enumeration attacks
            res.status(200).json({
                message: 'Password reset instructions have been sent to your email if the account exists'
            });
        }
    },

    // Reset password
    resetPassword: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { token } = req.params;
            const { password } = req.body;

            await authService.resetPassword(token, password);

            res.status(200).json({
                message: 'Password reset successful. You can now log in with your new password.'
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

export default authController;