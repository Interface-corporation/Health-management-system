export const verificationEmail = (verificationUrl) => `
  <div>
    <h2>Welcome to Our Platform!</h2>
    <p>Please click the link below to verify your email address:</p>
    <a href="${verificationUrl}">Verify Email</a>
    <p>If you didn't create an account, please ignore this email.</p>
  </div>
`

export const passwordResetEmail = (resetUrl) => `
  <div>
    <h2>Password Reset Request</h2>
    <p>You requested to reset your password. Click the link below to proceed:</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>If you didn't request this, please ignore this email.</p>
  </div>
`
