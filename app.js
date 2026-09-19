/**
 * MENUVERSE / SMARTDINE PLATFORM - INTERACTIVE APPLICATION CONTROLLER
 * Vanilla ES6+ JavaScript - High-Performance, Zero Runtime Dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initEcosystemTabs();
  initDiscoveryEngine();
  initGamificationTrivia();
  initTipCalculator();
  initPricingToggle();
  initLocaleSimulator();
  initNewsletterForm();
  initModals();
  initSmartLinks();
  initCopyEmail();
});

/* ==========================================================================
   1. NAVBAR SCROLL & ACTIVE SCROLLSPY
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('header[id], section[id]');

  window.addEventListener('scroll', () => {
    // Background blur elevation on scroll
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scrollspy active state
    let currentSectionId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

function initMobileMenu() {
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (!mobileBtn || !navLinks) return;

  mobileBtn.addEventListener('click', () => {
    const isExpanded = navLinks.style.display === 'flex';
    if (isExpanded) {
      navLinks.style.display = 'none';
    } else {
      navLinks.style.display = 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '74px';
      navLinks.style.left = '0';
      navLinks.style.width = '100%';
      navLinks.style.background = 'rgba(11, 15, 23, 0.98)';
      navLinks.style.padding = '24px';
      navLinks.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
      navLinks.style.gap = '18px';
    }
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(anchor => {
    anchor.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navLinks.style.display = 'none';
      }
    });
  });
}

/* ==========================================================================
   2. 3-SIDED ECOSYSTEM TAB SWITCHER
   ========================================================================== */
function initEcosystemTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTabId = btn.getAttribute('data-tab');

      // Update button active state
      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Update pane active state
      tabPanes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === targetTabId) {
          pane.classList.add('active');
        }
      });
    });
  });
}

/* ==========================================================================
   3. ADVANCED DISCOVERY & MULTI-CRITERIA SEARCH ENGINE SIMULATION
   ========================================================================== */
const sampleVenues = [
  {
    id: 1,
    name: "L'Aura Cucina Moderna",
    cuisine: "italian",
    cuisineDisplay: "Italian • Contemporary Pasta",
    rating: "4.9",
    reviews: 342,
    distance: 3.2,
    price: "$$",
    spice: "mild",
    dietary: ["vegan", "gluten-free"],
    status: "Open Now • 3 Tables Ready",
    featuredDish: "Handmade Truffle Pappardelle & Wagyu Ragu",
    ingredients: "San Marzano tomatoes, fresh black winter truffles, 00 organic flour"
  },
  {
    id: 2,
    name: "Saffron & Rose Gastronomy",
    cuisine: "persian",
    cuisineDisplay: "Persian • Modern Heritage",
    rating: "4.95",
    reviews: 512,
    distance: 6.8,
    price: "$$$$",
    spice: "mild",
    dietary: ["halal", "gluten-free", "nut-free"],
    status: "Open Now • VIP Seating Open",
    featuredDish: "Slow-Braised Lamb Shank with Barberry Zereshk Polow",
    ingredients: "Khorasan saffron, Persian wild barberries, basmati, braised shank"
  },
  {
    id: 3,
    name: "Omakase Atelier Shin",
    cuisine: "japanese",
    cuisineDisplay: "Japanese • Edomae Sushi",
    rating: "4.98",
    reviews: 289,
    distance: 4.5,
    price: "$$$$",
    spice: "mild",
    dietary: ["gluten-free", "kosher"],
    status: "Open Now • Counter Slots Available",
    featuredDish: "Otoro Bluefin Nigiri with Siberian Caviar",
    ingredients: "Bluefin tuna belly, akazu seasoned sushi rice, wasabi, caviar"
  },
  {
    id: 4,
    name: "Fuego & Agave Taqueria",
    cuisine: "mexican",
    cuisineDisplay: "Mexican • Artisanal Wood-Fire",
    rating: "4.8",
    reviews: 620,
    distance: 1.8,
    price: "$$",
    spice: "hot",
    dietary: ["vegan", "halal"],
    status: "Open Now • Patio Available",
    featuredDish: "Birria de Res Tacos with 18-Hour Guajillo Consomé",
    ingredients: "Guajillo chilis, heirloom corn masa, braised beef brisket, cilantro"
  },
  {
    id: 5,
    name: "Botanica Green Table",
    cuisine: "finedining",
    cuisineDisplay: "Fine Dining • Plant-Based Michelin",
    rating: "4.85",
    reviews: 198,
    distance: 8.4,
    price: "$$$$",
    spice: "mild",
    dietary: ["vegan", "gluten-free", "kosher", "nut-free"],
    status: "Open Now • Rooftop Garden Ready",
    featuredDish: "Smoked King Oyster Scallops with Cauliflower Velouté",
    ingredients: "Forest-harvested oyster mushrooms, cashew cream, micro-sorrel"
  },
  {
    id: 6,
    name: "Trattoria Della Nonna",
    cuisine: "italian",
    cuisineDisplay: "Italian • Rustic Wood-Oven Pizza",
    rating: "4.75",
    reviews: 410,
    distance: 12.0,
    price: "$$",
    spice: "mild",
    dietary: ["vegetarian", "gluten-free"],
    status: "Open Now • Casual Seating",
    featuredDish: "24-Hour Fermented Burrata Margherita",
    ingredients: "Fior di latte, fresh Pugliese burrata, sweet basil, virgin olive oil"
  }
];

