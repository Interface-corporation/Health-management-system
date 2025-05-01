import crypto from 'crypto';
import db from '../setup/models/index.js';
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken, verifyToken } from '../utils/authUtils.js';
import { emailService } from './emailService.js';

// Get User model and Sequelize from the db object
const { User, Sequelize } = db;
const { Op } = Sequelize;

export const authService = {
    // Register a new user
    register: async (userData) => {
        const { email, username, password, role } = userData;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('Email already registered');
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Create user
        const user = await User.create({
            email,
            username,
            password: hashedPassword,
            role: role || 'healthcare_worker',
            emailVerificationToken: verificationToken,
            emailVerificationExpires: verificationExpires
        });

        // Send verification email
        await emailService.sendVerificationEmail(email, verificationToken, username);

        return {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role
        };
    },

    verifyEmail: async (token) => {
        const user = await User.findOne({
            where: {
                emailVerificationToken: token,
                emailVerificationExpires: { [Op.gt]: new Date() }
            }
        });


        if (!user) {
            throw new Error('Invalid or expired verification token');
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = null;
        user.emailVerificationExpires = null;
        user.status = 'active';

        await user.save();

        // Send welcome email
        await emailService.sendWelcomeEmail(user.email, user.username);

        return true;
    },

    // Added login method
    login: async (email, password) => {
        // Find user by email
        const user = await User.findOne({ where: { email } });

        // Check if user exists
        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Check if email is verified
        if (!user.isEmailVerified) {
            throw new Error('Please verify your email address before logging in');
        }

        // Check if account is active
        if (user.status !== 'active') {
            throw new Error('Your account is not active');
        }

        // Verify password
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        // Generate tokens
        const accessToken = generateAccessToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

        const refreshToken = generateRefreshToken({
            id: user.id
        });

        // Update user's refresh token in database
        user.refreshToken = refreshToken;
        await user.save();

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role
            }
        };
    },

    // Adding refreshToken method
    refreshToken: async (token) => {
        // Find user by refresh token
        const user = await User.findOne({ where: { refreshToken: token } });

        if (!user) {
            throw new Error('Invalid refresh token');
        }

        // Verify the token
        try {
            const decoded = verifyToken(token);

            // Generate new access token
            const accessToken = generateAccessToken({
                id: user.id,
                email: user.email,
                role: user.role
            });

            return { accessToken };
        } catch (error) {
            throw new Error('Invalid or expired refresh token');
        }
    },

    // Adding requestPasswordReset method
    requestPasswordReset: async (email) => {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            // For security reasons, don't reveal if email exists
            return true;
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

        // Save to user
        user.passwordResetToken = resetToken;
        user.passwordResetExpires = resetExpires;
        await user.save();

        // Send password reset email
        await emailService.sendPasswordResetEmail(email, resetToken, user.username);

        return true;
    },

    // Adding resetPassword method
    resetPassword: async (token, newPassword) => {
        const user = await User.findOne({
            where: {
                passwordResetToken: token,
                passwordResetExpires: { [Op.gt]: new Date() }
            }
        });

        if (!user) {
            throw new Error('Invalid or expired password reset token');
        }

        // Hash new password
        const hashedPassword = await hashPassword(newPassword);

        // Update user password
        user.password = hashedPassword;
        user.passwordResetToken = null;
        user.passwordResetExpires = null;
        await user.save();

        // Send password change confirmation email
        await emailService.sendPasswordChangedEmail(user.email, user.username);

        return true;
    }
};

export default authService;