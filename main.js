/**
 * COCA-COLA ZERO SUGAR - LANDING PAGE INTERACTIVE LOGIC
 * Includes Meta Pixel event tracking, interactive widgets, timers, and modals.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCountdown();
  initChillMeter();
  initStoreLocator();
  initFaqAccordion();
  initCouponModal();
  initSocialProofToast();
  initScrollAnimations();
});

/* --------------------------------------------------------------------------
   1. NAVBAR & MOBILE DRAWER LOGIC
   -------------------------------------------------------------------------- */
function initNavbar() {
  const header = document.getElementById('header');
  const toggleBtn = document.getElementById('mobileNavToggle');
  const drawer = document.getElementById('mobileDrawer');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header background shift on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Toggle mobile drawer
  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      drawer.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('active');
      });
    });
  }
}

/* --------------------------------------------------------------------------
   2. COUNTDOWN TIMER (24-Hour Urgency Counter)
   -------------------------------------------------------------------------- */
function initCountdown() {
  const hoursEl = document.getElementById('timerHours');
  const minutesEl = document.getElementById('timerMinutes');
  const secondsEl = document.getElementById('timerSeconds');

  if (!hoursEl || !minutesEl || !secondsEl) return;

  // Set counter target to 14h 32m 45s from current load time
  let totalSeconds = 14 * 3600 + 32 * 60 + 45;

  function updateTimer() {
    if (totalSeconds <= 0) {
      totalSeconds = 24 * 3600; // reset loop
    }

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    hoursEl.textContent = String(h).padStart(2, '0');
    minutesEl.textContent = String(m).padStart(2, '0');
    secondsEl.textContent = String(s).padStart(2, '0');

    totalSeconds--;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* --------------------------------------------------------------------------
   3. INTERACTIVE CHILL METER SLIDER
   -------------------------------------------------------------------------- */
function initChillMeter() {
  const slider = document.getElementById('chillSlider');
  const statusEl = document.getElementById('chillStatus');
  const degreesEl = document.getElementById('chillDegrees');

  if (!slider || !statusEl || !degreesEl) return;

  slider.addEventListener('input', (e) => {
    const temp = parseInt(e.target.value, 10);
    degreesEl.textContent = `${temp}°F (${Math.round((temp - 32) * 5 / 9)}°C)`;

    if (temp <= 37) {
      statusEl.textContent = '❄️ PERFECT ICE-COLD SERVE!';
      statusEl.style.background = 'rgba(228, 30, 43, 0.25)';
      statusEl.style.borderColor = 'var(--coke-red)';
    } else if (temp <= 42) {
      statusEl.textContent = '🥤 Crisp & Cool';
      statusEl.style.background = 'rgba(0, 114, 255, 0.2)';
      statusEl.style.borderColor = '#0072FF';
    } else {
      statusEl.textContent = '🌡️ Needs More Chill!';
      statusEl.style.background = 'rgba(255, 153, 0, 0.2)';
      statusEl.style.borderColor = '#FF9900';
    }
  });
}

/* --------------------------------------------------------------------------
   4. STORE LOCATOR ZIP SEARCH SIMULATION
   -------------------------------------------------------------------------- */
function initStoreLocator() {
  const searchBtn = document.getElementById('storeSearchBtn');
  const inputEl = document.getElementById('storeZipInput');
  const resultsContainer = document.getElementById('storeResultsGrid');

  if (!searchBtn || !inputEl || !resultsContainer) return;

  const mockStores = [
    { name: 'Walmart Supercenter', dist: '0.8 miles away', status: 'In Stock (12-Packs & Bottles)' },
    { name: 'Target Center', dist: '1.4 miles away', status: 'In Stock (Zero Sugar Cans)' },
    { name: 'Kroger Fresh Market', dist: '2.1 miles away', status: 'In Stock (2-For-1 Promo Ready)' },
    { name: '7-Eleven Convenience', dist: '0.4 miles away', status: 'In Stock (Cold Singles)' }
  ];

  function performSearch() {
    const query = inputEl.value.trim();
    if (!query) {
      alert('Please enter a zip code or city.');
      return;
    }

    resultsContainer.innerHTML = mockStores.map(store => `
      <div class="store-item">
        <div class="store-name">${store.name}</div>
        <div style="font-size: 0.85rem; color: var(--coke-gray-300); margin-bottom: 0.4rem;">📍 ${store.dist}</div>
        <div class="store-stock">✓ ${store.status}</div>
      </div>
    `).join('');

    // Meta Pixel Custom Event
    if (window.fbq) {
      window.fbq('trackCustom', 'StoreLocatorSearch', { search_zip: query });
    }
  }

  searchBtn.addEventListener('click', performSearch);
  inputEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
  });
}