function initDiscoveryEngine() {
  const searchInput = document.getElementById('liveSearchInput');
  const radiusSlider = document.getElementById('radiusSlider');
  const radiusDisplay = document.getElementById('radiusDisplay');
  const resultsContainer = document.getElementById('simulatedResultsContainer');
  const resultCountNumber = document.getElementById('resultCountNumber');
  const resetBtn = document.getElementById('resetFiltersBtn');

  // Filter state
  const state = {
    keyword: '',
    cuisine: 'all',
    dietary: new Set(),
    spice: null,
    price: null,
    maxRadius: 10
  };

  // Cuisine chips
  document.querySelectorAll('#cuisineFilterGroup .filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#cuisineFilterGroup .filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.cuisine = chip.getAttribute('data-val');
      renderResults();
    });
  });

  // Dietary chips
  document.querySelectorAll('#dietaryFilterGroup .filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const val = chip.getAttribute('data-val');
      if (chip.classList.contains('active')) {
        chip.classList.remove('active');
        state.dietary.delete(val);
      } else {
        chip.classList.add('active');
        state.dietary.add(val);
      }
      renderResults();
    });
  });

  // Spice & Price chips
  document.querySelectorAll('#spicePriceGroup .filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const type = chip.getAttribute('data-filter');
      const val = chip.getAttribute('data-val');

      if (chip.classList.contains('active')) {
        chip.classList.remove('active');
        state[type] = null;
      } else {
        // Unset peers in same group
        document.querySelectorAll(`#spicePriceGroup .filter-chip[data-filter="${type}"]`).forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state[type] = val;
      }
      renderResults();
    });
  });

  // Radius slider
  if (radiusSlider && radiusDisplay) {
    radiusSlider.addEventListener('input', (e) => {
      state.maxRadius = parseFloat(e.target.value);
      radiusDisplay.textContent = `${state.maxRadius} km`;
      renderResults();
    });
  }

  // Keyword search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.keyword = e.target.value.toLowerCase().trim();
      renderResults();
    });
  }

  // Reset button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state.keyword = '';
      state.cuisine = 'all';
      state.dietary.clear();
      state.spice = null;
      state.price = null;
      state.maxRadius = 15;

      if (searchInput) searchInput.value = '';
      if (radiusSlider) radiusSlider.value = '15';
      if (radiusDisplay) radiusDisplay.textContent = '15 km';

      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      const defaultCuisine = document.querySelector('#cuisineFilterGroup .filter-chip[data-val="all"]');
      if (defaultCuisine) defaultCuisine.classList.add('active');

      renderResults();
      showToast('Filters reset to default radius & all cuisines');
    });
  }

  function renderResults() {
    const filtered = sampleVenues.filter(venue => {
      // Keyword matching (name, featured dish, ingredients)
      if (state.keyword) {
        const fullContent = `${venue.name} ${venue.cuisineDisplay} ${venue.featuredDish} ${venue.ingredients}`.toLowerCase();
        if (!fullContent.includes(state.keyword)) return false;
      }

      // Cuisine matching
      if (state.cuisine !== 'all' && venue.cuisine !== state.cuisine) {
        return false;
      }

      // Dietary matching (all selected dietary tags must be present)
      for (const diet of state.dietary) {
        if (!venue.dietary.includes(diet)) return false;
      }

      // Spice matching
      if (state.spice && venue.spice !== state.spice) {
        return false;
      }

      // Price matching
      if (state.price && venue.price !== state.price) {
        return false;
      }

      // Distance matching
      if (venue.distance > state.maxRadius) {
        return false;
      }

      return true;
    });

    if (resultCountNumber) {
      resultCountNumber.textContent = filtered.length;
    }

    if (!resultsContainer) return;

    if (filtered.length === 0) {
      resultsContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: rgba(255,255,255,0.02); border-radius: var(--radius-md); border: 1px dashed var(--border-glass);">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">🔍</div>
          <h4 style="color:#fff; margin-bottom: 8px;">No Venues Match the Exact Parameters</h4>
          <p style="font-size: 0.9rem; color: var(--text-muted); max-width: 420px; margin: 0 auto;">Try widening the distance radius slider or clearing specific dietary filters.</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = filtered.map(v => `
      <div class="result-card">
        <div class="result-card-top">
          <div>
            <div class="res-name">${v.name}</div>
            <div class="res-cuisine">${v.cuisineDisplay}</div>
          </div>
          <div class="res-rating">★ ${v.rating} <span style="font-size:0.7rem; color:var(--text-muted);">(${v.reviews})</span></div>
        </div>

        <div style="font-size: 0.86rem; color: var(--text-primary); line-height: 1.4;">
          <span style="color: var(--accent-primary); font-weight: 600;">Chef Highlight:</span> ${v.featuredDish}
        </div>

        <div class="res-badges">
          ${v.dietary.map(d => `<span class="tag-mini vegan">${d.toUpperCase()}</span>`).join('')}
          <span class="tag-mini">${v.price} Tier</span>
          <span class="tag-mini">🌶️ ${v.spice}</span>
        </div>

        <div class="res-footer">
          <span style="color: var(--emerald-primary); font-weight: 600;">● ${v.status}</span>
          <span style="font-family: monospace; font-weight: 700; color: #fff;">${v.distance} km away</span>
        </div>

        <button class="btn btn-secondary btn-sm reserve-venue-btn" data-venue="${v.name}" style="width: 100%; margin-top: 4px; font-size: 0.8rem; padding: 8px;">
          View Live Menu &amp; Book Table &rarr;
        </button>
      </div>
    `).join('');

    // Attach click listener to venue action buttons
    resultsContainer.querySelectorAll('.reserve-venue-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const venue = btn.getAttribute('data-venue');
        showToast(`🛎️ Synchronizing live table matrix & QR menu for ${venue}`);
        const screensSection = document.getElementById('screens');
        if (screensSection) {
          screensSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // Initial render
  renderResults();
}

/* ==========================================================================
   4. IN-APP GAMIFICATION & WAIT-TIME TRIVIA
   ========================================================================== */
const triviaQuestions = [
  {
    q: "What culinary mother sauce is traditionally made with egg yolks, clarified butter, and lemon juice?",
    options: [
      { text: "A) Béchamel Sauce", correct: false },
      { text: "B) Hollandaise Sauce", correct: true },
      { text: "C) Velouté Sauce", correct: false },
      { text: "D) Espagnole Sauce", correct: false }
    ],
    explanation: "Hollandaise is an emulsion of egg yolk, melted butter, and acid (lemon juice)."
  },
  {
    q: "In Neapolitan pizza making, what temperature must the wood-fired stone oven traditionally reach?",
    options: [
      { text: "A) 250°C (480°F)", correct: false },
      { text: "B) 350°C (660°F)", correct: false },
      { text: "C) 485°C (905°F)", correct: true },
      { text: "D) 600°C (1110°F)", correct: false }
    ],
    explanation: "Authentic AVPN Neapolitan pizza cooks in under 90 seconds at 485°C (905°F)."
  },
  {
    q: "Which precious spice is harvested exclusively from the delicate stigmas of the Crocus sativus flower?",
    options: [
      { text: "A) Cardamom", correct: false },
      { text: "B) Saffron", correct: true },
      { text: "C) Star Anise", correct: false },
      { text: "D) Sumac", correct: false }
    ],
    explanation: "Saffron requires hand-harvesting over 75,000 blossoms for a single pound."
  }
];

function initGamificationTrivia() {
  let currentScore = 0;
  let currentQuestionIndex = 0;
  const scoreDisplay = document.getElementById('gameScore');
  const questionText = document.getElementById('triviaQuestionText');
  const optionsGrid = document.getElementById('triviaOptionsGrid');
  const voucherCodeDisplay = document.getElementById('voucherCodeDisplay');
  const voucherTitle = document.getElementById('voucherTitle');
  const voucherSubtitle = document.getElementById('voucherSubtitle');

  function loadQuestion(index) {
    const q = triviaQuestions[index];
    if (!q || !questionText || !optionsGrid) return;

    questionText.textContent = q.q;
    optionsGrid.innerHTML = q.options.map(opt => `
      <button class="trivia-opt-btn" data-correct="${opt.correct}">
        ${opt.text}
      </button>
    `).join('');

    // Attach click listeners to options
    optionsGrid.querySelectorAll('.trivia-opt-btn').forEach(btn => {
      btn.addEventListener('click', handleOptionClick);
    });
  }

  function handleOptionClick(e) {
    const clickedBtn = e.currentTarget;
    const isCorrect = clickedBtn.getAttribute('data-correct') === 'true';

    // Disable all buttons in grid
    optionsGrid.querySelectorAll('.trivia-opt-btn').forEach(btn => {
      btn.disabled = true;
      if (btn.getAttribute('data-correct') === 'true') {
        btn.classList.add('correct');
      }
    });

    if (isCorrect) {
      clickedBtn.classList.add('correct');
      currentScore += 500;
      if (scoreDisplay) scoreDisplay.textContent = currentScore;
      showToast('Correct! +500 wait-time reward points');

      // Milestone check
      if (currentScore >= 1000) {
        unlockVoucher();
      }
    } else {
      clickedBtn.classList.add('incorrect');
      showToast('Incorrect answer! Ponder that while the chef preps.');
    }

    // Advance to next question after brief delay
    setTimeout(() => {
      currentQuestionIndex = (currentQuestionIndex + 1) % triviaQuestions.length;
      loadQuestion(currentQuestionIndex);
    }, 2000);
  }

  function unlockVoucher() {
    if (voucherCodeDisplay) {
      voucherCodeDisplay.textContent = 'DESSERT-15';
      voucherCodeDisplay.style.color = '#10b981';
      voucherCodeDisplay.style.borderColor = '#10b981';
    }
    if (voucherTitle) voucherTitle.textContent = '🎉 Reward Voucher Unlocked!';
    if (voucherSubtitle) voucherSubtitle.textContent = 'Use code DESSERT-15 at checkout for 15% off dessert or free espresso.';
    showToast('🏆 Milestone Hit! Voucher DESSERT-15 unlocked!');
  }

  // Load first question
  loadQuestion(0);
}

/* ==========================================================================
   5. STRIPE GATEWAY & SMART TIP CALCULATOR SIMULATION
   ========================================================================== */
function initTipCalculator() {
  const subtotalInput = document.getElementById('orderSubtotalInput');
  const tipButtons = document.querySelectorAll('#tipPercentageGroup .tip-pill-btn');
  const splitSlider = document.getElementById('splitGuestRange');
  const splitGuestCount = document.getElementById('splitGuestCount');

  const receiptSubtotal = document.getElementById('receiptSubtotalDisplay');
  const receiptTipPercent = document.getElementById('receiptTipPercentDisplay');
  const receiptTip = document.getElementById('receiptTipDisplay');
  const receiptTax = document.getElementById('receiptTaxDisplay');
  const receiptTotal = document.getElementById('receiptTotalDisplay');
  const receiptPerPerson = document.getElementById('receiptPerPersonDisplay');
  const payBtn = document.getElementById('simulatedPayBtn');

  let currentTipRate = 0.15;
  const taxRate = 0.085;

  function calculate() {
    let subtotal = parseFloat(subtotalInput ? subtotalInput.value : 68.50);
    if (isNaN(subtotal) || subtotal < 0) subtotal = 0;

    const guestCount = parseInt(splitSlider ? splitSlider.value : 2, 10);
    const tipAmount = subtotal * currentTipRate;
    const taxAmount = subtotal * taxRate;
    const total = subtotal + tipAmount + taxAmount;
    const perPerson = total / (guestCount || 1);

    if (receiptSubtotal) receiptSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (receiptTipPercent) receiptTipPercent.textContent = `${Math.round(currentTipRate * 100)}%`;
    if (receiptTip) receiptTip.textContent = `+$${tipAmount.toFixed(2)}`;
    if (receiptTax) receiptTax.textContent = `$${taxAmount.toFixed(2)}`;
    if (receiptTotal) receiptTotal.textContent = `$${total.toFixed(2)}`;
    if (receiptPerPerson) receiptPerPerson.textContent = `$${perPerson.toFixed(2)}`;
    if (splitGuestCount) splitGuestCount.textContent = `${guestCount} Guest${guestCount > 1 ? 's' : ''}`;
  }

  tipButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tipButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTipRate = parseFloat(btn.getAttribute('data-tip'));
      calculate();
    });
  });

  if (subtotalInput) {
    subtotalInput.addEventListener('input', calculate);
  }

  if (splitSlider) {
    splitSlider.addEventListener('input', calculate);
  }

  if (payBtn) {
    payBtn.addEventListener('click', () => {
      showToast('💳 Apple Pay Authorized • $ Table #14 Settled Successfully!');
    });
  }

  calculate();
}

