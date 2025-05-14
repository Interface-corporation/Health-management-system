// authMiddleware.js
import jwt from 'jsonwebtoken'
import User from '../initialization/User.js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-jwt-key'

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticateUser = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No token provided.'
      })
    }

    // Verify token
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)

    // Find user
    const user = await User.findByPk(decoded.id)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User associated with this token no longer exists'
      })
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    }

    next()
  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      })
    }

    console.error('Authentication error:', error)
    res.status(500).json({
      success: false,
      message: 'Error authenticating user'
    })
  }
}

/**
 * Role-based authorization middleware
 * @param {Array|String} roles - Allowed roles
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user.role}) is not authorized to access this resource`
      })
    }

    next()
  }
}
