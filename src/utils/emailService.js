const sgMail = require("../config/sendgrid");

async function sendEmail(to, subject, text) {
  const msg = {
    to,
    from: "your-email@example.com", // Use a verified sender
    subject,
    text,
  };
  await sgMail.send(msg);
}

module.exports = { sendEmail };
