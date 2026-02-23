// ==========================================
// SECTION: Settings
// Account configuration, preferences, and security
// Accordion-based UI for cleaner navigation
// ==========================================

(function() {
  'use strict';

  // Available languages for the selector
  const languagesData = [
    { code: 'en', flag: '🇬🇧', name: 'English' },
    { code: 'fr', flag: '🇫🇷', name: 'Français' },
    { code: 'es', flag: '🇪🇸', name: 'Español' },
    { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
    { code: 'pt', flag: '🇵🇹', name: 'Português' },
    { code: 'ar', flag: '🇸🇦', name: 'العربية' },
    { code: 'zh-CN', flag: '🇨🇳', name: '中文' },
    { code: 'ru', flag: '🇷🇺', name: 'Русский' }
  ];

  // Notification settings structure
  const notificationSettings = [
    { id: 'sound_enabled', label: 'Sound Notifications', description: 'Play a sound on important actions (export, save, errors…)', icon: 'fa-volume-up', default: true, special: 'sound' },
    { id: 'push_enabled', label: 'Browser Push Notifications', description: 'Receive alerts on this device even when the dashboard is closed', icon: 'fa-bell', default: false, special: 'push' },
    { id: 'email_weekly', label: 'Weekly Performance Report', description: 'Get a summary email every Monday', icon: 'fa-envelope', default: true },
    { id: 'email_alerts', label: 'Performance Alerts', description: 'Notify when a class average PKM drops below threshold', icon: 'fa-exclamation-triangle', default: true },
    { id: 'email_usage', label: 'Usage Alerts', description: 'Warn when <span class="notranslate">RAYA</span>/contribution limits are near', icon: 'fa-chart-pie', default: true },
    { id: 'email_billing', label: 'Billing Notifications', description: 'Payment receipts and renewal reminders', icon: 'fa-credit-card', default: true }
  ];

  // HTML Template - Accordion Structure
  function render() {
    const school = window.SchoolsDashboard?.currentSchool || {};
    const currentLang = localStorage.getItem('preferredLang') || 'en';
    const notifications = JSON.parse(localStorage.getItem('settings_notifications') || '{}');
    const pushSupported = 'serviceWorker' in navigator && 'PushManager' in window;

    return `
      <div class="settings-header">
        <h2><i class="fas fa-cog"></i> Settings</h2>
        <p>Configure your dashboard preferences and account settings.</p>
      </div>

      <div class="settings-accordion">

        <!-- 1. School Profile -->
        <div class="accordion-item" data-accordion="profile">
          <button class="accordion-header" type="button">
            <div class="accordion-header-content">
              <i class="fas fa-school accordion-icon"></i>
              <div class="accordion-header-text">
                <span class="accordion-title">School Profile</span>
                <span class="accordion-subtitle">School name, contact info, location</span>
              </div>
            </div>
            <i class="fas fa-chevron-down accordion-arrow"></i>
          </button>
          <div class="accordion-content">
            <div class="accordion-body">
              <div class="profile-form">
                <div class="form-row">
                  <div class="form-group">
                    <label for="settings-school-name">School Name</label>
                    <input type="text" id="settings-school-name" value="${school.name || 'My School'}" class="settings-input">
                  </div>
                  <div class="form-group">
                    <label for="settings-school-code">School Code</label>
                    <input type="text" id="settings-school-code" value="${school.adminKey || 'SCH-001'}" class="settings-input" disabled>
                    <small class="input-hint">Contact support to change</small>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="settings-admin-email">Admin Email</label>
                    <input type="email" id="settings-admin-email" value="${school.adminEmail || 'admin@school.com'}" class="settings-input">
                  </div>
                  <div class="form-group">
                    <label for="settings-admin-phone">Phone Number</label>
                    <input type="tel" id="settings-admin-phone" value="${school.phone || '+237 6XX XXX XXX'}" class="settings-input" placeholder="+237 6XX XXX XXX">
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="settings-school-location">Location / City</label>
                    <input type="text" id="settings-school-location" value="${school.location || ''}" class="settings-input" placeholder="e.g., Douala, Cameroon">
                  </div>
                  <div class="form-group">
                    <label for="settings-school-type">School Type</label>
                    <select id="settings-school-type" class="settings-select">
                      <option value="primary" ${school.type === 'primary' ? 'selected' : ''}>Primary School</option>
                      <option value="secondary" ${school.type === 'secondary' ? 'selected' : ''}>Secondary School</option>
                      <option value="high" ${school.type === 'high' ? 'selected' : ''}>High School</option>
                      <option value="mixed" ${!school.type || school.type === 'mixed' ? 'selected' : ''}>Mixed (All levels)</option>
                    </select>
                  </div>
                </div>

                <div class="form-actions">
                  <button type="button" class="btn-save-profile" id="btn-save-profile">
                    <i class="fas fa-save"></i> Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Language -->
        <div class="accordion-item" data-accordion="language">
          <button class="accordion-header" type="button">
            <div class="accordion-header-content">
              <i class="fas fa-globe accordion-icon"></i>
              <div class="accordion-header-text">
                <span class="accordion-title">Language</span>
                <span class="accordion-subtitle">Dashboard display language</span>
              </div>
            </div>
            <i class="fas fa-chevron-down accordion-arrow"></i>
          </button>
          <div class="accordion-content">
            <div class="accordion-body">
              <div class="language-selector">
                <div class="language-options" id="language-options">
                  ${languagesData.map(lang => `
                    <button class="language-option ${currentLang === lang.code ? 'active' : ''}" data-lang="${lang.code}">
                      <span class="lang-flag">${lang.flag}</span>
                      <span class="lang-name">${lang.name}</span>
                    </button>
                  `).join('')}
                </div>
              </div>
              <p class="settings-note">
                <i class="fas fa-info-circle"></i>
                Translation is powered by Google Translate. Some content may not be perfectly translated.
              </p>
            </div>
          </div>
        </div>

        <!-- 3. Notifications -->
        <div class="accordion-item" data-accordion="notifications">
          <button class="accordion-header" type="button">
            <div class="accordion-header-content">
              <i class="fas fa-bell accordion-icon"></i>
              <div class="accordion-header-text">
                <span class="accordion-title">Notifications</span>
                <span class="accordion-subtitle">Email alerts and reminders</span>
              </div>
            </div>
            <i class="fas fa-chevron-down accordion-arrow"></i>
          </button>
          <div class="accordion-content">
            <div class="accordion-body">
              <div class="notifications-list">
                ${notificationSettings.map(notif => {
                  let isChecked;
                  if (notif.special === 'sound') {
                    isChecked = window.SchoolsUtils?.SchoolsAudio?.isEnabled() ?? true;
                  } else if (notif.special === 'push') {
                    isChecked = window.SchoolsUtils?.SchoolsPush?.isEnabled() ?? false;
                  } else {
                    isChecked = notifications[notif.id] !== undefined ? notifications[notif.id] : notif.default;
                  }
                  const disabled = notif.special === 'push' && !pushSupported;
                  const hint = disabled ? ' <span style="font-size:0.75rem;opacity:0.6">(not supported in this browser)</span>' : '';
                  return `
                    <div class="notification-item">
                      <div class="notification-info">
                        <i class="fas ${notif.icon}"></i>
                        <div>
                          <h4>${notif.label}${hint}</h4>
                          <p>${notif.description}</p>
                        </div>
                      </div>
                      <label class="toggle-switch">
                        <input type="checkbox" class="notification-toggle" data-id="${notif.id}"
                          data-special="${notif.special || ''}"
                          ${isChecked ? 'checked' : ''}
                          ${disabled ? 'disabled' : ''}>
                        <span class="toggle-slider"></span>
                      </label>
                    </div>
                  `;
                }).join('')}
              </div>
              <div class="form-actions">
                <button type="button" class="btn-secondary" id="btn-save-notifications">
                  <i class="fas fa-save"></i> Save Notification Preferences
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. Security & Privacy (merged) -->
        <div class="accordion-item" data-accordion="security">
          <button class="accordion-header" type="button">
            <div class="accordion-header-content">
              <i class="fas fa-shield-alt accordion-icon"></i>
              <div class="accordion-header-text">
                <span class="accordion-title">Security & Privacy</span>
                <span class="accordion-subtitle">Password, 2FA, data controls</span>
              </div>
            </div>
            <i class="fas fa-chevron-down accordion-arrow"></i>
          </button>
          <div class="accordion-content">
            <div class="accordion-body">
              <!-- Security Options -->
              <div class="settings-subsection">
                <h4 class="subsection-title"><i class="fas fa-lock"></i> Security</h4>
                <div class="security-options">
                  <div class="security-item">
                    <div class="security-info">
                      <i class="fas fa-key"></i>
                      <div>
                        <h4>Change Password</h4>
                        <p>Update your admin password</p>
                      </div>
                    </div>
                    <button class="btn-security" id="btn-change-password">
                      <i class="fas fa-edit"></i> Change
                    </button>
                  </div>

                  <div class="security-item">
                    <div class="security-info">
                      <i class="fas fa-mobile-alt"></i>
                      <div>
                        <h4>Two-Factor Authentication</h4>
                        <p>Add an extra layer of security</p>
                      </div>
                    </div>
                    <div class="security-status">
                      <span class="status-badge disabled">Disabled</span>
                      <button class="btn-security" id="btn-enable-2fa">
                        <i class="fas fa-plus"></i> Enable
                      </button>
                    </div>
                  </div>

                  <div class="security-item">
                    <div class="security-info">
                      <i class="fas fa-users-cog"></i>
                      <div>
                        <h4>Admin Users</h4>
                        <p>Manage who can access this dashboard</p>
                      </div>
                    </div>
                    <button class="btn-security" id="btn-manage-admins">
                      <i class="fas fa-user-plus"></i> Manage
                      <span class="pro-badge-small"><i class="fas fa-crown"></i></span>
                    </button>
                  </div>

                  <div class="security-item">
                    <div class="security-info">
                      <i class="fas fa-history"></i>
                      <div>
                        <h4>Login History</h4>
                        <p>View recent login activity</p>
                      </div>
                    </div>
                    <button class="btn-security" id="btn-login-history">
                      <i class="fas fa-eye"></i> View
                    </button>
                  </div>
                </div>
              </div>

              <!-- Data & Privacy Options -->
              <div class="settings-subsection">
                <h4 class="subsection-title"><i class="fas fa-database"></i> Data & Privacy</h4>
                <div class="data-options">
                  <div class="data-item">
                    <div class="data-info">
                      <i class="fas fa-download"></i>
                      <div>
                        <h4>Export All Data</h4>
                        <p>Download all your school's data in a portable format</p>
                      </div>
                    </div>
                    <button class="btn-data" id="btn-export-all-data">
                      <i class="fas fa-file-archive"></i> Export
                    </button>
                  </div>

                  <div class="data-item">
                    <div class="data-info">
                      <i class="fas fa-broom"></i>
                      <div>
                        <h4>Clear Cache</h4>
                        <p>Clear locally stored data to free up space</p>
                      </div>
                    </div>
                    <button class="btn-data" id="btn-clear-cache">
                      <i class="fas fa-eraser"></i> Clear
                    </button>
                  </div>

                  <div class="data-item">
                    <div class="data-info">
                      <i class="fas fa-chart-bar"></i>
                      <div>
                        <h4>Analytics Opt-out</h4>
                        <p>Choose whether to share anonymous usage data</p>
                      </div>
                    </div>
                    <label class="toggle-switch">
                      <input type="checkbox" id="analytics-opt-out">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div class="privacy-links">
                  <a href="#" class="privacy-link" id="link-privacy-policy">
                    <i class="fas fa-file-contract"></i> Privacy Policy
                  </a>
                  <a href="#" class="privacy-link" id="link-terms">
                    <i class="fas fa-gavel"></i> Terms of Service
                  </a>
                  <a href="#" class="privacy-link" id="link-gdpr">
                    <i class="fas fa-user-shield"></i> GDPR Rights
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 5. Danger Zone -->
        <div class="accordion-item accordion-danger" data-accordion="danger">
          <button class="accordion-header" type="button">
            <div class="accordion-header-content">
              <i class="fas fa-exclamation-triangle accordion-icon"></i>
              <div class="accordion-header-text">
                <span class="accordion-title">Danger Zone</span>
                <span class="accordion-subtitle">Reset settings, delete data</span>
              </div>
            </div>
            <i class="fas fa-chevron-down accordion-arrow"></i>
          </button>
          <div class="accordion-content">
            <div class="accordion-body">
              <p class="danger-warning">
                <i class="fas fa-exclamation-circle"></i>
                These actions are permanent and cannot be undone.
              </p>
              <div class="danger-options">
                <div class="danger-item">
                  <div class="danger-info">
                    <h4>Reset Dashboard</h4>
                    <p>Reset all settings to default values</p>
                  </div>
                  <button class="btn-danger-outline" id="btn-reset-settings">
                    <i class="fas fa-undo"></i> Reset
                  </button>
                </div>

                <div class="danger-item">
                  <div class="danger-info">
                    <h4>Delete All Data</h4>
                    <p>Permanently delete all your school's data from Bluestift</p>
                  </div>
                  <button class="btn-danger" id="btn-delete-data">
                    <i class="fas fa-trash-alt"></i> Delete Everything
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- APPEARANCE SECTION - Commented out for MVP
      <div class="accordion-item" data-accordion="appearance">
        <button class="accordion-header" type="button">
          <div class="accordion-header-content">
            <i class="fas fa-palette accordion-icon"></i>
            <div class="accordion-header-text">
              <span class="accordion-title">Appearance</span>
              <span class="accordion-subtitle">Theme and colors</span>
            </div>
          </div>
          <i class="fas fa-chevron-down accordion-arrow"></i>
        </button>
        <div class="accordion-content">
          <div class="accordion-body">
            <div class="appearance-options">
              <div class="theme-selector">
                <div class="theme-option" data-theme="light">
                  <div class="theme-preview light">
                    <div class="preview-header"></div>
                    <div class="preview-content">
                      <div class="preview-card"></div>
                      <div class="preview-card"></div>
                    </div>
                  </div>
                  <span>Light Mode</span>
                  <span class="pro-badge"><i class="fas fa-crown"></i> Soon</span>
                </div>
                <div class="theme-option active" data-theme="dark">
                  <div class="theme-preview dark">
                    <div class="preview-header"></div>
                    <div class="preview-content">
                      <div class="preview-card"></div>
                      <div class="preview-card"></div>
                    </div>
                  </div>
                  <span>Dark Mode</span>
                  <span class="current-badge"><i class="fas fa-check"></i> Current</span>
                </div>
              </div>
              <div class="accent-color-section">
                <h4>Accent Color</h4>
                <div class="color-options">
                  <button class="color-option active" data-color="purple" style="background: linear-gradient(135deg, #667eea, #764ba2);"></button>
                  <button class="color-option" data-color="blue" style="background: linear-gradient(135deg, #3b82f6, #1d4ed8);"></button>
                  <button class="color-option" data-color="green" style="background: linear-gradient(135deg, #10b981, #059669);"></button>
                  <button class="color-option" data-color="orange" style="background: linear-gradient(135deg, #f59e0b, #d97706);"></button>
                  <button class="color-option" data-color="pink" style="background: linear-gradient(135deg, #ec4899, #db2777);"></button>
                </div>
                <p class="settings-note"><i class="fas fa-crown"></i> Custom colors available with Pro plan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      END APPEARANCE SECTION -->
    `;
  }

  // Initialize section
  function init() {
    initAccordion();
    initLanguageSelector();
    initProfileForm();
    initNotifications();
    initSecurity();
    initDataPrivacy();
    initDangerZone();
  }

  // ==========================================
  // ACCORDION FUNCTIONALITY
  // ==========================================
  function initAccordion() {
    const accordionHeaders = document.querySelectorAll('.settings-accordion .accordion-header');

    accordionHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const item = header.closest('.accordion-item');
        const isOpen = item.classList.contains('open');

        // Close all other accordions (single open mode)
        document.querySelectorAll('.settings-accordion .accordion-item.open').forEach(openItem => {
          if (openItem !== item) {
            openItem.classList.remove('open');
          }
        });

        // Toggle current accordion
        item.classList.toggle('open', !isOpen);
      });
    });

    // Open first accordion by default
    const firstAccordion = document.querySelector('.settings-accordion .accordion-item');
    if (firstAccordion) {
      firstAccordion.classList.add('open');
    }
  }

  // ==========================================
  // LANGUAGE SELECTOR (Keep existing functionality)
  // ==========================================
  function initLanguageSelector() {
    const languageOptions = document.querySelectorAll('#language-options .language-option');

    languageOptions.forEach(option => {
      option.addEventListener('click', () => {
        const lang = option.getAttribute('data-lang');

        // Update active state
        languageOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');

        // Store preference
        localStorage.setItem('preferredLang', lang);

        // Trigger Google Translate
        triggerGoogleTranslate(lang);

        window.SchoolsUtils?.showSchoolNotification(
          `Language changed to ${option.querySelector('.lang-name').textContent}`,
          'success'
        );
      });
    });
  }

  function triggerGoogleTranslate(langCode) {
    // Find Google Translate select element and trigger change
    const selectElement = document.querySelector('.goog-te-combo');
    if (selectElement) {
      selectElement.value = langCode;
      selectElement.dispatchEvent(new Event('change'));
    } else {
      // Fallback: set Google Translate cookies properly
      // First, clear any existing googtrans cookies
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + ';';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + window.location.hostname + ';';

      // Set new cookie with proper format for Google Translate
      const cookieValue = '/en/' + langCode;
      document.cookie = 'googtrans=' + cookieValue + '; path=/;';
      document.cookie = 'googtrans=' + cookieValue + '; path=/; domain=' + window.location.hostname + ';';

      // Reload to apply translation
      setTimeout(() => {
        window.location.reload();
      }, 300);
    }
  }

  // ==========================================
  // PROFILE FORM
  // ==========================================
  function initProfileForm() {
    document.getElementById('btn-save-profile')?.addEventListener('click', async () => {
      const schoolName = document.getElementById('settings-school-name')?.value;
      const adminEmail = document.getElementById('settings-admin-email')?.value;
      const phone = document.getElementById('settings-admin-phone')?.value;
      const location = document.getElementById('settings-school-location')?.value;
      const schoolType = document.getElementById('settings-school-type')?.value;

      const updates = { name: schoolName, email: adminEmail, phone, city: location, school_type: schoolType };

      // Always save to localStorage as cache
      localStorage.setItem('settings_profile', JSON.stringify(updates));

      if (typeof SchoolsDB !== 'undefined' && SchoolsDB.isLive) {
        const btn = document.getElementById('btn-save-profile');
        const originalHTML = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

        const result = await SchoolsDB.updateSchoolProfile(updates);

        btn.disabled = false;
        btn.innerHTML = originalHTML;

        if (!result.success) {
          window.SchoolsUtils?.showSchoolNotification('Failed to save: ' + (result.error || 'Unknown error'), 'error');
          return;
        }
      }

      window.SchoolsUtils?.showSchoolNotification('School profile updated successfully!', 'success');
    });
  }

  // ==========================================
  // NOTIFICATIONS
  // ==========================================
  function initNotifications() {
    // Sound toggle — takes effect immediately
    const soundToggle = document.querySelector('.notification-toggle[data-id="sound_enabled"]');
    soundToggle?.addEventListener('change', () => {
      window.SchoolsUtils?.SchoolsAudio?.setEnabled(soundToggle.checked);
      if (soundToggle.checked) {
        window.SchoolsUtils?.SchoolsAudio?.play('success');
      }
    });

    // Push toggle — requests browser permission
    const pushToggle = document.querySelector('.notification-toggle[data-id="push_enabled"]');
    pushToggle?.addEventListener('change', async () => {
      if (pushToggle.checked) {
        pushToggle.disabled = true;
        const result = await window.SchoolsUtils?.SchoolsPush?.enable();
        pushToggle.disabled = false;
        if (!result?.success) {
          pushToggle.checked = false;
          window.SchoolsUtils?.showSchoolNotification(
            result?.error || 'Could not enable push notifications.',
            'error'
          );
        } else {
          window.SchoolsUtils?.showSchoolNotification(
            'Push notifications enabled! You will be alerted when new messages arrive.',
            'success'
          );
        }
      } else {
        await window.SchoolsUtils?.SchoolsPush?.disable();
        window.SchoolsUtils?.showSchoolNotification('Push notifications disabled.', 'info');
      }
    });

    // Save button for email preferences
    document.getElementById('btn-save-notifications')?.addEventListener('click', () => {
      const toggles = document.querySelectorAll('.notification-toggle:not([data-special])');
      const settings = {};
      toggles.forEach(toggle => {
        settings[toggle.dataset.id] = toggle.checked;
      });
      localStorage.setItem('settings_notifications', JSON.stringify(settings));
      window.SchoolsUtils?.showSchoolNotification('Notification preferences saved!', 'success');
    });
  }

  // ==========================================
  // APPEARANCE - Commented out for MVP
  // ==========================================
  // function initAppearance() { ... }

  // ==========================================
  // SECURITY
  // ==========================================
  function initSecurity() {
    document.getElementById('btn-change-password')?.addEventListener('click', async () => {
      if (typeof SchoolsDB !== 'undefined' && SchoolsDB.isLive && SchoolsDB.currentAdmin?.email) {
        const newPassword = prompt('Enter your new password (min 6 characters):');
        if (!newPassword || newPassword.length < 6) {
          window.SchoolsUtils?.showSchoolNotification('Password must be at least 6 characters.', 'error');
          return;
        }
        // Supabase client is available via SchoolsDB internals — use auth directly
        try {
          const supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
          const { error } = await supabase.auth.updateUser({ password: newPassword });
          if (error) throw error;
          window.SchoolsUtils?.showSchoolNotification('Password updated successfully!', 'success');
        } catch (err) {
          window.SchoolsUtils?.showSchoolNotification('Failed to update password: ' + err.message, 'error');
        }
      } else {
        window.SchoolsUtils?.showSchoolNotification('Password change is not available in demo mode.', 'warning');
      }
    });

    document.getElementById('btn-enable-2fa')?.addEventListener('click', () => {
      window.SchoolsUtils?.showSchoolNotification(
        'Two-factor authentication coming soon.',
        'warning'
      );
    });

    document.getElementById('btn-manage-admins')?.addEventListener('click', () => {
      window.SchoolsUtils?.showSchoolNotification(
        'Multi-admin management requires a Pro plan.',
        'warning'
      );
    });

    document.getElementById('btn-login-history')?.addEventListener('click', () => {
      // Show a simple login history modal or notification
      const history = [
        { date: 'Today, 10:32 AM', device: 'Chrome on Windows', location: 'Douala, CM' },
        { date: 'Yesterday, 3:15 PM', device: 'Safari on iPhone', location: 'Douala, CM' },
        { date: 'Jan 30, 9:00 AM', device: 'Chrome on Windows', location: 'Douala, CM' }
      ];

      let message = 'Recent logins:\n';
      history.forEach(h => {
        message += `• ${h.date} - ${h.device}\n`;
      });

      window.SchoolsUtils?.showSchoolNotification(
        'Login history: Last login was today at 10:32 AM from Chrome on Windows.',
        'info'
      );
    });
  }

  // ==========================================
  // DATA & PRIVACY
  // ==========================================
  function initDataPrivacy() {
    document.getElementById('btn-export-all-data')?.addEventListener('click', () => {
      window.SchoolsUtils?.showSchoolNotification(
        'Preparing your data export... This may take a few moments.',
        'info'
      );

      setTimeout(() => {
        window.SchoolsUtils?.showSchoolNotification(
          'Data export ready! Download will start automatically. (Demo mode)',
          'success'
        );
      }, 2000);
    });

    document.getElementById('btn-clear-cache')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear the local cache? You will need to reload the dashboard.')) {
        // Clear specific keys, not everything
        const keysToKeep = ['preferredLang', 'settings_profile'];
        const allKeys = Object.keys(localStorage);

        allKeys.forEach(key => {
          if (!keysToKeep.includes(key) && (key.startsWith('settings_') || key.startsWith('export_'))) {
            localStorage.removeItem(key);
          }
        });

        window.SchoolsUtils?.showSchoolNotification(
          'Cache cleared successfully!',
          'success'
        );
      }
    });

    // Privacy links
    document.getElementById('link-privacy-policy')?.addEventListener('click', (e) => {
      e.preventDefault();
      window.SchoolsUtils?.showSchoolNotification(
        'Opening Privacy Policy... (Will open in new tab)',
        'info'
      );
    });

    document.getElementById('link-terms')?.addEventListener('click', (e) => {
      e.preventDefault();
      window.SchoolsUtils?.showSchoolNotification(
        'Opening Terms of Service... (Will open in new tab)',
        'info'
      );
    });

    document.getElementById('link-gdpr')?.addEventListener('click', (e) => {
      e.preventDefault();
      window.SchoolsUtils?.showSchoolNotification(
        'Opening GDPR Rights information... (Will open in new tab)',
        'info'
      );
    });
  }

  // ==========================================
  // DANGER ZONE
  // ==========================================
  function initDangerZone() {
    document.getElementById('btn-reset-settings')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all settings to default? This cannot be undone.')) {
        // Reset settings
        localStorage.removeItem('settings_notifications');
        localStorage.removeItem('settings_darkMode');
        localStorage.removeItem('settings_profile');

        window.SchoolsUtils?.showSchoolNotification(
          'Settings have been reset to defaults. Refreshing...',
          'warning'
        );

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    });

    document.getElementById('btn-delete-data')?.addEventListener('click', () => {
      const confirmText = prompt('This will permanently delete ALL your school data. Type "DELETE" to confirm:');

      if (confirmText === 'DELETE') {
        window.SchoolsUtils?.showSchoolNotification(
          'Data deletion request submitted. Our team will contact you within 24 hours to confirm. (Demo mode)',
          'warning'
        );
      } else if (confirmText !== null) {
        window.SchoolsUtils?.showSchoolNotification(
          'Deletion cancelled. You must type "DELETE" exactly to confirm.',
          'info'
        );
      }
    });
  }

  // Register section
  window.SchoolsSections.register('settings', { render, init });

})();
