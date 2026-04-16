/**
 * SWEEPER CLEANING SERVICES - Backend Server
 * Node.js + Express
 * 
 * Run: npm install && node server.js
 * Open: http://localhost:3000
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== MIDDLEWARE ====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Basic security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
});

// ==================== DATA STORAGE ====================
// Simple JSON file storage — replace with a real database (MongoDB/MySQL) for production
const DATA_FILE = path.join(__dirname, 'data', 'bookings.json');
const CONTACTS_FILE = path.join(__dirname, 'data', 'contacts.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

function readData(file) {
  try {
    if (!fs.existsSync(file)) return [];
    const raw = fs.readFileSync(file, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveData(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

// ==================== BOOKING API ====================
app.post('/api/booking', (req, res) => {
  try {
    const { name, phone, address, plan, timing, message } = req.body;

    // Validation
    if (!name || !phone || !address || !plan || !timing) {
      return res.status(400).json({ success: false, error: 'Missing required fields.' });
    }

    if (phone.replace(/\D/g, '').length < 10) {
      return res.status(400).json({ success: false, error: 'Invalid phone number.' });
    }

    const booking = {
      id: 'BK' + Date.now(),
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      plan: plan.trim(),
      timing: timing.trim(),
      message: message?.trim() || '',
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    const bookings = readData(DATA_FILE);
    bookings.push(booking);
    saveData(DATA_FILE, bookings);

    console.log(`✅ New Booking [${booking.id}]:`, booking.name, '-', booking.plan);

    return res.json({
      success: true,
      message: 'Booking received! Redirecting to WhatsApp...',
      bookingId: booking.id,
    });
  } catch (err) {
    console.error('Booking error:', err);
    return res.status(500).json({ success: false, error: 'Server error. Please try again.' });
  }
});

// ==================== CONTACT API ====================
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ success: false, error: 'Name and message are required.' });
    }

    const contact = {
      id: 'CT' + Date.now(),
      name: name.trim(),
      email: email?.trim() || '',
      phone: phone?.trim() || '',
      subject: subject?.trim() || 'General Inquiry',
      message: message.trim(),
      status: 'Unread',
      createdAt: new Date().toISOString(),
    };

    const contacts = readData(CONTACTS_FILE);
    contacts.push(contact);
    saveData(CONTACTS_FILE, contacts);

    console.log(`📩 New Contact [${contact.id}]:`, contact.name, '-', contact.subject);

    return res.json({ success: true, message: 'Message received! We\'ll get back to you soon.' });
  } catch (err) {
    console.error('Contact error:', err);
    return res.status(500).json({ success: false, error: 'Server error. Please try again.' });
  }
});

// ==================== ADMIN API ====================
// Simple admin dashboard to view bookings (protect this with auth in production)
app.get('/api/admin/bookings', (req, res) => {
  const bookings = readData(DATA_FILE);
  res.json({ success: true, count: bookings.length, data: bookings.reverse() });
});

app.get('/api/admin/contacts', (req, res) => {
  const contacts = readData(CONTACTS_FILE);
  res.json({ success: true, count: contacts.length, data: contacts.reverse() });
});

// Update booking status
app.patch('/api/admin/bookings/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const bookings = readData(DATA_FILE);
    const idx = bookings.findIndex(b => b.id === id);
    if (idx === -1) return res.status(404).json({ success: false, error: 'Booking not found' });
    bookings[idx].status = status;
    bookings[idx].updatedAt = new Date().toISOString();
    saveData(DATA_FILE, bookings);
    res.json({ success: true, data: bookings[idx] });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ==================== HEALTH CHECK ====================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==================== ADMIN PAGE ROUTES ====================
app.get(['/admin', '/admin.html', '/admin.html/*', '/admin/*'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// ==================== FALLBACK ====================
// All other routes serve index.html (SPA-friendly)
app.get('*', (req, res) => {
  const file = req.path.replace(/^\//, '') || 'index.html';
  const fullPath = path.join(__dirname, 'public', file);

  if (fs.existsSync(fullPath) && file.endsWith('.html')) {
    res.sendFile(fullPath);
  } else {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log('');
  console.log('🧹 ===================================');
  console.log('🧹  SWEEPER CLEANING SERVICES');
  console.log('🧹 ===================================');
  console.log(`🌐  Website: http://localhost:${PORT}`);
  console.log(`📋  Bookings API: http://localhost:${PORT}/api/admin/bookings`);
  console.log(`📩  Contacts API: http://localhost:${PORT}/api/admin/contacts`);
  console.log('🧹 ===================================');
  console.log('');
});

module.exports = app;
