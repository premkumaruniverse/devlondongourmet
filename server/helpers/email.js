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

async function sendResetPasswordEmail(toEmail, resetLink) {
  const transport = getTransport();
  const from =
    process.env.FROM_EMAIL ||
    process.env.ADMIN_EMAIL ||
    "no-reply@londongourmet.com";

  const html = `
    <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; background: #fffdf7; border: 1px solid #f5c94c; border-radius: 12px; padding: 40px;">
      <h2 style="color: #b45309; text-align: center; margin-top: 0;">London Gourmet</h2>
      <h3 style="color: #1a1a1a;">Reset Your Password</h3>
      <p style="color: #444; line-height: 1.6;">
        We received a request to reset the password for your London Gourmet account associated with this email address.
        If you did not make this request, you can safely ignore this email.
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetLink}"
           style="background: #b45309; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p style="color: #888; font-size: 13px;">This link expires in <strong>1 hour</strong>.</p>
      <p style="color: #888; font-size: 13px;">
        If the button above doesn't work, copy and paste this URL into your browser:<br/>
        <a href="${resetLink}" style="color: #b45309; word-break: break-all;">${resetLink}</a>
      </p>
      <hr style="border: none; border-top: 1px solid #f5c94c; margin: 24px 0;" />
      <p style="color: #bbb; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} London Gourmet. All rights reserved.</p>
    </div>
  `;

  if (!transport) {
    console.log("⚠️  SMTP not configured — reset link (for testing):", resetLink);
    return { skipped: true };
  }

  const info = await transport.sendMail({
    from,
    to: toEmail,
    subject: "Reset your London Gourmet password",
    html,
  });
  return info;
}

module.exports = { sendAdminEmail, sendResetPasswordEmail };