/* ==========================================================================
   6. SAAS PRICING MONTHLY / ANNUAL SWITCH
   ========================================================================== */
function initPricingToggle() {
  const switchToggle = document.getElementById('pricingToggleSwitch');
  const priceAmounts = document.querySelectorAll('.price-amount');
  let isAnnual = false;

  if (!switchToggle) return;

  switchToggle.addEventListener('click', () => {
    isAnnual = !isAnnual;
    switchToggle.classList.toggle('annual', isAnnual);
    switchToggle.setAttribute('aria-checked', isAnnual.toString());

    priceAmounts.forEach(el => {
      const val = isAnnual ? el.getAttribute('data-annual') : el.getAttribute('data-monthly');
      el.textContent = val;
    });

    showToast(isAnnual ? 'Switched to Annual Billing (20% Discount Applied)' : 'Switched to Monthly Billing');
  });
}

/* ==========================================================================
   7. LOCALE SIMULATOR
   ========================================================================== */
function initLocaleSimulator() {
  const localeSelector = document.getElementById('localeSelector');
  if (!localeSelector) return;

  const localeNames = {
    en: 'English (US / UK)',
    de: 'Deutsch (German)',
    fr: 'Français (French)',
    fa: 'فارسی (Persian)',
    es: 'Español (Spanish)',
    it: 'Italiano (Italian)'
  };

  localeSelector.addEventListener('change', (e) => {
    const selected = e.target.value;
    const name = localeNames[selected] || selected;
    showToast(`🌐 AI Auto-Translation: Switched menu locale to ${name}`);
  });
}

