/**
 * Serverless handler: POST /api/checkout
 *
 * @author Sadra Babai
 * @maintainer Sadra Babai
 */

const storage = require('../lib/storage');
const mailer = require('../lib/mailer');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { venueName, email, plan, tables, cuisine } = req.body || {};

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, error: 'Business email is required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, error: 'Please enter a valid business email address.' });
    }

    if (!venueName || typeof venueName !== 'string' || !venueName.trim()) {
      return res.status(400).json({ success: false, error: 'Restaurant / Venue name is required.' });
    }

    const leadData = {
      venueName: venueName.trim(),
      email: email.trim().toLowerCase(),
      plan: plan || 'Premium Subscription',
      tables: tables || '11-25 Tables',
      cuisine: cuisine || 'general',
      status: 'active_lead',
      metadata: {
        ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
        userAgent: req.headers['user-agent'],
        timestamp: new Date().toISOString()
      }
    };

    const savedLead = storage.saveOrderLead(leadData);

    try {
      await mailer.sendAdminOrderNotification({
        leadId: savedLead.id,
        venueName: savedLead.venueName,
        email: savedLead.email,
        plan: savedLead.plan,
        tables: savedLead.tables,
        cuisine: savedLead.cuisine,
        status: savedLead.status,
        timestamp: savedLead.createdAt
      });
    } catch (err) {
      console.warn('[serverless:checkout] Notification failed:', err.message);
    }

    return res.status(200).json({
      success: true,
      message: `Sandbox successfully provisioned for ${savedLead.venueName}! Access credentials dispatched to ${savedLead.email}.`,
      lead: {
        id: savedLead.id,
        venueName: savedLead.venueName,
        plan: savedLead.plan
      }
    });
  } catch (err) {
    console.error('[serverless:checkout] Handler error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
};
