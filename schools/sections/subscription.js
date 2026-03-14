// ==========================================
// SECTION: Subscription
// B2B plan management, zone-aware pricing, billing
// ==========================================

(function() {
  'use strict';

  const PLAN_TIERS = { standard: 0, pro: 1, custom: 2 };

  // Features per plan — plain language for school administrators
  const PLAN_FEATURES = {
    standard: [
      { text: 'Up to 1,000 students',                       included: true },
      { text: 'Unlimited classes',                          included: true },
      { text: 'Weekly class learning reports',              included: true },
      { text: 'Dashboard: mastery scores & learning gaps',  included: true },
      { text: 'Export reports as PDF or spreadsheet',       included: true },
      { text: '10 GB report storage',                       included: true },
      { text: 'Up to 3 admin accounts',                     included: true },
      { text: 'Email support (reply within 3 days)',        included: true },
      { text: 'Daily learning reports',                     included: false },
      { text: 'Trend analysis & performance forecasts',     included: false },
      { text: 'Connect with your other school tools',       included: false },
    ],
    pro: [
      { text: 'Up to 1,000 students',                       included: true },
      { text: 'Unlimited classes',                          included: true },
      { text: 'Daily learning reports per class',           included: true },
      { text: 'Advanced dashboard: trends, subjects & comparisons', included: true },
      { text: 'Export as PDF, Excel or via API',            included: true },
      { text: 'Performance forecasts & simulations',        included: true },
      { text: 'Connect with your other school tools',       included: true },
      { text: '100 GB report storage',                      included: true },
      { text: 'Up to 10 admin accounts',                    included: true },
      { text: 'Add your school logo to reports',            included: true },
      { text: 'Early access to new features',               included: true },
      { text: 'Priority support (reply within 24h)',        included: true },
    ],
    custom: [
      { text: 'Everything in Pro',                          included: true },
      { text: 'Unlimited students',                         included: true },
      { text: 'Live learning reports',                      included: true },
      { text: 'Unlimited storage & admin accounts',         included: true },
      { text: 'Multi-school network dashboard',             included: true },
      { text: 'Integration with your school management software', included: true },
      { text: 'Dedicated account manager & onboarding',     included: true },
      { text: '99.9% uptime guaranteed',                    included: true },
      { text: 'Features built to your specifications',      included: true },
    ]
  };

  const PLAN_META = {
    standard: { popular: false, icon: 'fa-chart-bar' },
    pro:      { popular: true,  icon: 'fa-rocket' },
    custom:   { popular: false, icon: 'fa-building' }
  };

  const PLAN_STORAGE = {
    standard: { gb: 10,  used: 0.5, pct: 5 },
    pro:      { gb: 100, used: 3.2, pct: 3 },
    custom:   { gb: null, used: 3.2, pct: 1 }
  };

  // Billing period toggle state
  let billingPeriod = 'monthly'; // 'monthly' | 'annual'

  // Resolved at init — holds plans with zone-specific pricing
  let plansData = buildPlansData(null);

  function buildPlansData(dbPlans) {
    const tiers = ['standard', 'pro', 'custom'];

    // T1 (US/Premium) defaults
    const defaults = {
      standard: { price: 1500, yearly_price: 16200, extra_student_price: 1.05, currency: 'USD' },
      pro:      { price: 2300, yearly_price: 24840, extra_student_price: 1.61, currency: 'USD' },
      custom:   { price: null, yearly_price: null,   extra_student_price: null, currency: null  }
    };
    const defaultNames = { standard: 'Standard', pro: 'Pro', custom: 'Custom' };
    const defaultDescs = {
      standard: 'Essential analytics for growing schools',
      pro:      'Full analytics power for ambitious schools',
      custom:   'Tailored solution for large institutions & networks'
    };

    return tiers.map(tier => {
      const db = dbPlans?.find(p => {
        const t = (p.tier || '').toLowerCase();
        const n = (p.plan_name || p.name || '').toLowerCase();
        return t === tier || n === tier || n === defaultNames[tier].toLowerCase();
      });

      const price              = db?.price              ?? defaults[tier].price;
      const yearly_price       = db?.yearly_price       ?? defaults[tier].yearly_price;
      const extra_student_price = db?.extra_student_price ?? defaults[tier].extra_student_price;
      const currency           = db?.currency           ?? defaults[tier].currency;

      return {
        id:                 tier,
        name:               db?.plan_name || db?.name || defaultNames[tier],
        price,
        yearly_price,
        extra_student_price,
        currency,
        description:        db?.description || defaultDescs[tier],
        features:           PLAN_FEATURES[tier],
        popular:            PLAN_META[tier].popular,
        icon:               PLAN_META[tier].icon,
        zone_name:          db?.zone_name || null
      };
    });
  }

  function formatPrice(amount, currency) {
    if (amount == null) return null;
    const num = Number(amount);
    const formatted = num >= 1000
      ? num.toLocaleString('en-US')
      : num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    return currency ? `${formatted} ${currency}` : formatted;
  }

  function getDisplayPrice(plan) {
    if (plan.price == null) return null;
    return billingPeriod === 'annual' ? plan.yearly_price : plan.price;
  }

  // ---- HTML Template ----
  function render() {
    const school      = window.SchoolsDashboard?.currentSchool || {};
    const currentPlan = school.planType || 'Pro';
    const expiryDate  = school.expiryDate || '2025-06-30';
    const rayaLeft    = school.rayaMessagesLeft || 50;
    const planKey     = currentPlan.toLowerCase();
    const storage     = PLAN_STORAGE[planKey] || PLAN_STORAGE.standard;
    const storageMax  = storage.gb ? `${storage.gb} GB` : '∞';

    return `
      <h2><i class="fas fa-credit-card"></i> Subscription</h2>
      <p>Manage your plan, view usage, and billing history.</p>

      <!-- Pricing disclaimer banner -->
      <div class="pricing-disclaimer-banner">
        <i class="fas fa-info-circle"></i>
        <span>
          Prices shown are indicative and based on standard international rates.
          They may vary depending on your region and institution size.
          <strong>Contact us at <a href="mailto:russel@thebluestift.com">russel@thebluestift.com</a> for pricing adapted to your country.</strong>
        </span>
      </div>

      <!-- Current Plan Card -->
      <div class="current-plan-card">
        <div class="plan-status">
          <div class="plan-badge ${currentPlan.toLowerCase()}">
            <i class="fas fa-crown"></i>
            <span>${currentPlan}</span>
          </div>
          <div class="plan-expiry">
            <span class="label">Expires</span>
            <span class="date">${formatDate(expiryDate)}</span>
          </div>
        </div>
        <div class="plan-details">
          <h3>Your Current Plan</h3>
          <p>You're on the <strong>${currentPlan}</strong> plan. ${currentPlan === 'Pro' ? 'Enjoy all premium features!' : 'Upgrade to unlock more features.'}</p>
        </div>
        <div class="plan-actions">
          ${currentPlan !== 'Custom' ? `
            <button class="btn-upgrade" id="btn-upgrade-plan">
              <i class="fas fa-rocket"></i> Upgrade Plan
            </button>
          ` : ''}
          <button class="btn-renew" id="btn-renew-plan">
            <i class="fas fa-sync-alt"></i> Renew
          </button>
        </div>
      </div>

      <!-- Usage Overview -->
      <div class="usage-section">
        <div class="section-header">
          <h3><i class="fas fa-chart-pie"></i> This Month's Usage</h3>
        </div>
        <div class="usage-grid">
          <div class="usage-card">
            <div class="usage-icon raya"><i class="fas fa-robot"></i></div>
            <div class="usage-info">
              <h4><span class="notranslate">RAYA</span> Messages</h4>
              <div class="usage-bar">
                <div class="usage-fill" style="width: ${100 - (rayaLeft / 100 * 100)}%"></div>
              </div>
              <p><strong>${rayaLeft}</strong> remaining of 100</p>
            </div>
          </div>
          <div class="usage-card">
            <div class="usage-icon contributions"><i class="fas fa-upload"></i></div>
            <div class="usage-info">
              <h4>Contributions</h4>
              <div class="usage-bar"><div class="usage-fill" style="width: 0%"></div></div>
              <p><strong>Unlimited</strong></p>
            </div>
          </div>
          <div class="usage-card">
            <div class="usage-icon exports"><i class="fas fa-download"></i></div>
            <div class="usage-info">
              <h4>Exports</h4>
              <div class="usage-bar"><div class="usage-fill" style="width: 30%"></div></div>
              <p>${planKey === 'standard' ? 'PDF & CSV' : '<strong>Unlimited</strong> — PDF, Excel, API'}</p>
            </div>
          </div>
          <div class="usage-card">
            <div class="usage-icon storage"><i class="fas fa-database"></i></div>
            <div class="usage-info">
              <h4>Analytics Storage</h4>
              <div class="usage-bar"><div class="usage-fill" style="width: ${storage.pct}%"></div></div>
              <p><strong>${storage.used} GB</strong> of ${storageMax} used</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Compare Plans -->
      <div class="plans-section">
        <div class="section-header">
          <h3><i class="fas fa-th-large"></i> Compare Plans</h3>
        </div>

        <!-- Billing toggle -->
        <div class="billing-toggle-wrap">
          <div class="billing-toggle" id="billing-toggle">
            <button class="billing-btn ${billingPeriod === 'monthly' ? 'active' : ''}" data-period="monthly">Monthly</button>
            <button class="billing-btn ${billingPeriod === 'annual' ? 'active' : ''}" data-period="annual">
              Annual <span class="discount-badge">–10%</span>
            </button>
          </div>
        </div>

        <div class="plans-grid" id="plans-grid">
          ${plansData.map(plan => renderPlanCard(plan, currentPlan)).join('')}
        </div>
      </div>

      <!-- Billing History -->
      <div class="billing-section">
        <div class="section-header">
          <h3><i class="fas fa-file-invoice-dollar"></i> Billing History</h3>
          <button class="btn-download-all" id="btn-download-invoices">
            <i class="fas fa-download"></i> Download All
          </button>
        </div>
        <div class="billing-table-container">
          <table class="billing-table">
            <thead>
              <tr>
                <th>Date</th><th>Description</th><th>Amount</th><th>Status</th><th>Invoice</th>
              </tr>
            </thead>
            <tbody>
              ${getBillingHistory().map(item => `
                <tr>
                  <td>${formatDate(item.date)}</td>
                  <td>${item.description}</td>
                  <td><strong>${item.amount}</strong></td>
                  <td><span class="status-badge ${item.status}">${item.status}</span></td>
                  <td>
                    <button class="btn-invoice" data-invoice="${item.invoice}">
                      <i class="fas fa-download"></i> ${item.invoice}
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Payment Method -->
      <div class="payment-section">
        <div class="section-header">
          <h3><i class="fas fa-wallet"></i> Payment Method</h3>
        </div>
        <div class="payment-methods">
          <div class="payment-card active">
            <div class="payment-icon"><i class="fas fa-credit-card"></i></div>
            <div class="payment-info">
              <h4>Credit Card</h4>
              <p>Visa ending in **1234</p>
            </div>
            <span class="default-badge">Default</span>
          </div>
          <button class="btn-add-payment" id="btn-add-payment">
            <i class="fas fa-plus"></i> Add Payment Method
          </button>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="danger-zone">
        <div class="section-header">
          <h3><i class="fas fa-exclamation-triangle"></i> Danger Zone</h3>
        </div>
        <p class="danger-description">These actions are irreversible. Please be careful.</p>
        <div class="danger-actions">
          <button class="btn-downgrade" id="btn-downgrade">
            <i class="fas fa-arrow-down"></i> Downgrade to Standard
          </button>
          <button class="btn-cancel" id="btn-cancel-subscription">
            <i class="fas fa-times"></i> Cancel Subscription
          </button>
        </div>
      </div>
    `;
  }

  function getPlanCTA(plan, currentPlan) {
    const currentTier = PLAN_TIERS[currentPlan.toLowerCase()] ?? 0;
    const planTier    = PLAN_TIERS[plan.id] ?? 0;
    if (plan.id === 'custom')    return { text: 'Contact Sales',          icon: 'fa-envelope',      action: 'contact' };
    if (planTier > currentTier)  return { text: `Upgrade to ${plan.name}`,icon: 'fa-rocket',        action: 'upgrade' };
    if (planTier < currentTier)  return { text: `Downgrade to ${plan.name}`,icon: 'fa-arrow-down',  action: 'downgrade' };
    return { text: 'Current Plan', icon: 'fa-check-circle', action: 'current' };
  }

  function renderPlanCard(plan, currentPlan) {
    const isCurrent  = plan.name.toLowerCase() === currentPlan.toLowerCase();
    const cta        = getPlanCTA(plan, currentPlan);
    const displayAmt = getDisplayPrice(plan);
    const priceStr   = displayAmt != null ? displayAmt.toLocaleString('en-US') : null;
    const period     = billingPeriod === 'annual' ? '/year' : '/month';

    const priceBlock = priceStr
      ? `<span class="price">${priceStr}</span><span class="currency">${plan.currency}</span><span class="period">${period}</span>`
      : `<span class="price contact">Contact us</span>`;

    const studentsBlock = plan.extra_student_price != null ? `
      <div class="plan-students-info">
        <i class="fas fa-users"></i>
        <span>1,000 students included</span>
        <span class="extra-price">+ ${plan.extra_student_price} ${plan.currency}/extra student</span>
      </div>` : '';

    return `
      <div class="plan-card ${plan.popular ? 'popular' : ''} ${isCurrent ? 'current' : ''}">
        ${plan.popular ? '<div class="popular-badge">Most Popular</div>' : ''}

        <div class="plan-header">
          <div class="plan-icon-wrap"><i class="fas ${plan.icon}"></i></div>
          <h4>${plan.name}</h4>
          <div class="plan-price">${priceBlock}</div>
          ${billingPeriod === 'annual' && displayAmt != null ? `<p class="annual-savings">Save ${formatPrice(Math.round(displayAmt / 10))} ${plan.currency} vs monthly</p>` : ''}
          <p class="plan-desc">${plan.description}</p>
        </div>

        ${studentsBlock}

        <ul class="plan-features">
          ${plan.features.map(f => `
            <li class="${f.included ? 'included' : 'not-included'}">
              <i class="fas fa-${f.included ? 'check' : 'times'}"></i>
              <span>${f.text}</span>
            </li>
          `).join('')}
        </ul>

        <button class="btn-plan ${isCurrent ? 'disabled' : ''} ${cta.action === 'downgrade' ? 'btn-plan--downgrade' : ''}"
                data-plan="${plan.id}"
                data-action="${cta.action}"
                ${isCurrent ? 'disabled' : ''}>
          <i class="fas ${cta.icon}"></i> ${cta.text}
        </button>
      </div>
    `;
  }

  function getBillingHistory() {
    const pro = plansData.find(p => p.id === 'pro');
    const std = plansData.find(p => p.id === 'standard');
    const proAmt = pro ? `${pro.price} ${pro.currency || ''}` : '200 USD';
    const stdAmt = std ? `${std.price} ${std.currency || ''}` : '130 USD';
    return [
      { date: '2026-01-01', description: 'Pro Plan — Monthly',      amount: proAmt, status: 'paid', invoice: 'INV-2026-001' },
      { date: '2025-12-01', description: 'Pro Plan — Monthly',      amount: proAmt, status: 'paid', invoice: 'INV-2025-012' },
      { date: '2025-11-01', description: 'Standard Plan — Monthly', amount: stdAmt, status: 'paid', invoice: 'INV-2025-011' }
    ];
  }

  function formatPrice(amount) {
    if (amount == null) return 'Contact us';
    return Number(amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  // ---- Init ----
  async function init() {
    await loadPlans();
    initBillingToggle();
    initUpgradeButton();
    initRenewButton();
    initPlanButtons();
    initInvoiceButtons();
    initPaymentButtons();
    initDangerButtons();
  }

  async function loadPlans() {
    let dbPlans = null;
    if (typeof SchoolsDB !== 'undefined') {
      dbPlans = await SchoolsDB.getPlans();
    }
    plansData = buildPlansData(dbPlans);
    rerenderPlanCards();
  }

  function rerenderPlanCards() {
    const grid = document.getElementById('plans-grid');
    if (!grid) return;
    const school      = window.SchoolsDashboard?.currentSchool || {};
    const currentPlan = school.planType || 'Pro';
    grid.innerHTML    = plansData.map(plan => renderPlanCard(plan, currentPlan)).join('');
    initPlanButtons();
  }

  function initBillingToggle() {
    document.getElementById('billing-toggle')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.billing-btn');
      if (!btn) return;
      billingPeriod = btn.dataset.period;

      // Update toggle button styles
      document.querySelectorAll('.billing-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.period === billingPeriod);
      });

      rerenderPlanCards();
    });
  }

  function initUpgradeButton() {
    document.getElementById('btn-upgrade-plan')?.addEventListener('click', () => {
      document.querySelector('.plans-section')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  function initRenewButton() {
    document.getElementById('btn-renew-plan')?.addEventListener('click', () => {
      window.SchoolsUtils?.showSchoolNotification(
        'Renewal process will be available soon. Contact support for immediate renewal.',
        'info'
      );
    });
  }

  function initPlanButtons() {
    document.querySelectorAll('.btn-plan:not(.disabled)').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');
        const planId = btn.getAttribute('data-plan');
        const name   = planId.charAt(0).toUpperCase() + planId.slice(1);

        switch (action) {
          case 'contact':
            window.location.href = 'mailto:russel@thebluestift.com?subject=Custom%20Plan%20Inquiry%20-%20Schools%20Dashboard';
            break;
          case 'upgrade':
            window.SchoolsUtils?.showSchoolNotification(
              `Upgrade to ${name} — online payment coming soon. Contact russel@thebluestift.com to upgrade now.`,
              'info'
            );
            break;
          case 'downgrade':
            if (confirm(`Downgrade to ${name}? You may lose access to some features.`)) {
              window.SchoolsUtils?.showSchoolNotification(
                'Downgrade request submitted. Changes take effect at end of billing period.',
                'warning'
              );
            }
            break;
        }
      });
    });
  }

  function initInvoiceButtons() {
    document.querySelectorAll('.btn-invoice').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-invoice');
        window.SchoolsUtils?.showSchoolNotification(`Downloading ${id}...`, 'info');
        setTimeout(() => window.SchoolsUtils?.showSchoolNotification(`${id} downloaded!`, 'success'), 1000);
      });
    });
    document.getElementById('btn-download-invoices')?.addEventListener('click', () => {
      window.SchoolsUtils?.showSchoolNotification('Preparing all invoices for download...', 'info');
    });
  }

  function initPaymentButtons() {
    document.getElementById('btn-add-payment')?.addEventListener('click', () => {
      window.SchoolsUtils?.showSchoolNotification(
        'Payment method management coming soon. Contact russel@thebluestift.com to update.',
        'warning'
      );
    });
  }

  function initDangerButtons() {
    document.getElementById('btn-downgrade')?.addEventListener('click', () => {
      if (confirm('Downgrade to Standard? You will lose access to Pro features.')) {
        window.SchoolsUtils?.showSchoolNotification(
          'Downgrade request submitted. Changes take effect at end of billing period.',
          'warning'
        );
      }
    });
    document.getElementById('btn-cancel-subscription')?.addEventListener('click', () => {
      if (confirm('Cancel your subscription? This cannot be undone.')) {
        window.SchoolsUtils?.showSchoolNotification(
          'Cancellation request submitted. Contact support if you change your mind.',
          'warning'
        );
      }
    });
  }

  // Register section
  window.SchoolsSections.register('subscription', { render, init });

})();
