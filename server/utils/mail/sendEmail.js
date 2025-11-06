import { createTransporter } from './transporter.js';
import nodemailer from 'nodemailer';

const FROM = process.env.EMAIL_FROM || 'no-reply@example.com';

// simple text -> html helper (optional)
const toHtml = (text) => `<div style="font-family:system-ui,Arial,sans-serif">${text.replace(/\n/g,'<br/>')}</div>`;

export async function sendEmail({ to, subject, text, html = null, attachments = [] }) {
  const transporter = createTransporter();

  const mailOptions = {
    from: FROM,
    to,
    subject,
    text,
    html: html || toHtml(text),
    attachments,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    // If using Ethereal or nodemailer.getTestMessageUrl(info) you can preview
    return { success: true, info };
  } catch (err) {
    console.error('sendEmail error:', err);
    // surface meaningful error to caller, but don't leak secrets to clients
    return { success: false, error: err.message || 'Failed to send' };
  }
}
