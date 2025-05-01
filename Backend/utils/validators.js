import { body, param, validationResult } from 'express-validator';

// Custom validation middleware
export const validate = (validations) => {
    return async (req, res, next) => {
        // Execute all validations
        await Promise.all(validations.map(validation => validation.run(req)));

        // Check if there are validation errors
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        // Return validation errors
        return res.status(400).json({ errors: errors.array() });
    };
};

// Common validations
export const authValidation = {
    register: [
        body('email').isEmail().withMessage('Valid email is required'),
        body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
        body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
    ],
    login: [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    passwordReset: [
        body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
    ]
};