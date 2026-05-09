const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendAlertEmail(to, alert) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `DURJOG Alert: ${alert.title}`,
    html: `
      <h2>${alert.title}</h2>
      <p><strong>Level:</strong> ${alert.level.toUpperCase()}</p>
      <p>${alert.description}</p>
      <p><strong>Trigger:</strong> ${alert.trigger}</p>
      <p><strong>Expires:</strong> ${new Date(alert.expiry).toLocaleString()}</p>
      <hr />
      <p>Stay safe,<br/>DURJOG Team</p>
    `
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error('Email error:', err);
  }
}

async function sendResetEmail(to, resetUrl) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'DURJOG – Password Reset Request',
    html: `
      <h2>Reset Your Password</h2>
      <p>You requested a password reset. Click the link below to set a new password. This link expires in 1 hour.</p>
      <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
    `
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Reset email sent to ${to}`);
  } catch (err) {
    console.error('Reset email error:', err);
  }
}

module.exports = { sendAlertEmail, sendResetEmail };

