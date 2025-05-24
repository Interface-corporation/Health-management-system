import User from '../models/user.js'
import {
  sendVerificationEmail,
  sendPasswordResetEmail
} from '../services/emailService.js'
import { generateToken, generateRandomToken } from '../utils/helper.js'

export const register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone, role } = req.body

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' })
    }

    // Create verification token
    const verificationToken = generateRandomToken()

    // Send verification email
    await sendVerificationEmail(email, verificationToken)

    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone,
      role: role || 'client',
      verificationToken
    })

    // Generate JWT token
    const token = generateToken(user._id)

    res.status(201).json({
      userId: user._id,
      token,
      expiresIn: 3600
    })
  } catch (err) {
    next(err)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email first' })
    }

    const token = generateToken(user._id)

    res.json({
      userId: user._id,
      token,
      expiresIn: 3600
    })
  } catch (err) {
    next(err)
  }
}

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params

    const user = await User.findOne({ verificationToken: token })
    if (!user) {
      return res.status(404).json({ message: 'Invalid verification token' })
    }

    user.isVerified = true
    user.verificationToken = undefined
    await user.save()

    res.json({ message: 'Email verified successfully' })
  } catch (err) {
    next(err)
  }
}

export const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const resetToken = generateRandomToken()
    const resetExpires = new Date(Date.now() + 3600000) // 1 hour from now

    user.passwordResetToken = resetToken
    user.passwordResetExpires = resetExpires
    await user.save()

    await sendPasswordResetEmail(user.email, resetToken)

    res.json({ message: 'Password reset email sent' })
  } catch (err) {
    next(err)
  }
}

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params
    const { password } = req.body

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' })
    }

    user.password = password
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()

    res.json({ message: 'Password reset successful' })
  } catch (err) {
    next(err)
  }
}