/* ==========================================================================
   8. NEWSLETTER SUBSCRIPTION & TOAST NOTIFICATION UTILITY
   ========================================================================== */
function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  const emailInput = document.getElementById('newsletterEmail');
  if (!form || !emailInput) return;

  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    // Client-side regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showToast('⚠️ Please enter a valid email address.');
      emailInput.focus();
      return;
    }

    // Set loading state
    if (submitBtn) {
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
    }
    emailInput.disabled = true;

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        showToast(`✉️ ${data.message || 'Subscribed successfully!'}`);
        form.reset();
      } else {
        const errorMsg = data.error || 'Failed to submit. Please try again.';
        showToast(`⚠️ ${errorMsg}`);
      }
    } catch (err) {
      console.error('[Newsletter] Network or fetch error:', err);
      showToast('⚠️ Network connection issue. Please verify your connection and retry.');
    } finally {
      if (submitBtn) {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
      }
      emailInput.disabled = false;
    }
  });
}

function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3800);
}

/* ==========================================================================
   9. INTERACTIVE MODALS & SYSTEM DIALOGS
   ========================================================================== */
function initModals() {
  const modalTriggers = document.querySelectorAll('[data-open-modal]');
  const modalCloseBtns = document.querySelectorAll('[data-close-modal]');
  const backdrops = document.querySelectorAll('.modal-backdrop');

  modalTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute('data-open-modal');
      const targetModal = document.getElementById(modalId);
      if (!targetModal) return;

      // Pre-select plan if tier was specified
      const tier = btn.getAttribute('data-tier');
      if (tier && modalId === 'venueModal') {
        const planChips = targetModal.querySelectorAll('.plan-chip-btn');
        const planInput = targetModal.querySelector('#selectedPlanInput');
        planChips.forEach(chip => {
          if (chip.getAttribute('data-plan') === tier) {
            planChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            if (planInput) planInput.value = tier;
          }
        });
      }

      targetModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      closeAllModals();
    });
  });

  backdrops.forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeAllModals();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  function closeAllModals() {
    backdrops.forEach(b => b.classList.remove('active'));
    document.body.style.overflow = '';
  }

  // Plan chip clicks inside venue modal
  document.querySelectorAll('.plan-chip-btn').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.plan-chip-btn').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const plan = chip.getAttribute('data-plan');
      const planInput = document.getElementById('selectedPlanInput');
      if (planInput) planInput.value = plan;
      showToast(`Selected Plan: ${plan}`);
    });
  });

  // Venue onboarding form submission (Checkout & Plan Lead)
  const venueForm = document.getElementById('venueOnboardingForm');
  if (venueForm) {
    const submitBtn = venueForm.querySelector('button[type="submit"]');

    venueForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('venueNameInput');
      const emailInput = document.getElementById('venueEmailInput');
      const planInput = document.getElementById('selectedPlanInput');
      const tablesSelect = document.getElementById('venueTablesCount');
      const cuisineSelect = document.getElementById('venueCuisineSelect');

      const venueName = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const plan = planInput ? planInput.value : 'Premium Subscription';
      const tables = tablesSelect ? tablesSelect.value : '11-25 Tables';
      const cuisine = cuisineSelect ? cuisineSelect.value : 'general';

      // Validation
      if (!venueName) {
        showToast('⚠️ Please enter your venue / restaurant name.');
        nameInput?.focus();
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        showToast('⚠️ Please enter a valid business email address.');
        emailInput?.focus();
        return;
      }

      // Loading state
      if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
      }

      try {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            venueName,
            email,
            plan,
            tables,
            cuisine
          })
        });

        const data = await res.json().catch(() => ({}));

        if (res.ok && data.success) {
          closeAllModals();
          showToast(`🚀 ${data.message || 'Sandbox provisioned! Admin notified.'}`);
          venueForm.reset();
        } else {
          const errorMsg = data.error || 'Failed to submit onboarding. Please try again.';
          showToast(`⚠️ ${errorMsg}`);
        }
      } catch (err) {
        console.error('[Checkout] Network or fetch error:', err);
        showToast('⚠️ Network connection issue. Please verify your connection and retry.');
      } finally {
        if (submitBtn) {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
        }
      }
    });
  }
}

