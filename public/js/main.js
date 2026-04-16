// ===========================
// SWEEPER CLEANING SERVICES
// Main JavaScript
// ===========================

// Config - Update these
const CONFIG = {
  whatsapp: '919876543210', // Replace with your actual WhatsApp number (country code + number)
  businessName: 'Sweeper Cleaning Services',
  email: 'hello@sweeperclean.in',
  phone: '+91 98765 43210',
  address: 'Jalandhar, Punjab, India'
};

// ===== PAGE LOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.querySelector('.page-loader');
    if (loader) {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 500);
    }
  }, 1200);
});

// ===== NAVBAR =====
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
});

hamburger?.addEventListener('click', () => {
  navLinks?.classList.toggle('open');
  hamburger.classList.toggle('active');
});

// Close nav on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks?.classList.remove('open');
    hamburger?.classList.remove('active');
  });
});

// Active nav link based on current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  if (link.getAttribute('href') === currentPage) {
    link.classList.add('active');
  }
});

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== TOAST =====
function showToast(title, msg, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<div class="toast-title">${title}</div><div class="toast-msg">${msg}</div>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 50);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

// ===== BOOKING FORM =====
const bookingForm = document.getElementById('bookingForm');

if (bookingForm) {
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = bookingForm.querySelector('[type=submit]');
    btn.disabled = true;
    btn.innerHTML = '<span>Sending...</span>';

    const data = {
      name: document.getElementById('name')?.value,
      phone: document.getElementById('phone')?.value,
      address: document.getElementById('address')?.value,
      plan: document.getElementById('plan')?.value,
      timing: document.getElementById('timing')?.value,
      message: document.getElementById('message')?.value || ''
    };

    // Validate
    if (!data.name || !data.phone || !data.address || !data.plan || !data.timing) {
      showToast('Missing Fields', 'Please fill all required fields.', 'error');
      btn.disabled = false;
      btn.innerHTML = '<span>Book Now via WhatsApp</span> <span>→</span>';
      return;
    }

    try {
      // Submit to backend
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (result.success) {
        // Show success
        bookingForm.style.display = 'none';
        const success = document.getElementById('formSuccess');
        if (success) success.style.display = 'block';

        // Redirect to WhatsApp
        const msg = encodeURIComponent(
          `Hi! I'd like to book a cleaning service.\n\n` +
          `*Name:* ${data.name}\n` +
          `*Phone:* ${data.phone}\n` +
          `*Address:* ${data.address}\n` +
          `*Plan:* ${data.plan}\n` +
          `*Preferred Timing:* ${data.timing}\n` +
          `*Message:* ${data.message || 'None'}\n\n` +
          `Please confirm my booking. Thank you!`
        );
        setTimeout(() => {
          window.open(`https://wa.me/${CONFIG.whatsapp}?text=${msg}`, '_blank');
        }, 1500);
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    } catch (err) {
      console.error(err);
      showToast('Error', 'Something went wrong. Redirecting to WhatsApp...', 'error');
      // Fallback: direct WhatsApp
      const msg = encodeURIComponent(
        `Hi! I'd like to book a cleaning service.\n\n` +
        `*Name:* ${data.name}\n*Phone:* ${data.phone}\n*Plan:* ${data.plan}\n*Address:* ${data.address}`
      );
      setTimeout(() => {
        window.open(`https://wa.me/${CONFIG.whatsapp}?text=${msg}`, '_blank');
      }, 1500);
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<span>Book Now via WhatsApp</span> <span>→</span>';
    }
  });
}

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('[type=submit]');
    btn.disabled = true;
    btn.innerHTML = 'Sending...';

    const data = {
      name: document.getElementById('cName')?.value,
      email: document.getElementById('cEmail')?.value,
      phone: document.getElementById('cPhone')?.value,
      subject: document.getElementById('cSubject')?.value,
      message: document.getElementById('cMessage')?.value
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (result.success) {
        showToast('Message Sent! 🎉', 'We\'ll get back to you shortly.', 'success');
        contactForm.reset();
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      showToast('Error', 'Failed to send message. Please call us directly.', 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = 'Send Message';
    }
  });
}

// ===== PRICING TOGGLE =====
const toggleBtn = document.getElementById('pricingToggle');
let isAnnual = false;

const monthlyPrices = { basic: 3999, standard: 6999, premium: 11999 };
const annualPrices = { basic: 3199, standard: 5599, premium: 9599 };

if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    isAnnual = !isAnnual;
    toggleBtn.classList.toggle('annual', isAnnual);

    document.querySelectorAll('[data-plan-price]').forEach(el => {
      const plan = el.dataset.planPrice;
      const prices = isAnnual ? annualPrices : monthlyPrices;
      el.textContent = prices[plan]?.toLocaleString('en-IN') || el.textContent;
    });

    document.querySelector('.toggle-label.monthly')?.classList.toggle('active', !isAnnual);
    document.querySelector('.toggle-label.annual')?.classList.toggle('active', isAnnual);
  });
}

// ===== ADDON SELECTION =====
document.querySelectorAll('.addon-card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('selected');
    updateAddonTotal();
  });
});

function updateAddonTotal() {
  const selected = document.querySelectorAll('.addon-card.selected');
  const total = [...selected].reduce((sum, el) => sum + (parseInt(el.dataset.price) || 0), 0);
  const totalEl = document.getElementById('addonTotal');
  if (totalEl) totalEl.textContent = '₹' + total.toLocaleString('en-IN');
}

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target + (el.dataset.suffix || '');
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start) + (el.dataset.suffix || '');
    }
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      animateCounter(el, parseInt(el.dataset.target));
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// ===== WHATSAPP QUICK BOOK =====
document.querySelectorAll('.wa-book').forEach(btn => {
  btn.addEventListener('click', () => {
    const plan = btn.dataset.plan || 'a cleaning service';
    const msg = encodeURIComponent(`Hi! I'm interested in booking ${plan}. Can you help me?`);
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${msg}`, '_blank');
  });
});

// ===== SMOOTH SCROLL ANCHOR =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
