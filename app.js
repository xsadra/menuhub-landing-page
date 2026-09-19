/**
 * MenuHub Showcase & Interactive Application Controller
 *
 * @author Sadra Babai
 * @maintainer Sadra Babai
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
  ObfuscatedEmailEngine.init();
});

// --- Navigation & Scrollspy ---
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('header[id], section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

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

  navLinks.querySelectorAll('a').forEach(anchor => {
    anchor.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navLinks.style.display = 'none';
      }
    });
  });
}

// --- Persona Tabs (Diner / Restaurant / Admin) ---
function initEcosystemTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTabId = btn.getAttribute('data-tab');

      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      tabPanes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === targetTabId) {
          pane.classList.add('active');
        }
      });
    });
  });
}

// --- Venue Discovery & Multi-Facet Filtering ---
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

  const state = {
    keyword: '',
    cuisine: 'all',
    dietary: new Set(),
    spice: null,
    price: null,
    maxRadius: 10
  };

  document.querySelectorAll('#cuisineFilterGroup .filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#cuisineFilterGroup .filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.cuisine = chip.getAttribute('data-val');
      renderResults();
    });
  });

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

  document.querySelectorAll('#spicePriceGroup .filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const type = chip.getAttribute('data-filter');
      const val = chip.getAttribute('data-val');

      if (chip.classList.contains('active')) {
        chip.classList.remove('active');
        state[type] = null;
      } else {
        document.querySelectorAll(`#spicePriceGroup .filter-chip[data-filter="${type}"]`).forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state[type] = val;
      }
      renderResults();
    });
  });

  if (radiusSlider && radiusDisplay) {
    radiusSlider.addEventListener('input', (e) => {
      state.maxRadius = parseFloat(e.target.value);
      radiusDisplay.textContent = `${state.maxRadius} km`;
      renderResults();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.keyword = e.target.value.toLowerCase().trim();
      renderResults();
    });
  }

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

  // TODO: memoize filtered sets if venue catalog expands beyond initial showcase items
  function renderResults() {
    const filtered = sampleVenues.filter(venue => {
      if (state.keyword) {
        const fullContent = `${venue.name} ${venue.cuisineDisplay} ${venue.featuredDish} ${venue.ingredients}`.toLowerCase();
        if (!fullContent.includes(state.keyword)) return false;
      }

      if (state.cuisine !== 'all' && venue.cuisine !== state.cuisine) {
        return false;
      }

      for (const diet of state.dietary) {
        if (!venue.dietary.includes(diet)) return false;
      }

      if (state.spice && venue.spice !== state.spice) {
        return false;
      }

      if (state.price && venue.price !== state.price) {
        return false;
      }

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

  renderResults();
}

// --- Wait-Time Dining Trivia Mini-Game ---
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

    optionsGrid.querySelectorAll('.trivia-opt-btn').forEach(btn => {
      btn.addEventListener('click', handleOptionClick);
    });
  }

  function handleOptionClick(e) {
    const clickedBtn = e.currentTarget;
    const isCorrect = clickedBtn.getAttribute('data-correct') === 'true';

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

      if (currentScore >= 1000) {
        unlockVoucher();
      }
    } else {
      clickedBtn.classList.add('incorrect');
      showToast('Incorrect answer! Ponder that while the chef preps.');
    }

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

  loadQuestion(0);
}

// --- Bill Splitting & Tip Calculator ---
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
  const taxRate = 0.085; // Standard 8.5% dining tax baseline

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

// --- Billing Cycle Switcher ---
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

// --- Platform Locale Simulator ---
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

// --- Newsletter Subscription ---
function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  const emailInput = document.getElementById('newsletterEmail');
  if (!form || !emailInput) return;

  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showToast('⚠️ Please enter a valid email address.');
      emailInput.focus();
      return;
    }

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
      console.error('[newsletter] Network or fetch failure:', err);
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

// --- Toast Notifications ---
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

// --- Dialog & Modal Controller ---
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
        console.error('[checkout] Network or fetch failure:', err);
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

// --- Deep Linking & Interception ---
function initSmartLinks() {
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

          if (tabTarget) {
            const tabBtn = document.querySelector(`.tab-btn[data-tab="${tabTarget}"]`);
            if (tabBtn) {
              setTimeout(() => tabBtn.click(), 450);
            }
          }

          if (action === 'dietary') {
            setTimeout(() => {
              const veganChip = document.querySelector('#dietaryFilterGroup .filter-chip[data-val="vegan"]');
              if (veganChip && !veganChip.classList.contains('active')) {
                veganChip.click();
              }
              showToast('🔍 Focused on Dietary & Allergen Filters');
            }, 500);
          }

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

          if (screenNum) {
            showToast(`Navigated to System Screen #${screenNum}`);
          }
        }
      }
    });
  });

  const phoneDishBtn = document.getElementById('phoneAddDishBtn');
  if (phoneDishBtn) {
    phoneDishBtn.addEventListener('click', () => {
      showToast('🥩 Wagyu Ribeye (Med-Rare, Gluten-Free) added to Table #14 Order!');
    });
  }

  // Gracefully catch preview hash anchors
  document.querySelectorAll('a').forEach(anchor => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#' || href === '#!') {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('ℹ️ This feature is currently in closed preview. Coming soon!');
      });
    } else if (href.startsWith('#') && href.length > 1) {
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

// --- Anti-Scraping Obfuscated Email Engine & Bot Trap ---
const ObfuscatedEmailEngine = (() => {
  function rot13(str) {
    return str.replace(/[a-zA-Z]/g, (c) => {
      return String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
    });
  }

  // 3-step cipher (b64 -> reverse -> rot13) decodes in-memory to prevent static scraper harvesting
  function decode(encodedPayload) {
    if (!encodedPayload || typeof encodedPayload !== 'string') return '';
    try {
      const b64Decoded = atob(encodedPayload);
      const reversed = b64Decoded.split('').reverse().join('');
      return rot13(reversed);
    } catch (e) {
      console.warn('[anti-scrape] Decode failed:', e.message);
      return '';
    }
  }

  function isHumanEvent(e) {
    if (!e || e.isTrusted === false) return false;
    try {
      if (sessionStorage.getItem('menuhub_bot_trapped') === '1') {
        return false;
      }
    } catch (_) {}
    return true;
  }

  // Fallback for non-HTTPS dev or restricted clipboard permission contexts
  async function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        // fallback to textarea select
      }
    }
    try {
      const tempInput = document.createElement('textarea');
      tempInput.value = text;
      tempInput.setAttribute('readonly', '');
      tempInput.style.position = 'absolute';
      tempInput.style.left = '-9999px';
      document.body.appendChild(tempInput);
      tempInput.select();
      const success = document.execCommand('copy');
      document.body.removeChild(tempInput);
      return success;
    } catch (err) {
      return false;
    }
  }

  function init() {
    // Honeypot traps for headless crawlers
    document.querySelectorAll('.anti-bot-honeypot').forEach((trap) => {
      trap.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
          sessionStorage.setItem('menuhub_bot_trapped', '1');
        } catch (_) {}
        console.warn('[security] Bot triggered honeypot trap.');
      });
    });

    // Contact button reveal & trigger
    const contactBtn = document.getElementById('contactEmailBtn');
    const contactBtnText = document.getElementById('contactBtnText');
    if (contactBtn) {
      const enc = contactBtn.getAttribute('data-enc');

      contactBtn.addEventListener('click', (e) => {
        if (!isHumanEvent(e)) {
          e.preventDefault();
          return;
        }

        const email = decode(enc);
        if (!email) return;

        contactBtn.classList.add('revealed');
        contactBtn.setAttribute('title', `Send email to ${email}`);
        contactBtn.setAttribute('aria-label', `Send email to ${email}`);
        if (contactBtnText) {
          contactBtnText.innerHTML = `<span class="contact-action-label">Email:</span> <strong style="color:#ffffff; font-weight:700;">${email}</strong>`;
        }

        window.location.href = `mailto:${email}`;
      });

      // Warm cache on deliberate mouse hover (>150ms)
      let hoverTimer = null;
      contactBtn.addEventListener('mouseenter', (e) => {
        if (!isHumanEvent(e)) return;
        hoverTimer = setTimeout(() => {
          decode(enc);
        }, 150);
      });
      contactBtn.addEventListener('mouseleave', () => {
        if (hoverTimer) clearTimeout(hoverTimer);
      });
    }

    // Quick-copy button
    const copyBtn = document.getElementById('copyEmailBtn');
    const copyLabel = document.getElementById('copyBtnLabel');
    if (copyBtn) {
      const enc = copyBtn.getAttribute('data-enc');

      copyBtn.addEventListener('click', async (e) => {
        if (!isHumanEvent(e)) {
          e.preventDefault();
          return;
        }

        const email = decode(enc);
        if (!email) return;

        await copyToClipboard(email);

        copyBtn.classList.add('copied');
        if (copyLabel) copyLabel.textContent = 'Copied to clipboard!';
        showToast(`📋 Copied ${email} to clipboard!`);

        setTimeout(() => {
          copyBtn.classList.remove('copied');
          if (copyLabel) copyLabel.textContent = 'Copy Email';
        }, 2800);
      });
    }

    // Footer direct inquiry trigger
    const footerBtn = document.getElementById('footerContactBtn');
    if (footerBtn) {
      const enc = footerBtn.getAttribute('data-enc');
      footerBtn.addEventListener('click', (e) => {
        if (!isHumanEvent(e)) {
          e.preventDefault();
          return;
        }
        const email = decode(enc);
        if (!email) return;
        window.location.href = `mailto:${email}`;
        showToast(`📬 Launching mail client for ${email}`);
      });
    }
  }

  return { init, decode };
})();
