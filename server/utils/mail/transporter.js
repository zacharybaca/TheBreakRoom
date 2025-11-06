import nodemailer from 'nodemailer';

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  NODE_ENV,
} = process.env;

export function createTransporter() {
  // For development you might use Ethereal earlier
  if (NODE_ENV === 'development') {
    // optionally createTestAccount() or use the real SMTP if configured
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465, // true for 465, false for 587
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    // optional pool settings
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
  });
}
