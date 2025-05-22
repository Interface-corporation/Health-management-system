import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create email templates directory if it doesn't exist
const templatesDir = path.join(__dirname, '../assets/email-templates');
if (!fs.existsSync(templatesDir)) {
    fs.mkdirSync(templatesDir, { recursive: true });
}

// Create transporter
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Email queue to handle failed emails
const emailQueue = [];
let isProcessing = false;

// Process email queue
const processEmailQueue = async () => {
    if (isProcessing || emailQueue.length === 0) return;

    isProcessing = true;
    const emailData = emailQueue.shift();

    try {
        await transporter.sendMail(emailData.mailOptions);
        console.log(`Email sent successfully to: ${emailData.mailOptions.to}`);

        // Process next email in queue
        isProcessing = false;
        processEmailQueue();
    } catch (error) {
        console.error(`Failed to send email to ${emailData.mailOptions.to}:`, error);

        // Retry logic
        if (emailData.retries < 3) {
            emailData.retries += 1;
            emailQueue.push(emailData);
        } else {
            console.error(`Max retries reached for email to ${emailData.mailOptions.to}`);
        }

        isProcessing = false;
        setTimeout(processEmailQueue, 5000); // Wait 5 seconds before retrying
    }
};

// Email templates
const templates = {
    verification: (token, username) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verify Your Email</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 20px;
        }
        .header {
          background-color: #4CAF50;
          color: white;
          padding: 10px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          padding: 20px;
        }
        .button {
          display: inline-block;
          background-color: #4CAF50;
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 5px;
          margin-top: 20px;
        }
        .footer {
          margin-top: 20px;
          font-size: 12px;
          color: #777;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Health Staff Manager</h2>
        </div>
        <div class="content">
          <h3>Hello ${username || 'there'},</h3>
          <p>Thank you for registering with Health Staff Manager. Please verify your email address to complete your registration.</p>
          <p><a href="${process.env.APP_URL}/verify-email?token=${token}" class="button">Verify Email</a></p>
          <p>If the button above doesn't work, you can copy and paste the following link into your browser:</p>
          <p>${process.env.APP_URL}/verify-email?token=${token}</p>
          <p>This link will expire in 24 hours.</p>
          <p>Best regards,<br>The Health Staff Manager Team</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Health Staff Manager. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

    passwordReset: (token, username) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reset Your Password</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 20px;
        }
        .header {
          background-color: #3498db;
          color: white;
          padding: 10px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          padding: 20px;
        }
        .button {
          display: inline-block;
          background-color: #3498db;
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 5px;
          margin-top: 20px;
        }
        .footer {
          margin-top: 20px;
          font-size: 12px;
          color: #777;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Health Staff Manager</h2>
        </div>
        <div class="content">
          <h3>Hello ${username || 'there'},</h3>
          <p>We received a request to reset your password. If you didn't make this request, you can ignore this email.</p>
          <p>To reset your password, click the button below:</p>
          <p><a href="${process.env.APP_URL}/reset-password?token=${token}" class="button">Reset Password</a></p>
          <p>If the button above doesn't work, you can copy and paste the following link into your browser:</p>
          <p>${process.env.APP_URL}/reset-password?token=${token}</p>
          <p>This link will expire in 1 hour.</p>
          <p>Best regards,<br>The Health Staff Manager Team</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Health Staff Manager. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

    welcome: (username) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to Health Staff Manager</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 20px;
        }
        .header {
          background-color: #673AB7;
          color: white;
          padding: 10px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          padding: 20px;
        }
        .button {
          display: inline-block;
          background-color: #673AB7;
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 5px;
          margin-top: 20px;
        }
        .footer {
          margin-top: 20px;
          font-size: 12px;
          color: #777;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Health Staff Manager</h2>
        </div>
        <div class="content">
          <h3>Welcome, ${username || 'there'}!</h3>
          <p>Thank you for joining Health Staff Manager. We're excited to have you on board!</p>
          <p>Your account has been successfully created and is now ready to use.</p>
          <p><a href="${process.env.APP_URL}/login" class="button">Log In to Your Account</a></p>
          <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          <p>Best regards,<br>The Health Staff Manager Team</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Health Staff Manager. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
};

// Send email function
const sendEmail = async (to, subject, htmlContent) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html: htmlContent
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);

        // Add to retry queue
        emailQueue.push({
            mailOptions,
            retries: 0
        });

        // Start processing queue if not already processing
        if (!isProcessing) {
            processEmailQueue();
        }

        return false;
    }
};

// Email service methods
export const emailService = {
    // Send verification email
    sendVerificationEmail: async (email, token, username) => {
        const subject = 'Verify Your Email - Health Staff Manager';
        const htmlContent = templates.verification(token, username);
        return await sendEmail(email, subject, htmlContent);
    },

    // Send password reset email
    sendPasswordResetEmail: async (email, token, username) => {
        const subject = 'Password Reset Request - Health Staff Manager';
        const htmlContent = templates.passwordReset(token, username);
        return await sendEmail(email, subject, htmlContent);
    },

    // Send welcome email
    sendWelcomeEmail: async (email, username) => {
        const subject = 'Welcome to Health Staff Manager';
        const htmlContent = templates.welcome(username);
        return await sendEmail(email, subject, htmlContent);
    },

    // Custom email
    sendCustomEmail: async (email, subject, htmlContent) => {
        return await sendEmail(email, subject, htmlContent);
    }
};

export default emailService;