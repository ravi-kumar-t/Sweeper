/**
 * SWEEPER CLEANING SERVICES - Backend Server
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== MIDDLEWARE ====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
});

// ==================== DATA STORAGE ====================
const DATA_FILE = path.join(__dirname, 'data', 'bookings.json');
const CONTACTS_FILE = path.join(__dirname, 'data', 'contacts.json');

// Ensure data folder exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

function readData(file) {
  try {
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return [];
  }
}

function saveData(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

// ==================== ROOT CHECK ====================
app.get('/', (req, res) => {
  res.send("Sweeper API is running 🚀");
});

// ==================== BOOKING API ====================
app.post('/api/booking', (req, res) => {
  try {
    const { name, phone, address, plan, timing, message } = req.body;

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

    return res.json({
      success: true,
      message: 'Booking received!',
      bookingId: booking.id,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
});

// ==================== CONTACT API ====================
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ success: false, error: 'Name and message required.' });
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

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false });
  }
});

// ==================== ADMIN APIs ====================
app.get('/api/admin/bookings', (req, res) => {
  const bookings = readData(DATA_FILE);
  res.json({ success: true, data: bookings.reverse() });
});

app.get('/api/admin/contacts', (req, res) => {
  const contacts = readData(CONTACTS_FILE);
  res.json({ success: true, data: contacts.reverse() });
});

app.patch('/api/admin/bookings/:id', (req, res) => {
  const bookings = readData(DATA_FILE);
  const idx = bookings.findIndex(b => b.id === req.params.id);

  if (idx === -1) {
    return res.status(404).json({ success: false });
  }

  bookings[idx].status = req.body.status;
  saveData(DATA_FILE, bookings);

  res.json({ success: true });
});

// ==================== HEALTH ====================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ==================== STATIC FILES (AFTER API) ====================
app.use(express.static(path.join(__dirname, 'public')));

// ==================== FALLBACK ====================
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});