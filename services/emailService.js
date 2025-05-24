import nodemailer from 'nodemailer';
import { verificationEmail, passwordResetEmail } from './emailTemplates.js';

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
      user: 'kananuraabdulkhaliq59@gmail.com',
      pass: 'uezr dknt xtxr ogfs'
  }
});

export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.BASE_URL}/api/auth/verify-email/${token}`;
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verify Your Email',
    html: verificationEmail(verificationUrl)
  };

  await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.BASE_URL}/reset-password/${token}`;
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Password Reset Request',
    html: passwordResetEmail(resetUrl)
  };

  await transporter.sendMail(mailOptions);
};

export const shutdownEmailService = async () => {
  transporter.close();
};

export const getEmailQueueStats = () => {
  return transporter.getVerifier().getPendingMessages();
};