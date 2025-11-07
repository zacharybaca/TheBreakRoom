import { sendEmail } from './sendEmail.js';
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Express route handler
export const sendEmailTest = async (req, res) => {
  try {
    const { to } = req.body;

    if (!to) {
      return res.status(400).json({ success: false, message: 'Missing recipient email' });
    }

    const result = await sendEmail({
      to,
      subject: 'The Breakroom Email Test',
      html: `<h2>Hello from The Breakroom!</h2><p>This is a test email sent via SendGrid.</p>`,
      text: 'Hello from The Breakroom! This is a test email sent via SendGrid.',
    });

    if (result.success) {
      return res.json({ success: true, message: 'Email sent successfully!' });
    } else {
      return res.status(500).json({ success: false, message: result.error });
    }
  } catch (error) {
    console.error('Error in sendEmailTest:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
