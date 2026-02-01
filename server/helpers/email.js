const nodemailer = require("nodemailer");

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    return null;
  }
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

async function sendAdminEmail(subject, html, fromEmail, replyToEmail, userEmail) {
  const transport = getTransport();
  if (!transport) {
    return { skipped: true };
  }
  const to = process.env.ADMIN_EMAIL;
  const from =
    fromEmail ||
    userEmail ||
    process.env.FROM_EMAIL ||
    process.env.ADMIN_EMAIL ||
    "no-reply@example.com";
  const info = await transport.sendMail({
    from,
    to,
    subject,
    html,
    replyTo: replyToEmail || fromEmail || undefined,
  });
  return info;
}

module.exports = { sendAdminEmail };
