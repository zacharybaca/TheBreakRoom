import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async ({ to, subject, html, text }) => {
  const msg = {
    to,
    from: process.env.EMAIL_FROM,
    subject,
    text,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Email sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error("❌ SendGrid error:", error.response?.body || error.message);
    return { success: false, error: error.message };
  }
};
