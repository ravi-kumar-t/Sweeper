# 🧹 Sweeper Cleaning Services — Website

A fully functional, multi-page business website for Sweeper Cleaning Services with Node.js backend.

---

## 📁 Project Structure

```
sweeper/
├── public/               ← Frontend (HTML, CSS, JS)
│   ├── index.html        ← Home page
│   ├── services.html     ← Services page
│   ├── pricing.html      ← Pricing page
│   ├── booking.html      ← Booking form page
│   ├── about.html        ← About Us page
│   ├── contact.html      ← Contact page
│   ├── css/
│   │   └── style.css     ← All styles
│   └── js/
│       └── main.js       ← All frontend JavaScript
├── data/                 ← Auto-created: stores bookings & contacts JSON
├── server.js             ← Node.js + Express backend
├── package.json
└── README.md
```

---

## 🚀 How to Run

### Step 1 — Install Node.js
Download and install Node.js from: https://nodejs.org (LTS version recommended)

### Step 2 — Install Dependencies
Open a terminal in the `sweeper` folder and run:
```bash
npm install
```

### Step 3 — Start the Server
```bash
npm start
```

### Step 4 — Open in Browser
Visit: **http://localhost:3000**

---

## ⚙️ Configuration (IMPORTANT — Do This First!)

### 1. Update Your WhatsApp Number
Open `public/js/main.js` and find:
```js
const CONFIG = {
  whatsapp: '919876543210',   // ← Replace with YOUR number (country code + number, no spaces or +)
  ...
}
```

Also update the WhatsApp links in each HTML file — search for `919876543210` and replace.

### 2. Update Contact Information
In each HTML file, update:
- Phone number: `+91 98765 43210`
- Email: `hello@sweeperclean.in`
- Address: `Jalandhar, Punjab, India`

---

## 📋 Features

- ✅ **6 Pages**: Home, Services, Pricing, Booking, About, Contact
- ✅ **Booking Form** → saves to JSON + redirects to WhatsApp
- ✅ **Contact Form** → saves to JSON file
- ✅ **Admin API** → view all bookings/contacts
- ✅ **Mobile Responsive** → works on all screen sizes
- ✅ **Floating WhatsApp Button** → on every page
- ✅ **Pricing Toggle** → monthly/annual billing toggle
- ✅ **Add-on Selection** → interactive add-on cards
- ✅ **FAQ Accordion** → on pricing page
- ✅ **Scroll Animations** → smooth reveal on scroll
- ✅ **Page Loader** → professional loading screen
- ✅ **Counter Animation** → numbers count up on view
- ✅ **Toast Notifications** → success/error feedback

---

## 🌐 Deploying to the Web

### Option A — Render.com (FREE, Recommended)
1. Push your code to GitHub
2. Go to https://render.com → New Web Service
3. Connect your GitHub repo
4. Set Build Command: `npm install`
5. Set Start Command: `npm start`
6. Deploy! You get a free `.onrender.com` URL

### Option B — Railway.app (FREE)
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Set start command: `npm start`
4. Railway auto-detects Node.js

### Option C — VPS / cPanel (Linux Hosting)
1. Upload all files via FTP/File Manager
2. SSH into server, run `npm install && pm2 start server.js`
3. Configure your domain via Nginx proxy

---

## 📊 Viewing Submitted Bookings

Visit these URLs (local):
- **All Bookings**: http://localhost:3000/api/admin/bookings
- **All Contacts**: http://localhost:3000/api/admin/contacts

> ⚠️ In production, protect these routes with authentication!

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js + Express |
| Storage | JSON files (upgrade to MongoDB for scale) |
| Fonts | Google Fonts (Playfair Display + DM Sans) |

---

## 💡 Tips

- Replace placeholder phone numbers in HTML files
- Add a real Google Maps embed in the contact page
- Consider adding a payment gateway (Razorpay) for online payments
- For production, use MongoDB instead of JSON files
- Add email notifications using Nodemailer for booking alerts

---

Made with ❤️ for Sweeper Cleaning Services, Jalandhar, Punjab
