/**
 * MenuHub Landing Page & Lead Capture Server
 *
 * @author Sadra Babai
 * @maintainer Sadra Babai
 */

require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');

const storage = require('./lib/storage');
const mailer = require('./lib/mailer');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// POST /api/newsletter
// TODO: hook up rate-limiting middleware if bot submissions spike
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, error: 'Email is required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
    }

    const metadata = {
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
      source: 'footer_newsletter'
    };

    const { subscriber, isNew } = storage.saveNewsletterSubscriber(email, metadata);

    // Non-blocking notification dispatch
    try {
      await mailer.sendAdminNewsletterNotification({
        email: subscriber.email,
        timestamp: subscriber.lastSubscribedAt,
        ip: metadata.ip,
        userAgent: metadata.userAgent
      });
    } catch (mailErr) {
      console.warn('[api/newsletter] Notification dispatch failed:', mailErr.message);
    }

    return res.status(200).json({
      success: true,
      message: isNew ? 'Thank you for subscribing! Your email has been registered.' : 'Welcome back! Your subscription is active.',
      subscriber: { email: subscriber.email }
    });
  } catch (err) {
    console.error('[api/newsletter] Handler error:', err);
    return res.status(500).json({ success: false, error: 'Server error processing subscription. Please try again.' });
  }
});

// POST /api/checkout
app.post('/api/checkout', async (req, res) => {
  try {
    const { venueName, email, plan, tables, cuisine } = req.body;

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
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
        timestamp: new Date().toISOString()
      }
    };

    const savedLead = storage.saveOrderLead(leadData);

    // Lead is committed to disk; notification failures shouldn't block client response
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
    } catch (mailErr) {
      console.warn('[api/checkout] Notification dispatch failed:', mailErr.message);
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
    console.error('[api/checkout] Handler error:', err);
    return res.status(500).json({ success: false, error: 'Server error processing checkout. Please try again.' });
  }
});

// GET /api/health - telemetry & probe status
app.get('/api/health', (req, res) => {
  const data = storage.getSubmissions();
  res.status(200).json({
    status: 'operational',
    service: 'MenuHub Data & Notification API',
    uptime: process.uptime(),
    stats: {
      newsletterSubscribersCount: data.newsletterSubscribers.length,
      orderLeadsCount: data.orderLeads.length,
      lastDatabaseUpdate: data.updatedAt
    },
    config: {
      hasResendApiKey: Boolean(process.env.RESEND_API_KEY),
      hasSmtpConfig: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER),
      adminContactConfigured: Boolean(process.env.ADMIN_EMAIL)
    }
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`MenuHub dev server listening on http://localhost:${PORT}`);
});

module.exports = app;
