import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import dotenv from 'dotenv'
dotenv.config()

// Hash password
export const hashPassword = async (password) => {
  const saltRounds = 10
  return await bcrypt.hash(password, saltRounds)
}

// Compare password with hash
export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash)
}

// Generate access token
export const generateAccessToken = (userId, roles) => {
  return jwt.sign({ userId, roles }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  })
}

// Generate refresh token
export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d'
  })
}

// Verify token
export const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret)
  } catch (error) {
    return null
  }
}
