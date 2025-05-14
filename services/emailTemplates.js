export const verificationEmail = (username, link) => ({
    subject: "Verify your email",
    html: `<h1>Hello ${username},</h1><p>Please verify your email by clicking <a href="${link}">here</a>.</p>`,
    text: `Hello ${username},\n\nPlease verify your email by visiting this link: ${link}`
  });
  
  