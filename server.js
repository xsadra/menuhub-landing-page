/**
 * MENUVERSE / SMARTDINE - FULL-STACK BACKEND SERVER
 * Serves landing page showcase and processes API endpoints with live notifications
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

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from project root
app.use(express.static(path.join(__dirname)));

/**
 * 1. POST /api/newsletter
 * Capture newsletter/waitlist email, persist, and alert admin
 */
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body;

    // Validation
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

    // 1. Persist to storage
    const { subscriber, isNew } = storage.saveNewsletterSubscriber(email, metadata);

    // 2. Dispatch alert email to admin
    try {
      await mailer.sendAdminNewsletterNotification({
        email: subscriber.email,
        timestamp: subscriber.lastSubscribedAt,
        ip: metadata.ip,
        userAgent: metadata.userAgent
      });
    } catch (mailErr) {
      console.error('[API:Newsletter] Warning: Admin notification dispatch failed:', mailErr.message);
      // We still succeed because email is safely persisted in the database
    }

    return res.status(200).json({
      success: true,
      message: isNew ? 'Thank you for subscribing! Your email has been registered.' : 'Welcome back! Your subscription is active.',
      subscriber: { email: subscriber.email }
    });
  } catch (err) {
    console.error('[API:Newsletter] Server error:', err);
    return res.status(500).json({ success: false, error: 'Server error processing subscription. Please try again.' });
  }
});

/**
 * 2. POST /api/checkout
 * Capture plan purchase & venue onboarding lead, persist, and alert admin immediately
 */
app.post('/api/checkout', async (req, res) => {
  try {
    const { venueName, email, plan, tables, cuisine } = req.body;

    // Validation
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

    // 1. Persist to storage
    const savedLead = storage.saveOrderLead(leadData);

    // 2. Dispatch alert email directly to admin
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
      console.error('[API:Checkout] Warning: Admin notification dispatch failed:', mailErr.message);
      // Lead is still safely preserved in database
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
    console.error('[API:Checkout] Server error:', err);
    return res.status(500).json({ success: false, error: 'Server error processing checkout. Please try again.' });
  }
});

/**
 * 3. GET /api/health
 * System diagnostic endpoint for database and mailer status
 */
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

// Fallback: serve index.html for root or SPA paths
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start listening
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 MenuHub Full-Stack Server listening on http://localhost:${PORT}`);
  console.log(`📡 Endpoints:`);
  console.log(`   - POST /api/newsletter (Newsletter / waitlist capture)`);
  console.log(`   - POST /api/checkout   (Plan purchase / onboarding capture)`);
  console.log(`   - GET  /api/health     (Telemetry & stored leads status)`);
  console.log(`📁 Database storage active at data/submissions.json`);
  console.log(`====================================================`);
});

module.exports = app;
