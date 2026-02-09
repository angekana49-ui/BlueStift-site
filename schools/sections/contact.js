// ==========================================
// SECTION: Help & Support
// Documentation, FAQ, and contact features
// ==========================================

(function() {
  'use strict';

  // ==========================================
  // FAQ DATA - Commented out for MVP
  // ==========================================
  /*
  const faqData = [
    {
      question: "How do I add a new class to my school?",
      answer: "Go to Settings > Class Management and click 'Add Class'. Enter the class name, grade level, and assign a teacher. Students can then be added individually or imported via CSV."
    },
    {
      question: "What does the PKM score mean?",
      answer: "PKM (Personalized Knowledge Mastery) is a score from 0 to 1 that measures how well students have mastered the content. A score above 0.75 indicates strong mastery, 0.65-0.75 is medium, and below 0.65 suggests areas needing improvement."
    },
    {
      question: "How can I export my school's data?",
      answer: "Navigate to the 'Export Data' section from the menu. You can choose different report types (Performance, Class, Subject, etc.) and export in PDF, Excel, or CSV formats."
    },
    {
      question: "How do I contact RAYA for insights?",
      answer: "Click on 'Chat with RAYA' in the menu. You can ask questions like 'Why is the math PKM low in 12th Grade?' or 'Compare my classes in English'. RAYA analyzes your data and provides actionable insights."
    },
    {
      question: "How do I renew or upgrade my subscription?",
      answer: "Go to 'Subscription' in the menu to view your current plan, usage, and renewal options. You can upgrade to Pro for additional features like scheduled exports and priority support."
    },
    {
      question: "Can I give access to other teachers?",
      answer: "Yes! In Settings > User Management, you can invite teachers with specific permissions. They can view their class data while you maintain full administrative control."
    },
    {
      question: "How is student data protected?",
      answer: "All data is encrypted in transit and at rest. We comply with GDPR and local data protection laws. Student information is never shared with third parties and you can request data deletion at any time."
    },
    {
      question: "What's the difference between Free and Pro plans?",
      answer: "Pro includes: unlimited RAYA messages, scheduled exports, priority support, advanced analytics, multi-admin access, and API integration. Free plan has limited RAYA messages and basic features."
    }
  ];
  */

  // ==========================================
  // GUIDE DATA - Commented out for MVP
  // ==========================================
  /*
  const guideData = [
    {
      icon: 'fa-tachometer-alt',
      title: 'Dashboard Overview',
      desc: 'Understand your school\'s performance at a glance',
      steps: [
        'View global statistics (students, PKM, completion rates)',
        'Filter by class to see specific insights',
        'Check subject-by-subject performance in the table',
        'Click "Details" on any subject for deep analysis'
      ]
    },
    {
      icon: 'fa-robot',
      title: 'Using RAYA AI',
      desc: 'Get intelligent insights from your data',
      steps: [
        'Go to "Chat with RAYA" from the menu',
        'Ask questions in natural language',
        'Example: "Why is physics PKM low in 12th Grade?"',
        'RAYA analyzes patterns and gives recommendations'
      ]
    },
    {
      icon: 'fa-download',
      title: 'Exporting Reports',
      desc: 'Download data for meetings and analysis',
      steps: [
        'Go to "Export Data" from the menu',
        'Select period, class, and subject filters',
        'Choose report type (Performance, Class, Subject...)',
        'Download in PDF, Excel, or CSV format'
      ]
    },
    {
      icon: 'fa-upload',
      title: 'Adding Contributions',
      desc: 'Help improve RAYA with your content',
      steps: [
        'Go to "Add Contribution" from the menu',
        'Upload educational documents (PDF, Word, images)',
        'Select subject and difficulty level',
        'Your content trains RAYA for better responses'
      ]
    }
  ];
  */

  // HTML Template - Simplified for MVP
  function render() {
    return `
      <div class="support-header">
        <h2><i class="fas fa-headset"></i> Help & Support</h2>
        <p>Contact us or check the glossary for quick help.</p>
      </div>

      <!-- Contact Section (Primary) -->
      <div class="contact-section">
        <div class="section-header">
          <h3><i class="fas fa-comments"></i> Contact Support</h3>
        </div>
        <p class="section-description">Reach out to our team for assistance.</p>

        <!-- Quick Contact Cards -->
        <div class="contact-cards-grid">
          <div class="contact-card">
            <div class="contact-card-icon whatsapp">
              <i class="fab fa-whatsapp"></i>
            </div>
            <div class="contact-card-content">
              <h4>WhatsApp</h4>
              <p>Quick responses during business hours</p>
              <a href="https://wa.me/237690000000" target="_blank" class="btn-contact">
                <i class="fab fa-whatsapp"></i> Chat Now
              </a>
            </div>
          </div>

          <div class="contact-card">
            <div class="contact-card-icon email">
              <i class="fas fa-envelope"></i>
            </div>
            <div class="contact-card-content">
              <h4>Email</h4>
              <p>For detailed inquiries</p>
              <a href="mailto:support@bluestift.app" class="btn-contact">
                <i class="fas fa-envelope"></i> support@bluestift.app
              </a>
            </div>
          </div>

          <div class="contact-card">
            <div class="contact-card-icon phone">
              <i class="fas fa-phone-alt"></i>
            </div>
            <div class="contact-card-content">
              <h4>Phone</h4>
              <p>Mon-Fri, 8AM - 6PM (WAT)</p>
              <a href="tel:+237690000000" class="btn-contact">
                <i class="fas fa-phone-alt"></i> +237 690 000 000
              </a>
            </div>
          </div>
        </div>

        <!-- Support Form (Collapsible) -->
        <div class="support-form-wrapper">
          <button class="btn-toggle-form" id="toggle-support-form" type="button">
            <i class="fas fa-paper-plane"></i>
            <span>Send a Message</span>
            <i class="fas fa-chevron-down toggle-arrow"></i>
          </button>

          <div class="support-form-container" id="support-form-container">
            <form id="support-form" class="support-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="support-name">Your Name *</label>
                  <input type="text" id="support-name" name="name" required placeholder="Your full name">
                </div>
                <div class="form-group">
                  <label for="support-email">Email *</label>
                  <input type="email" id="support-email" name="email" required placeholder="your@email.com">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="support-category">Category *</label>
                  <select id="support-category" name="category" required>
                    <option value="">Select a category</option>
                    <option value="bug">Bug Report</option>
                    <option value="question">General Question</option>
                    <option value="feature">Feature Request</option>
                    <option value="billing">Billing & Subscription</option>
                    <option value="account">Account Issue</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="support-priority">Priority</label>
                  <select id="support-priority" name="priority">
                    <option value="normal" selected>Normal</option>
                    <option value="high">High - Affecting daily use</option>
                    <option value="urgent">Urgent - System down</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="support-subject">Subject *</label>
                <input type="text" id="support-subject" name="subject" required placeholder="Brief description of your issue">
              </div>

              <div class="form-group">
                <label for="support-message">Message *</label>
                <textarea id="support-message" name="message" rows="4" required placeholder="Please describe your issue in detail..."></textarea>
              </div>

              <div class="form-group">
                <label for="support-screenshot">Attachment (optional)</label>
                <div class="file-upload-area" id="support-file-area">
                  <i class="fas fa-cloud-upload-alt"></i>
                  <p>Drag & drop a screenshot or click to browse</p>
                  <input type="file" id="support-screenshot" name="screenshot" accept="image/*,.pdf">
                </div>
                <div id="support-file-preview" class="file-preview"></div>
              </div>

              <button type="submit" class="btn-submit" id="support-submit-btn">
                <i class="fas fa-paper-plane"></i> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Glossary (Minimal) -->
      <div class="glossary-section">
        <div class="section-header">
          <h3><i class="fas fa-book"></i> Glossary</h3>
        </div>
        <p class="section-description">Key terms used in the dashboard.</p>
        <div class="glossary-grid">
          <div class="glossary-item">
            <strong>PKM</strong>
            <span>Personalized Knowledge Mastery - Score from 0 to 1 measuring content mastery</span>
          </div>
          <div class="glossary-item">
            <strong>RAYA</strong>
            <span>AI assistant that analyzes your data and provides insights</span>
          </div>
          <div class="glossary-item">
            <strong>Streak</strong>
            <span>Consecutive days of learning activity by a student</span>
          </div>
          <div class="glossary-item">
            <strong>Completion Rate</strong>
            <span>Percentage of assigned lessons completed by students</span>
          </div>
        </div>
      </div>

      <!-- Support Hours Info -->
      <div class="support-hours-info">
        <i class="fas fa-clock"></i>
        <div>
          <strong>Support Hours:</strong>
          <span>Monday - Friday, 8:00 AM - 6:00 PM (West Africa Time)</span>
          <span class="support-note">Emergency support available 24/7 for Pro subscribers</span>
        </div>
      </div>

      <!-- ============================================================
           COMMENTED OUT FOR MVP - Will be restored when ready
           ============================================================ -->

      <!-- GETTING STARTED GUIDES - Commented out
      <div class="guide-section">
        <div class="section-header">
          <h3><i class="fas fa-rocket"></i> Getting Started</h3>
        </div>
        <p class="section-description">Learn how to use the dashboard effectively.</p>

        <div class="guide-cards-grid">
          [guideData cards would render here]
        </div>
      </div>
      END GETTING STARTED -->

      <!-- FAQ SECTION - Commented out (FAQ doesn't exist yet)
      <div class="faq-section">
        <div class="section-header">
          <h3><i class="fas fa-question-circle"></i> Frequently Asked Questions</h3>
        </div>

        <div class="faq-list" id="faq-list">
          [faqData items would render here]
        </div>
      </div>
      END FAQ SECTION -->

      <!-- RESOURCES SECTION - Commented out (Documentation in progress)
      <div class="resources-section">
        <div class="section-header">
          <h3><i class="fas fa-folder-open"></i> Resources</h3>
        </div>

        <div class="resources-grid">
          <a href="#" class="resource-card" target="_blank">
            <div class="resource-icon">
              <i class="fas fa-play-circle"></i>
            </div>
            <div class="resource-content">
              <h4>Video Tutorials</h4>
              <p>Watch step-by-step guides on YouTube</p>
            </div>
            <i class="fas fa-external-link-alt resource-arrow"></i>
          </a>

          <a href="#" class="resource-card" target="_blank">
            <div class="resource-icon">
              <i class="fas fa-file-pdf"></i>
            </div>
            <div class="resource-content">
              <h4>User Guide (PDF)</h4>
              <p>Complete documentation for administrators</p>
            </div>
            <i class="fas fa-download resource-arrow"></i>
          </a>

          <a href="#" class="resource-card" target="_blank">
            <div class="resource-icon">
              <i class="fas fa-graduation-cap"></i>
            </div>
            <div class="resource-content">
              <h4>Teacher Training</h4>
              <p>Resources for training your staff</p>
            </div>
            <i class="fas fa-external-link-alt resource-arrow"></i>
          </a>

          <a href="#" class="resource-card" target="_blank">
            <div class="resource-icon">
              <i class="fas fa-newspaper"></i>
            </div>
            <div class="resource-content">
              <h4>What's New</h4>
              <p>Latest features and updates</p>
            </div>
            <i class="fas fa-external-link-alt resource-arrow"></i>
          </a>
        </div>
      </div>
      END RESOURCES SECTION -->
    `;
  }

  // Initialize section
  function init() {
    // Commented out for MVP - sections removed
    // initGuideCards();
    // initFAQ();
    initSupportFormToggle();
    initSupportForm();
    initFileUpload();
    prefillFormFromSchool();
  }

  // ==========================================
  // GUIDE CARDS - Commented out for MVP
  // ==========================================
  // function initGuideCards() {
  //   document.querySelectorAll('.guide-card').forEach(card => {
  //     const header = card.querySelector('.guide-card-header');
  //     header?.addEventListener('click', () => {
  //       const isOpen = card.classList.contains('open');
  //       document.querySelectorAll('.guide-card.open').forEach(openCard => {
  //         if (openCard !== card) openCard.classList.remove('open');
  //       });
  //       card.classList.toggle('open', !isOpen);
  //     });
  //   });
  // }

  // ==========================================
  // FAQ - Commented out for MVP
  // ==========================================
  // function initFAQ() {
  //   document.querySelectorAll('.faq-question').forEach(btn => {
  //     btn.addEventListener('click', () => {
  //       const item = btn.closest('.faq-item');
  //       const isOpen = item.classList.contains('open');
  //       document.querySelectorAll('.faq-item.open').forEach(openItem => {
  //         if (openItem !== item) openItem.classList.remove('open');
  //       });
  //       item.classList.toggle('open', !isOpen);
  //     });
  //   });
  // }

  function initSupportFormToggle() {
    const toggleBtn = document.getElementById('toggle-support-form');
    const container = document.getElementById('support-form-container');

    toggleBtn?.addEventListener('click', () => {
      const isOpen = container.classList.contains('open');
      container.classList.toggle('open', !isOpen);
      toggleBtn.classList.toggle('active', !isOpen);
    });
  }

  function initSupportForm() {
    const form = document.getElementById('support-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = document.getElementById('support-submit-btn');
      const originalHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        console.log('Support request:', data);

        form.reset();
        prefillFormFromSchool();
        document.getElementById('support-file-preview').innerHTML = '';

        // Close form after submission
        document.getElementById('support-form-container')?.classList.remove('open');
        document.getElementById('toggle-support-form')?.classList.remove('active');

        window.SchoolsUtils?.showSchoolNotification(
          'Your message has been sent! We\'ll respond within 24 hours.',
          'success'
        );
      } catch (error) {
        window.SchoolsUtils?.showSchoolNotification(
          'Failed to send message. Please try again or contact us via WhatsApp.',
          'error'
        );
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
      }
    });
  }

  function initFileUpload() {
    const fileArea = document.getElementById('support-file-area');
    const fileInput = document.getElementById('support-screenshot');
    const preview = document.getElementById('support-file-preview');

    if (!fileArea || !fileInput) return;

    fileArea.addEventListener('click', () => fileInput.click());

    fileArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      fileArea.classList.add('dragover');
    });

    fileArea.addEventListener('dragleave', () => {
      fileArea.classList.remove('dragover');
    });

    fileArea.addEventListener('drop', (e) => {
      e.preventDefault();
      fileArea.classList.remove('dragover');
      if (e.dataTransfer.files.length > 0) {
        fileInput.files = e.dataTransfer.files;
        showFilePreview(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        showFilePreview(fileInput.files[0]);
      }
    });

    function showFilePreview(file) {
      if (!preview) return;
      const isImage = file.type.startsWith('image/');
      const sizeMB = (file.size / 1024 / 1024).toFixed(2);

      if (isImage) {
        const reader = new FileReader();
        reader.onload = (e) => {
          preview.innerHTML = `
            <div class="file-preview-item">
              <img src="${e.target.result}" alt="Preview" class="file-preview-image">
              <div class="file-preview-info">
                <span class="file-name">${file.name}</span>
                <span class="file-size">${sizeMB} MB</span>
              </div>
              <button type="button" class="btn-remove-file" title="Remove">
                <i class="fas fa-times"></i>
              </button>
            </div>
          `;
        };
        reader.readAsDataURL(file);
      } else {
        preview.innerHTML = `
          <div class="file-preview-item">
            <i class="fas fa-file-pdf file-preview-icon"></i>
            <div class="file-preview-info">
              <span class="file-name">${file.name}</span>
              <span class="file-size">${sizeMB} MB</span>
            </div>
            <button type="button" class="btn-remove-file" title="Remove">
              <i class="fas fa-times"></i>
            </button>
          </div>
        `;
      }

      preview.querySelector('.btn-remove-file')?.addEventListener('click', () => {
        fileInput.value = '';
        preview.innerHTML = '';
      });
    }
  }

  function prefillFormFromSchool() {
    const school = window.SchoolsDashboard?.currentSchool;
    if (!school) return;

    const nameInput = document.getElementById('support-name');
    const emailInput = document.getElementById('support-email');

    if (nameInput && school.adminName) nameInput.value = school.adminName;
    if (emailInput && school.email) emailInput.value = school.email;
  }

  // Register section
  window.SchoolsSections.register('contact', { render, init });

})();
