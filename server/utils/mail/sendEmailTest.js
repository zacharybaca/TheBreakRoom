import { sendEmail } from './sendEmail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const testEmail = async () => {
  const { to } = req.body;

  if (!to) return res.status(400).json({ success: false, message: 'Missing recipient email' });

  const result = await sendEmail({
    to,
    subject: 'The Breakroom Email Test',
    html: `<h2>Hello from The Breakroom!</h2><p>This is a test email sent via SendGrid.</p>`,
    text: 'Hello from The Breakroom! This is a test email sent via SendGrid.',
  });

  if (result.success) {
    res.json({ success: true, message: 'Email sent successfully!' });
  } else {
    res.status(500).json({ success: false, message: result.error });
  }
}