/* --------------------------------------------------------------------------
   5. ACCORDION FAQ LOGIC
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-button');
    const answer = item.querySelector('.faq-answer');

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all active items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-answer').style.maxHeight = null;
      });

      // If clicked item was not active, open it
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. COUPON CLAIM MODAL & META PIXEL TRACKING
   -------------------------------------------------------------------------- */
function initCouponModal() {
  const modal = document.getElementById('couponModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const triggerBtns = document.querySelectorAll('.claim-coupon-trigger');
  const couponForm = document.getElementById('couponForm');
  const formState = document.getElementById('modalFormState');
  const successState = document.getElementById('modalSuccessState');
  const generatedCodeEl = document.getElementById('generatedCode');
  const copyBtn = document.getElementById('copyCodeBtn');

  if (!modal) return;

  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Track Meta Pixel Lead Intent
    if (window.fbq) {
      window.fbq('track', 'ViewContent', { content_name: 'Zero Sugar Coupon Modal' });
    }
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  triggerBtns.forEach(btn => btn.addEventListener('click', openModal));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  if (couponForm) {
    couponForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const emailInput = document.getElementById('userEmailInput').value;
      const randomCode = 'ZERO-' + Math.floor(100000 + Math.random() * 900000);
      
      generatedCodeEl.textContent = randomCode;
      formState.style.display = 'none';
      successState.style.display = 'block';

      // Fire Meta Pixel Conversion Lead Event
      if (window.fbq) {
        window.fbq('track', 'Lead', {
          content_name: 'Coca-Cola Zero Sample Coupon',
          user_email: emailInput
        });
      }
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const code = generatedCodeEl.textContent;
      navigator.clipboard.writeText(code).then(() => {
        copyBtn.textContent = '✓ Copied to Clipboard!';
        setTimeout(() => copyBtn.textContent = 'Copy Digital Voucher Code', 2500);
      });
    });
  }
}

/* --------------------------------------------------------------------------
   7. REAL-TIME SOCIAL PROOF TOAST
   -------------------------------------------------------------------------- */
function initSocialProofToast() {
  const toast = document.getElementById('socialProofToast');
  const messageEl = document.getElementById('toastMessage');

  if (!toast || !messageEl) return;

  const mockActivities = [
    { name: 'Sarah M.', city: 'Austin, TX', action: 'just claimed a Free Sample Voucher!' },
    { name: 'David K.', city: 'Chicago, IL', action: 'redeemed 50% off a 12-pack!' },
    { name: 'Jessica T.', city: 'Miami, FL', action: 'verified the Perfect Taste Guarantee!' },
    { name: 'Marcus L.', city: 'Denver, CO', action: 'found 2-for-1 Coke Zero nearby!' }
  ];

  let index = 0;

  function showNextToast() {
    const item = mockActivities[index];
    messageEl.innerHTML = `<strong>${item.name}</strong> from ${item.city} ${item.action}`;
    toast.classList.add('active');

    setTimeout(() => {
      toast.classList.remove('active');
    }, 4500);

    index = (index + 1) % mockActivities.length;
  }

  // Initial delay then repeat every 12 seconds
  setTimeout(showNextToast, 5000);
  setInterval(showNextToast, 12000);
}

/* --------------------------------------------------------------------------
   8. SCROLL REVEAL ANIMATIONS
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.benefit-card, .testimonial-card, .section-title, .offer-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });
}
