import express from 'express';
import {
  register,
  login,
  verifyEmail,
  requestPasswordReset,
  resetPassword
} from '../controllers/authController.js';

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Welcome to the authentication API"
  })
})
router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);

export default router;