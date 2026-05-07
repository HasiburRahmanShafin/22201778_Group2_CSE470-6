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

module.exports = { sendAlertEmail };