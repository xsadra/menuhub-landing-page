/**
 * Local JSON persistence for leads and subscriptions
 *
 * @author Sadra Babai
 * @maintainer Sadra Babai
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'submissions.json');

// TODO: Swap out for Postgres / SQLite once multi-instance hosting is configured
function initStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
      newsletterSubscribers: [],
      orderLeads: [],
      updatedAt: new Date().toISOString()
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf8');
  }
}

function readData() {
  initStorage();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('[storage] Failed reading database JSON, fallback to empty:', err.message);
    return { newsletterSubscribers: [], orderLeads: [], updatedAt: new Date().toISOString() };
  }
}

// Atomic file swap prevents corrupted state on sudden process termination
function writeData(data) {
  initStorage();
  data.updatedAt = new Date().toISOString();
  const tempFile = `${DATA_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tempFile, DATA_FILE);
}

function saveNewsletterSubscriber(email, metadata = {}) {
  const data = readData();
  const normalizedEmail = email.trim().toLowerCase();

  const existing = data.newsletterSubscribers.find(s => s.email === normalizedEmail);
  if (existing) {
    existing.lastSubscribedAt = new Date().toISOString();
    existing.subscriptionCount = (existing.subscriptionCount || 1) + 1;
    existing.metadata = { ...existing.metadata, ...metadata };
    writeData(data);
    return { subscriber: existing, isNew: false };
  }

  const newSubscriber = {
    id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email: normalizedEmail,
    createdAt: new Date().toISOString(),
    lastSubscribedAt: new Date().toISOString(),
    status: 'active',
    metadata
  };

  data.newsletterSubscribers.unshift(newSubscriber);
  writeData(data);
  return { subscriber: newSubscriber, isNew: true };
}

function saveOrderLead(leadDetails) {
  const data = readData();

  const newLead = {
    id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    venueName: leadDetails.venueName ? leadDetails.venueName.trim() : 'Unnamed Venue',
    email: leadDetails.email ? leadDetails.email.trim().toLowerCase() : '',
    plan: leadDetails.plan || 'Free Tier',
    tables: leadDetails.tables || '11-25 Tables',
    cuisine: leadDetails.cuisine || 'general',
    status: leadDetails.status || 'initiated',
    createdAt: new Date().toISOString(),
    metadata: leadDetails.metadata || {}
  };

  data.orderLeads.unshift(newLead);
  writeData(data);
  return newLead;
}

function getSubmissions() {
  return readData();
}

module.exports = {
  saveNewsletterSubscriber,
  saveOrderLead,
  getSubmissions
};