/* ==========================================================================
   10. SMART IN-PAGE NAVIGATION & DEAD LINK INTERCEPTION
   ========================================================================== */
function initSmartLinks() {
  // Smart links that scroll to sections and optionally trigger tabs or inputs
  document.querySelectorAll('.smart-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      const tabTarget = link.getAttribute('data-tab');
      const action = link.getAttribute('data-action');
      const screenNum = link.getAttribute('data-screen');

      if (href && href.startsWith('#')) {
        const targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });

          // If a specific ecosystem tab is targeted (e.g. restaurantTab)
          if (tabTarget) {
            const tabBtn = document.querySelector(`.tab-btn[data-tab="${tabTarget}"]`);
            if (tabBtn) {
              setTimeout(() => tabBtn.click(), 450);
            }
          }

          // If dietary filter action
          if (action === 'dietary') {
            setTimeout(() => {
              const veganChip = document.querySelector('#dietaryFilterGroup .filter-chip[data-val="vegan"]');
              if (veganChip && !veganChip.classList.contains('active')) {
                veganChip.click();
              }
              showToast('🔍 Focused on Dietary & Allergen Filters');
            }, 500);
          }

          // If tip calculator action
          if (action === 'tip-calc') {
            setTimeout(() => {
              const tipInput = document.getElementById('orderSubtotalInput');
              if (tipInput) {
                tipInput.focus();
                tipInput.style.boxShadow = '0 0 0 3px rgba(255, 107, 53, 0.4)';
                setTimeout(() => tipInput.style.boxShadow = '', 2000);
              }
              showToast('💳 Focused on Tip Calculator & Split Check');
            }, 500);
          }

          // If specific screen was targeted
          if (screenNum) {
            showToast(`Navigated to System Screen #${screenNum}`);
          }
        }
      }
    });
  });

  // Hero phone mockup dish add button
  const phoneDishBtn = document.getElementById('phoneAddDishBtn');
  if (phoneDishBtn) {
    phoneDishBtn.addEventListener('click', () => {
      showToast('🥩 Wagyu Ribeye (Med-Rare, Gluten-Free) added to Table #14 Order!');
    });
  }

  // GLOBAL DEAD LINK AUDIT & INTERCEPTION
  // Catch any remaining anchor tag with href="#" or non-existent hash targets
  document.querySelectorAll('a').forEach(anchor => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#' || href === '#!') {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('ℹ️ This feature is currently in closed preview. Coming soon!');
      });
    } else if (href.startsWith('#') && href.length > 1) {
      // If the target element does not exist in DOM
      const targetId = href.substring(1);
      if (!document.getElementById(targetId)) {
        anchor.addEventListener('click', (e) => {
          e.preventDefault();
          showToast(`ℹ️ Portal section #${targetId} is being provisioned.`);
        });
      }
    }
  });
}

/* ==========================================================================
   11. COPY EMAIL QUICK-ACTION
   ========================================================================== */
function initCopyEmail() {
  const copyBtn = document.getElementById('copyEmailBtn');
  const copyLabel = document.getElementById('copyBtnLabel');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    const email = copyBtn.getAttribute('data-email') || 'info@menuhub.app';
    let copied = false;

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(email);
        copied = true;
      } catch (err) {
        copied = false;
      }
    }

    if (!copied) {
      const tempInput = document.createElement('input');
      tempInput.value = email;
      document.body.appendChild(tempInput);
      tempInput.select();
      try {
        document.execCommand('copy');
        copied = true;
      } catch (err) {
        copied = false;
      }
      document.body.removeChild(tempInput);
    }

    copyBtn.classList.add('copied');
    if (copyLabel) copyLabel.textContent = 'Copied to clipboard!';
    showToast('📋 Copied info@menuhub.app to clipboard!');

    setTimeout(() => {
      copyBtn.classList.remove('copied');
      if (copyLabel) copyLabel.textContent = 'Copy Email';
    }, 2800);
  });
}


