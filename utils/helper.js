import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
}

export const generateRandomToken = () => {
    return crypto.randomBytes(32).toString('hex');
}