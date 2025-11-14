import nodemailer from 'nodemailer';

/**
 * Send an email using Nodemailer
 * @param {string} email - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} message - Email message (HTML or plain text)
 * @param {object|null} attachment - Optional email attachment
 * @returns {Promise<void>}
 */
export async function sendEmail(email, subject, message, attachment = null) {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    throw new Error('SMTP credentials not configured');
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"EduZen" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: subject,
    text: message, // Plain text version
    html: message, // HTML version
    attachments: attachment ? [attachment] : [], // Add attachment if provided
  };

  await transporter.sendMail(mailOptions);
}

/**
 * Get a configured Nodemailer transporter instance
 * @returns {nodemailer.Transporter} Configured transporter
 */
export function getEmailTransporter() {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    throw new Error('SMTP credentials not configured');
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

