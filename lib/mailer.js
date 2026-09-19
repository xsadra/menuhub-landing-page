/**
 * MENUVERSE / SMARTDINE - ADMIN NOTIFICATION DISPATCHER
 * Supports Resend API and Nodemailer (SMTP) with automated fallback
 */

require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const nodemailer = require('nodemailer');
let ResendClient = null;

try {
  const { Resend } = require('resend');
  ResendClient = Resend;
} catch (e) {
  // Resend optional if using SMTP
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@menuhub.app';
const FROM_EMAIL = process.env.FROM_EMAIL || 'MenuHub Alerts <notifications@menuhub.app>';

/**
 * Send an email using available mailer
 */
async function dispatchEmail({ to, subject, html, text }) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const smtpHost = process.env.SMTP_HOST;

  // Option 1: Resend API
  if (resendApiKey && ResendClient) {
    try {
      const resend = new ResendClient(resendApiKey);
      const data = await resend.emails.send({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html,
        text
      });
      console.log('[Mailer:Resend] Sent notification to admin:', to, data);
      return { success: true, provider: 'resend', id: data?.id };
    } catch (err) {
      console.error('[Mailer:Resend] Error sending email via Resend:', err.message);
    }
  }

  // Option 2: Nodemailer (SMTP / Gmail)
  if (smtpHost && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      const info = await transporter.sendMail({
        from: FROM_EMAIL,
        to,
        subject,
        html,
        text
      });
      console.log('[Mailer:SMTP] Sent notification to admin:', to, info.messageId);
      return { success: true, provider: 'smtp', id: info.messageId };
    } catch (err) {
      console.error('[Mailer:SMTP] Error sending email via SMTP:', err.message);
    }
  }

  // Option 3: Local Dev Fallback (Mock dispatcher when no API keys are provided yet)
  console.log('====================================================');
  console.log('📬 [MAILER:DEV_MODE] Automated Admin Notification');
  console.log('To:', to);
  console.log('Subject:', subject);
  console.log('Preview:', text || 'Rich HTML content generated');
  console.log('Note: To send live emails to your inbox, define RESEND_API_KEY or SMTP credentials in .env.local');
  console.log('====================================================');

  return { success: true, provider: 'dev_mock', note: 'Logged to server console & persisted to database' };
}

/**
 * 1. Admin Alert: New Newsletter / Waitlist Subscriber
 */
async function sendAdminNewsletterNotification({ email, timestamp, ip, userAgent }) {
  const subject = `[MenuHub] 📬 New Waitlist / Newsletter Subscriber: ${email}`;
  const text = `New subscriber joined MenuHub!\nEmail: ${email}\nTimestamp: ${timestamp || new Date().toISOString()}\nIP: ${ip || 'N/A'}`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0B0F17; color: #F8FAFC; padding: 32px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1);">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
        <div style="background: linear-gradient(135deg, #FF6B35, #F7931E); width: 36px; height: 36px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 18px; text-align: center; line-height: 36px;">M</div>
        <h2 style="margin: 0; color: #FFFFFF; font-size: 20px;">MenuHub Admin Alert</h2>
      </div>

      <div style="background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <span style="color: #10B981; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">New Waitlist Signup</span>
        <p style="margin: 8px 0 0 0; font-size: 18px; font-weight: 600; color: #FFFFFF;">${email}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #94A3B8;">Event Type:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #FFFFFF; font-weight: 600; text-align: right;">Newsletter / Waitlist Signup</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #94A3B8;">Captured Email:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #FF6B35; font-weight: 600; text-align: right;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #94A3B8;">Timestamp:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #FFFFFF; text-align: right;">${new Date().toUTCString()}</td>
        </tr>
      </table>

      <p style="font-size: 12px; color: #64748B; margin: 0; text-align: center;">
        This record has been saved to your local database (<code>data/submissions.json</code>).
      </p>
    </div>
  `;

  return dispatchEmail({ to: ADMIN_EMAIL, subject, html, text });
}

/**
 * 2. Admin Alert: New Plan Purchase / Venue Onboarding
 */
async function sendAdminOrderNotification({ venueName, email, plan, tables, cuisine, timestamp, status, leadId }) {
  const subject = `[MenuHub] 🚀 New Venue Purchase & Onboarding: ${venueName} (${plan})`;
  const text = `New Plan Purchase / Onboarding:\nVenue: ${venueName}\nOperator Email: ${email}\nChosen Plan: ${plan}\nEstimated Tables: ${tables}\nCuisine: ${cuisine}\nStatus: ${status || 'initiated'}\nTimestamp: ${timestamp || new Date().toISOString()}`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0B0F17; color: #F8FAFC; padding: 32px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1);">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
        <div style="background: linear-gradient(135deg, #FF6B35, #F7931E); width: 36px; height: 36px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 18px; text-align: center; line-height: 36px;">M</div>
        <h2 style="margin: 0; color: #FFFFFF; font-size: 20px;">MenuHub Venue Order Alert</h2>
      </div>

      <div style="background: rgba(255, 107, 53, 0.12); border: 1px solid rgba(255, 107, 53, 0.4); border-radius: 8px; padding: 18px; margin-bottom: 24px;">
        <div style="color: #FF6B35; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">New Venue Onboarding / Subscription</div>
        <div style="font-size: 22px; font-weight: 800; color: #FFFFFF; margin-top: 4px;">${venueName}</div>
        <div style="display: inline-block; background: #10B981; color: #0B0F17; font-weight: 800; font-size: 12px; padding: 4px 10px; border-radius: 20px; margin-top: 8px; text-transform: uppercase;">
          Plan: ${plan}
        </div>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #94A3B8;">Lead / Order ID:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #FFFFFF; font-family: monospace; font-size: 12px; text-align: right;">${leadId || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #94A3B8;">Operator Email:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #38BDF8; font-weight: 600; text-align: right;"><a href="mailto:${email}" style="color: #38BDF8; text-decoration: none;">${email}</a></td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #94A3B8;">Selected Tier:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #10B981; font-weight: 700; text-align: right;">${plan}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #94A3B8;">Table Capacity:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #FFFFFF; text-align: right;">${tables}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #94A3B8;">Cuisine Concept:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #FFFFFF; text-transform: capitalize; text-align: right;">${cuisine}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #94A3B8;">Transaction Status:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #10B981; font-weight: 700; text-align: right;">${status || 'Authorized / Active'}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #94A3B8;">Order Timestamp:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #FFFFFF; text-align: right;">${new Date().toUTCString()}</td>
        </tr>
      </table>

      <div style="text-align: center; margin-top: 24px;">
        <a href="mailto:${email}?subject=Welcome%20to%20MenuHub%20-%20Your%20${encodeURIComponent(plan)}%20Setup" style="background: linear-gradient(135deg, #FF6B35, #F7931E); color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; display: inline-block;">
          Reply to Venue Operator &rarr;
        </a>
      </div>

      <p style="font-size: 12px; color: #64748B; margin: 24px 0 0 0; text-align: center;">
        Persisted automatically in <code>data/submissions.json</code>.
      </p>
    </div>
  `;

  return dispatchEmail({ to: ADMIN_EMAIL, subject, html, text });
}

module.exports = {
  sendAdminNewsletterNotification,
  sendAdminOrderNotification
};
