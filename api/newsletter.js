/**
 * Serverless handler: POST /api/newsletter
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
    const { email } = req.body || {};

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, error: 'Email is required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
    }

    const metadata = {
      ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
      userAgent: req.headers['user-agent'],
      source: 'serverless_newsletter'
    };

    const { subscriber, isNew } = storage.saveNewsletterSubscriber(email, metadata);

    try {
      await mailer.sendAdminNewsletterNotification({
        email: subscriber.email,
        timestamp: subscriber.lastSubscribedAt,
        ip: metadata.ip,
        userAgent: metadata.userAgent
      });
    } catch (err) {
      console.warn('[serverless:newsletter] Notification failed:', err.message);
    }

    return res.status(200).json({
      success: true,
      message: isNew ? 'Thank you for subscribing! Your email has been registered.' : 'Welcome back! Your subscription is active.',
      subscriber: { email: subscriber.email }
    });
  } catch (err) {
    console.error('[serverless:newsletter] Handler error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
};
