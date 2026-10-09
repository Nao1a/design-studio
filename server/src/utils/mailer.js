import nodemailer from 'nodemailer';

export const sendContactNotificationEmail = async ({ name, email, subject, message, contactId }) => {
  const studioEmail = process.env.STUDIO_EMAIL || 'designstudio@aau.edu.et';
  const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@aau-designstudio.edu.et';

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT || 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
      <div style="border-bottom: 2px solid #0284c7; padding-bottom: 16px; margin-bottom: 20px;">
        <h2 style="color: #0f172a; margin: 0; font-size: 20px;">AAU Biomedical Design Studio</h2>
        <p style="color: #0284c7; margin: 4px 0 0 0; font-size: 14px; font-weight: 600;">New Contact Inquiry Received</p>
      </div>

      <div style="margin-bottom: 20px; background: #f8fafc; padding: 16px; border-radius: 8px;">
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #475569;"><strong>Sender Name:</strong> ${name}</p>
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #475569;"><strong>Sender Email:</strong> <a href="mailto:${email}" style="color: #0284c7;">${email}</a></p>
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #475569;"><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
        <p style="margin: 0; font-size: 14px; color: #475569;"><strong>Inquiry ID:</strong> #${contactId}</p>
      </div>

      <div style="margin-bottom: 24px;">
        <h4 style="color: #0f172a; margin: 0 0 8px 0; font-size: 15px;">Message Body:</h4>
        <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; color: #1e293b; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
          ${message}
        </div>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 12px; color: #94a3b8;">
        <p style="margin: 0;">This email was automatically dispatched to the Studio Mailbox (${studioEmail}) and Admin (${adminEmail}). You can also review this message in the Studio Admin Dashboard.</p>
      </div>
    </div>
  `;

  // If credentials are provided, dispatch via real SMTP transport
  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort),
        secure: Number(smtpPort) === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: `"AAU Studio Notification" <${smtpUser}>`,
        to: `${studioEmail}, ${adminEmail}`,
        replyTo: email,
        subject: `[Studio Inquiry] ${subject || 'New message from ' + name}`,
        html: htmlBody,
      });

      console.log(`[Email] Dispatch successful! Message ID: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error(`[Email] SMTP dispatch failed: ${err.message}`);
      return { success: false, error: err.message };
    }
  } else {
    // Development fallback simulation
    console.log(`\n======================================================`);
    console.log(`[EMAIL SIMULATION] New Contact Form Message Received`);
    console.log(`To: ${studioEmail}, ${adminEmail}`);
    console.log(`From: "${name}" <${email}>`);
    console.log(`Subject: ${subject || 'New Inquiry'}`);
    console.log(`Message: "${message.substring(0, 100)}..."`);
    console.log(`Tip: Configure SMTP_USER and SMTP_PASS in server/.env to send real emails.`);
    console.log(`======================================================\n`);
    return { success: true, simulated: true };
  }
};
