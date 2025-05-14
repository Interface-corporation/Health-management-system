// emailService.js - Fixed implementation
import nodemailer from 'nodemailer';
import { verificationEmail } from './emailTemplates.js';
import Queue from 'better-queue';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'uwasepamellas@gmail.com',     // replace with your email
    pass: 'malx nkpf ynxb btqx',        // replace with your app-specific password
  }
});

// Configure queue options without filesystem dependency
const queueOptions = {
  maxRetries: 5,               // Retry failed emails up to 5 times
  retryDelay: 10000,           // Wait 10 seconds between retries
  failTaskOnError: true,      
  filo: false                  // Process in first-in-first-out order
};

// Initialize the email queue
const emailQueue = new Queue(async (task, callback) => {
  try {
    console.log(`📧 Processing email to: ${task.mailOptions.to}`);
    const info = await transporter.sendMail(task.mailOptions);
    console.log(`✅ Email sent to ${task.mailOptions.to}, messageId: ${info.messageId}`);
    callback(null, info);
  } catch (error) {
    console.error(`❌ Failed to send email to ${task.mailOptions.to}:`, error);
    callback(error);
  }
}, queueOptions);

// Handle queue events
emailQueue.on('task_finish', (taskId, result) => {
  console.log(`✨ Email task ${taskId} completed successfully`);
});

emailQueue.on('task_failed', (taskId, error) => {
  console.error(`❌ Email task ${taskId} failed after all retries:`, error);
});

emailQueue.on('task_retry', (taskId, error) => {
  console.log(`⚠️ Retrying email task ${taskId} after error:`, error.message);
});

/**
 * Queue an email to be sent
 * @param {Object} mailOptions - Nodemailer mail options
 * @returns {Promise<string>} - Returns a promise with task ID
 */
const queueEmail = (mailOptions) => {
  return new Promise((resolve, reject) => {
    const taskId = `email_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    emailQueue.push({
      id: taskId,
      mailOptions
    }, (err, result) => {
      if (err) {
        console.error(`❌ Failed to queue email: ${err.message}`);
        reject(err);
      } else {
        console.log(`📋 Email queued with ID: ${taskId}`);
        resolve(taskId);
      }
    });
  });
};

/**
 * Send verification email through the queue
 * @param {string} toEmail - Recipient email
 * @param {string} username - Recipient username
 * @param {string} verificationLink - Email verification link
 * @returns {Promise<string>} - Task ID in the queue
 */
export const sendVerificationEmail = async (toEmail, username, verificationLink) => {
  const mailContent = verificationEmail(username, verificationLink);
  
  const mailOptions = {
    from: "uwasepamellas@gmail.com",
    to: toEmail,
    subject: mailContent.subject,
    html: mailContent.html,
    text: mailContent.text
  };

  try {
    const taskId = await queueEmail(mailOptions);
    return taskId;
  } catch (err) {
    console.error('❌ Error queueing verification email:', err);
    throw err;
  }
};

/**
 * Send a generic email through the queue
 * @param {Object} mailOptions - Nodemailer mail options
 * @returns {Promise<string>} - Task ID in the queue
 */
export const sendEmail = async (mailOptions) => {
  try {
    // Ensure from address is set if not provided
    if (!mailOptions.from) {
      mailOptions.from = "uwasepamellas@gmail.com";
    }
    
    const taskId = await queueEmail(mailOptions);
    return taskId;
  } catch (err) {
    console.error('❌ Error queueing email:', err);
    throw err;
  }
};

/**
 * Get current email queue statistics
 * @returns {Object} - Queue statistics
 */
export const getEmailQueueStats = () => {
  return {
    queued: emailQueue.length,
    running: emailQueue.running
  };
};

/**
 * Gracefully shutdown the email service
 * @returns {Promise<void>}
 */
export const shutdownEmailService = () => {
  return new Promise((resolve) => {
    emailQueue.destroy(() => {
      console.log('📪 Email queue has been shutdown gracefully');
      resolve();
    });
  });
};