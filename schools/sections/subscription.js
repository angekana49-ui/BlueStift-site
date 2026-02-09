// ==========================================
// SECTION: Subscription
// Plan management, billing, and usage
// ==========================================

(function() {
  'use strict';

  // Plans data
  // Note: Prices shown are for Cameroon zone.
  // Prices may vary by geographic zone.
  const plansData = [
    {
      id: 'standard',
      name: 'Standard',
      price: '80,000',
      currency: 'XAF',
      period: '/month',
      description: 'Perfect to get started with BlueStift',
      features: [
        { text: 'Unlimited students', included: true },
        { text: 'Dashboard analytics', included: true },
        { text: '50 RAYA requests/day', included: true },
        { text: 'Unlimited contributions', included: true },
        { text: 'CSV & PDF exports (5/month)', included: true },
        { text: 'Email support', included: true },
        { text: 'Unlimited exports', included: false },
        { text: 'Unlimited RAYA + advanced models', included: false },
        { text: 'Priority support', included: false }
      ],
      cta: 'Current Plan',
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '120,000',
      currency: 'XAF',
      period: '/month',
      description: 'Full power of BlueStift',
      features: [
        { text: 'Unlimited students', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'Unlimited RAYA + advanced models', included: true },
        { text: 'Unlimited contributions', included: true },
        { text: 'Unlimited exports (all formats)', included: true },
        { text: 'Priority email support', included: true },
        { text: 'Custom reports', included: true },
        { text: 'Dedicated support', included: false },
        { text: 'Custom configuration', included: false }
      ],
      cta: 'Upgrade to Pro',
      popular: true
    },
    {
      id: 'custom',
      name: 'Custom',
      price: 'Contact us',
      period: '',
      description: 'For large institutions',
      features: [
        { text: 'Everything in Pro', included: true },
        { text: 'Dedicated support', included: true },
        { text: 'Custom configuration', included: true },
        { text: 'Tailored training sessions', included: true },
        { text: 'Custom integrations', included: true },
        { text: 'SLA guarantee', included: true }
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  // Mock billing history
  const billingHistory = [
    { date: '2025-01-01', description: 'Pro Plan - Monthly', amount: '120,000 XAF', status: 'paid', invoice: 'INV-2025-001' },
    { date: '2024-12-01', description: 'Pro Plan - Monthly', amount: '120,000 XAF', status: 'paid', invoice: 'INV-2024-012' },
    { date: '2024-11-01', description: 'Standard Plan - Monthly', amount: '80,000 XAF', status: 'paid', invoice: 'INV-2024-011' }
  ];

  // HTML Template
  function render() {
    const school = window.SchoolsDashboard?.currentSchool || {};
    const currentPlan = school.planType || 'Pro';
    const expiryDate = school.expiryDate || '2025-06-30';
    const rayaLeft = school.rayaMessagesLeft || 50;

    return `
      <h2><i class="fas fa-credit-card"></i> Subscription</h2>
      <p>Manage your plan, view usage, and billing history.</p>

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
          ${currentPlan !== 'Enterprise' ? `
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
            <div class="usage-icon raya">
              <i class="fas fa-robot"></i>
            </div>
            <div class="usage-info">
              <h4>RAYA Messages</h4>
              <div class="usage-bar">
                <div class="usage-fill" style="width: ${100 - (rayaLeft / 100 * 100)}%"></div>
              </div>
              <p><strong>${rayaLeft}</strong> remaining of 100</p>
            </div>
          </div>

          <div class="usage-card">
            <div class="usage-icon contributions">
              <i class="fas fa-upload"></i>
            </div>
            <div class="usage-info">
              <h4>Contributions</h4>
              <div class="usage-bar">
                <div class="usage-fill" style="width: 0%"></div>
              </div>
              <p><strong>Unlimited</strong></p>
            </div>
          </div>

          <div class="usage-card">
            <div class="usage-icon exports">
              <i class="fas fa-download"></i>
            </div>
            <div class="usage-info">
              <h4>Exports</h4>
              <div class="usage-bar">
                <div class="usage-fill" style="width: 30%"></div>
              </div>
              <p><strong>Unlimited</strong> with Pro</p>
            </div>
          </div>

          <div class="usage-card">
            <div class="usage-icon storage">
              <i class="fas fa-database"></i>
            </div>
            <div class="usage-info">
              <h4>Storage</h4>
              <div class="usage-bar">
                <div class="usage-fill" style="width: 45%"></div>
              </div>
              <p><strong>2.3 GB</strong> of 5 GB used</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Compare Plans -->
      <div class="plans-section">
        <div class="section-header">
          <h3><i class="fas fa-th-large"></i> Compare Plans</h3>
        </div>

        <div class="plans-grid">
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
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Invoice</th>
              </tr>
            </thead>
            <tbody>
              ${billingHistory.map(item => `
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

        ${billingHistory.length === 0 ? `
          <div class="billing-empty">
            <i class="fas fa-file-invoice"></i>
            <p>No billing history yet</p>
          </div>
        ` : ''}
      </div>

      <!-- Payment Method -->
      <div class="payment-section">
        <div class="section-header">
          <h3><i class="fas fa-wallet"></i> Payment Method</h3>
        </div>

        <div class="payment-methods">
          <div class="payment-card active">
            <div class="payment-icon">
              <i class="fas fa-mobile-alt"></i>
            </div>
            <div class="payment-info">
              <h4>Mobile Money</h4>
              <p>MTN MoMo ending in **89</p>
            </div>
            <span class="default-badge">Default</span>
          </div>

          <button class="btn-add-payment" id="btn-add-payment">
            <i class="fas fa-plus"></i> Add Payment Method
          </button>
        </div>
      </div>

      <!-- Cancel/Downgrade -->
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

  function renderPlanCard(plan, currentPlan) {
    const isCurrent = plan.name.toLowerCase() === currentPlan.toLowerCase();

    return `
      <div class="plan-card ${plan.popular ? 'popular' : ''} ${isCurrent ? 'current' : ''}">
        ${plan.popular ? '<div class="popular-badge">Most Popular</div>' : ''}
        ${isCurrent ? '<div class="current-badge">Current</div>' : ''}

        <div class="plan-header">
          <h4>${plan.name}</h4>
          <div class="plan-price">
            ${plan.price === 'Custom' ? `
              <span class="price">Custom</span>
            ` : `
              <span class="price">${plan.price}</span>
              ${plan.currency ? `<span class="currency">${plan.currency}</span>` : ''}
              <span class="period">${plan.period}</span>
            `}
          </div>
          <p class="plan-desc">${plan.description}</p>
        </div>

        <ul class="plan-features">
          ${plan.features.map(f => `
            <li class="${f.included ? 'included' : 'not-included'}">
              <i class="fas fa-${f.included ? 'check' : 'times'}"></i>
              <span>${f.text}</span>
            </li>
          `).join('')}
        </ul>

        <button class="btn-plan ${isCurrent ? 'disabled' : ''}"
                data-plan="${plan.id}"
                ${isCurrent ? 'disabled' : ''}>
          ${isCurrent ? 'Current Plan' : plan.cta}
        </button>
      </div>
    `;
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Initialize section
  function init() {
    initUpgradeButton();
    initRenewButton();
    initPlanButtons();
    initInvoiceButtons();
    initPaymentButtons();
    initDangerButtons();
  }

  function initUpgradeButton() {
    document.getElementById('btn-upgrade-plan')?.addEventListener('click', () => {
      // Scroll to plans section
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
        const planId = btn.getAttribute('data-plan');

        if (planId === 'enterprise') {
          window.SchoolsUtils?.showSchoolNotification(
            'Our sales team will contact you within 24 hours to discuss your needs.',
            'success'
          );
        } else if (planId === 'pro') {
          // Show upgrade modal or redirect to payment
          window.SchoolsUtils?.showSchoolNotification(
            'Redirecting to secure payment... (Demo mode)',
            'info'
          );
        } else {
          window.SchoolsUtils?.showSchoolNotification(
            'You are already on the Free plan.',
            'info'
          );
        }
      });
    });
  }

  function initInvoiceButtons() {
    document.querySelectorAll('.btn-invoice').forEach(btn => {
      btn.addEventListener('click', () => {
        const invoiceId = btn.getAttribute('data-invoice');
        window.SchoolsUtils?.showSchoolNotification(
          `Downloading invoice ${invoiceId}...`,
          'info'
        );
        // Simulate download
        setTimeout(() => {
          window.SchoolsUtils?.showSchoolNotification(
            `Invoice ${invoiceId} downloaded!`,
            'success'
          );
        }, 1000);
      });
    });

    document.getElementById('btn-download-invoices')?.addEventListener('click', () => {
      window.SchoolsUtils?.showSchoolNotification(
        'Preparing all invoices for download...',
        'info'
      );
    });
  }

  function initPaymentButtons() {
    document.getElementById('btn-add-payment')?.addEventListener('click', () => {
      window.SchoolsUtils?.showSchoolNotification(
        'Payment method management coming soon. Contact support to update your payment details.',
        'info'
      );
    });
  }

  function initDangerButtons() {
    document.getElementById('btn-downgrade')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to downgrade to the Free plan? You will lose access to premium features.')) {
        window.SchoolsUtils?.showSchoolNotification(
          'Downgrade request submitted. Changes will take effect at the end of your billing period.',
          'warning'
        );
      }
    });

    document.getElementById('btn-cancel-subscription')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to cancel your subscription? This action cannot be undone.')) {
        window.SchoolsUtils?.showSchoolNotification(
          'Cancellation request submitted. Please contact support if you change your mind.',
          'warning'
        );
      }
    });
  }

  // Register section
  window.SchoolsSections.register('subscription', { render, init });

})();
