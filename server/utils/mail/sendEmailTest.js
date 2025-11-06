import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function testEmail() {
  try {
    await sgMail.send({
      to: 'yourpersonalemail@example.com',
      from: 'no-reply@zachary-baca.dev',
      subject: 'Test Email from The Breakroom',
      html: '<strong>If you received this, SendGrid is working ✅</strong>',
    });
    console.log('✅ Email sent successfully');
  } catch (error) {
    console.error('❌ Error sending email:', error.response?.body || error);
  }
}

testEmail();
