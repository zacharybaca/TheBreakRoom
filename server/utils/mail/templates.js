export function passwordResetTemplate({ name, resetUrl, minutes = 10 }) {
  return `
    <div style="font-family: system-ui, Arial, sans-serif; line-height:1.4;">
      <h2 style="margin-bottom:0.2rem">Reset your password</h2>
      <p>Hi ${name || ''},</p>
      <p>We received a request to reset your password. Click the link below to set a new password — it will expire in ${minutes} minutes.</p>
      <p><a href="${resetUrl}" target="_blank" rel="noopener noreferrer">${resetUrl}</a></p>
      <p>If you didn't request this, you can ignore this email.</p>
      <p>— The Breakroom Team</p>
    </div>
  `;
}
