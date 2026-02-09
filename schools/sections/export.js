// ==========================================
// SECTION: Export Data
// Template and logic for data export features
// ==========================================

(function() {
  'use strict';

  // Section state
  let exportHistory = [];

  // HTML Template
  function render() {
    return `
      <h2><i class="fas fa-download"></i> Export Data</h2>
      <p>Download reports and analytics data for your school.</p>

      <!-- Export Filters -->
      <div class="export-filters">
        <div class="filter-group">
          <label for="export-period">
            <i class="fas fa-calendar-alt"></i> Period
          </label>
          <select id="export-period" class="export-select">
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
            <option value="this-quarter">This Quarter</option>
            <option value="this-year" selected>This School Year</option>
            <option value="custom">Custom Range...</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="export-class-filter">
            <i class="fas fa-users"></i> Class
          </label>
          <select id="export-class-filter" class="export-select">
            <option value="all" selected>All Classes</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="export-subject-filter">
            <i class="fas fa-book"></i> Subject
          </label>
          <select id="export-subject-filter" class="export-select">
            <option value="all" selected>All Subjects</option>
            <option value="mathematics">Mathematics</option>
            <option value="physics">Physics</option>
            <option value="chemistry">Chemistry</option>
            <option value="biology">Biology</option>
            <option value="french">French</option>
            <option value="english">English</option>
            <option value="history">History & Geography</option>
            <option value="computer-science">Computer Science</option>
            <option value="philosophy">Philosophy</option>
          </select>
        </div>
      </div>

      <!-- Custom Date Range (hidden by default) -->
      <div class="custom-date-range" id="custom-date-range" style="display: none;">
        <div class="date-inputs">
          <div class="date-input-group">
            <label for="export-date-start">Start Date</label>
            <input type="date" id="export-date-start" class="export-date-input">
          </div>
          <span class="date-separator">to</span>
          <div class="date-input-group">
            <label for="export-date-end">End Date</label>
            <input type="date" id="export-date-end" class="export-date-input">
          </div>
        </div>
      </div>

      <!-- Export Cards Grid -->
      <div class="export-cards-grid">
        ${renderExportCard('performance', 'fa-chart-line', 'Performance Report',
          'Complete overview of school performance: PKM averages, completion rates, time spent, and trends.',
          ['PKM by class', 'Completion rates', 'Weekly trends'], ['pdf', 'excel'])}

        ${renderExportCard('class', 'fa-users', 'Class Report',
          'Detailed analysis of a specific class with individual student metrics and comparisons.',
          ['Student list', 'Individual PKM', 'Class ranking'], ['pdf', 'excel'])}

        ${renderExportCard('subject', 'fa-brain', 'Subject Analysis',
          'Deep dive into subject performance: difficulties detected, mastered concepts, and recommendations.',
          ['Difficulty areas', 'Mastered topics', 'Recommendations'], ['pdf', 'excel'])}

        ${renderExportCard('progress', 'fa-chart-area', 'Progress Report',
          'Track evolution over time with charts showing improvement trends and engagement patterns.',
          ['Monthly trends', 'Growth charts', 'Comparisons'], ['pdf', 'excel'])}

        ${renderExportCard('students', 'fa-user-graduate', 'Student Data',
          'Export raw student data for custom analysis. Includes all metrics and activity logs.',
          ['All metrics', 'Activity logs', 'Streak data'], ['csv', 'excel'])}

        <!-- Full Data Export -->
        <div class="export-card export-card-full" data-export-type="full">
          <div class="export-card-icon">
            <i class="fas fa-database"></i>
          </div>
          <div class="export-card-content">
            <h3>Full Data Export</h3>
            <p>Complete data dump including all classes, subjects, students, and historical data.</p>
            <div class="export-includes">
              <span><i class="fas fa-check"></i> Everything included</span>
              <span><i class="fas fa-check"></i> Historical data</span>
              <span><i class="fas fa-check"></i> Raw format</span>
            </div>
          </div>
          <div class="export-card-actions">
            <button class="btn-export btn-export-primary" data-format="excel" data-type="full">
              <i class="fas fa-file-excel"></i> Export All (Excel)
            </button>
          </div>
        </div>
      </div>

      <!-- Scheduled Exports (Pro Feature) -->
      <div class="scheduled-exports-section">
        <div class="section-header">
          <h3><i class="fas fa-clock"></i> Scheduled Exports</h3>
          <span class="pro-badge"><i class="fas fa-crown"></i> Pro</span>
        </div>
        <p class="section-description">Automatically receive reports in your inbox.</p>

        <div class="scheduled-list" id="scheduled-exports-list">
          <div class="scheduled-item">
            <div class="scheduled-info">
              <i class="fas fa-file-pdf"></i>
              <div>
                <strong>Weekly Performance Report</strong>
                <span>Every Monday at 8:00 AM</span>
              </div>
            </div>
            <div class="scheduled-actions">
              <button class="btn-icon" title="Edit"><i class="fas fa-edit"></i></button>
              <button class="btn-icon btn-icon-danger" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
          </div>

          <div class="scheduled-item">
            <div class="scheduled-info">
              <i class="fas fa-file-excel"></i>
              <div>
                <strong>Monthly Student Data</strong>
                <span>1st of each month at 9:00 AM</span>
              </div>
            </div>
            <div class="scheduled-actions">
              <button class="btn-icon" title="Edit"><i class="fas fa-edit"></i></button>
              <button class="btn-icon btn-icon-danger" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
          </div>
        </div>

        <button class="btn-add-schedule" id="btn-add-schedule">
          <i class="fas fa-plus"></i> Add Scheduled Export
        </button>
      </div>

      <!-- Export History -->
      <div class="export-history-section">
        <div class="section-header">
          <h3><i class="fas fa-history"></i> Recent Exports</h3>
          <button class="btn-clear-history" id="btn-clear-history">
            <i class="fas fa-trash-alt"></i> Clear
          </button>
        </div>

        <div class="export-history-list" id="export-history-list">
          <div class="history-empty">
            <i class="fas fa-inbox"></i>
            <p>No recent exports</p>
          </div>
        </div>
      </div>
    `;
  }

  // Helper to render export card
  function renderExportCard(type, icon, title, description, includes, formats) {
    const formatButtons = formats.map(f => {
      const iconMap = { pdf: 'fa-file-pdf', excel: 'fa-file-excel', csv: 'fa-file-csv' };
      return `<button class="btn-export" data-format="${f}" data-type="${type}">
        <i class="fas ${iconMap[f]}"></i> ${f.toUpperCase()}
      </button>`;
    }).join('');

    const includesBadges = includes.map(i =>
      `<span><i class="fas fa-check"></i> ${i}</span>`
    ).join('');

    return `
      <div class="export-card" data-export-type="${type}">
        <div class="export-card-icon">
          <i class="fas ${icon}"></i>
        </div>
        <div class="export-card-content">
          <h3>${title}</h3>
          <p>${description}</p>
          <div class="export-includes">${includesBadges}</div>
        </div>
        <div class="export-card-actions">${formatButtons}</div>
      </div>
    `;
  }

  // Initialize section
  function init() {
    initPeriodSelector();
    populateClassFilter();
    initExportButtons();
    initScheduleButton();
    initClearHistoryButton();
    loadExportHistory();
  }

  function initPeriodSelector() {
    const periodSelect = document.getElementById('export-period');
    const customDateRange = document.getElementById('custom-date-range');

    if (periodSelect && customDateRange) {
      periodSelect.addEventListener('change', () => {
        if (periodSelect.value === 'custom') {
          customDateRange.style.display = 'block';
          const today = new Date();
          const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
          document.getElementById('export-date-start').value = monthAgo.toISOString().split('T')[0];
          document.getElementById('export-date-end').value = today.toISOString().split('T')[0];
        } else {
          customDateRange.style.display = 'none';
        }
      });
    }
  }

  function populateClassFilter() {
    const classFilter = document.getElementById('export-class-filter');
    if (!classFilter) return;

    const classes = ['12th Grade A', '12th Grade B', '12th Grade C', '11th Grade A', '11th Grade B', '10th Grade A', '10th Grade B'];
    classes.forEach(className => {
      const option = document.createElement('option');
      option.value = className.toLowerCase().replace(/\s+/g, '-');
      option.textContent = className;
      classFilter.appendChild(option);
    });
  }

  function initExportButtons() {
    document.querySelectorAll('.btn-export').forEach(btn => {
      btn.addEventListener('click', () => {
        const format = btn.getAttribute('data-format');
        const type = btn.getAttribute('data-type');
        handleExport(type, format, btn);
      });
    });
  }

  function initScheduleButton() {
    document.getElementById('btn-add-schedule')?.addEventListener('click', () => {
      window.SchoolsUtils?.showSchoolNotification(
        'Scheduled exports feature coming soon! Contact support to set up automated reports.',
        'info'
      );
    });
  }

  function initClearHistoryButton() {
    document.getElementById('btn-clear-history')?.addEventListener('click', clearExportHistory);
  }

  function getExportFilters() {
    const period = document.getElementById('export-period')?.value || 'this-year';
    const classFilter = document.getElementById('export-class-filter')?.value || 'all';
    const subjectFilter = document.getElementById('export-subject-filter')?.value || 'all';

    let dateRange = {};
    if (period === 'custom') {
      dateRange = {
        start: document.getElementById('export-date-start')?.value,
        end: document.getElementById('export-date-end')?.value
      };
    }

    return { period, classFilter, subjectFilter, dateRange };
  }

  function getReportTitle(type) {
    const titles = {
      'performance': 'Performance Report',
      'class': 'Class Report',
      'subject': 'Subject Analysis',
      'progress': 'Progress Report',
      'students': 'Student Data',
      'full': 'Full Data Export'
    };
    return titles[type] || 'Report';
  }

  function handleExport(type, format, btn) {
    const filters = getExportFilters();
    const reportTitle = getReportTitle(type);

    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';

    setTimeout(() => {
      const date = new Date();
      const dateStr = date.toISOString().split('T')[0];
      const schoolName = window.SchoolsDashboard?.currentSchool?.name?.replace(/\s+/g, '_') || 'School';
      const filename = `${schoolName}_${type}_${dateStr}.${format === 'excel' ? 'xlsx' : format}`;

      addToExportHistory({
        type, format, title: reportTitle, filename, filters,
        timestamp: date.toISOString()
      });

      btn.disabled = false;
      btn.innerHTML = originalHTML;

      window.SchoolsUtils?.showSchoolNotification(
        `${reportTitle} exported successfully as ${format.toUpperCase()}!`,
        'success'
      );

      simulateDownload(filename, format, type);
    }, 1500);
  }

  function simulateDownload(filename, format, type) {
    if (format === 'pdf') {
      window.SchoolsUtils?.showSchoolNotification(
        'PDF generation requires server-side processing. Contact support for PDF exports.',
        'info'
      );
      return;
    }

    const content = generateCSVContent(type);
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  function generateCSVContent(type) {
    const mockData = window.SchoolsDashboard?.currentSchool ? null : null; // Placeholder

    const headers = {
      'performance': ['Metric', 'Value', 'Change'],
      'class': ['Student ID', 'Name', 'PKM', 'Completion', 'Time Spent', 'Streak'],
      'subject': ['Subject', 'PKM', 'Difficulty', 'Effort', 'Recommendations'],
      'progress': ['Date', 'PKM', 'Completion Rate', 'Active Students'],
      'students': ['ID', 'Class', 'PKM', 'Lessons', 'Time', 'Streak', 'Last Active'],
      'full': ['Type', 'Class', 'Subject', 'Metric', 'Value']
    };

    const data = {
      'performance': [
        ['Active Students', '156', '+5%'],
        ['Average PKM', '0.72', '+0.02'],
        ['Completion Rate', '78%', '+3%'],
        ['Avg Time/Week', '4h 30min', '+30min']
      ],
      'class': [
        ['STU001', 'John Doe', '0.78', '85%', '4h 30min', '12'],
        ['STU002', 'Jane Smith', '0.82', '92%', '5h 15min', '18'],
        ['STU003', 'Bob Wilson', '0.65', '70%', '3h 00min', '5']
      ],
      'subject': [
        ['Mathematics', '0.72', 'Algebra', 'High', 'Focus on equations'],
        ['Physics', '0.68', 'Mechanics', 'Medium', 'More practice problems'],
        ['Chemistry', '0.75', 'Organic', 'High', 'Lab exercises recommended']
      ],
      'progress': [
        ['2025-01-01', '0.68', '75%', '142'],
        ['2025-01-08', '0.70', '78%', '145'],
        ['2025-01-15', '0.72', '80%', '148']
      ],
      'students': [
        ['STU001', '12th A', '0.78', '45', '4h 30min', '12', '2025-01-20'],
        ['STU002', '12th A', '0.82', '52', '5h 15min', '18', '2025-01-20'],
        ['STU003', '12th B', '0.65', '38', '3h 00min', '5', '2025-01-19']
      ],
      'full': [
        ['Global', 'All', 'All', 'Students', '156'],
        ['Global', 'All', 'All', 'PKM', '0.72'],
        ['Global', 'All', 'Math', 'PKM', '0.72'],
        ['Global', 'All', 'Physics', 'PKM', '0.68']
      ]
    };

    const headerRow = headers[type] || ['Data'];
    const dataRows = data[type] || [];

    let csv = headerRow.join(',') + '\n';
    dataRows.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    return csv;
  }

  function addToExportHistory(exportData) {
    exportHistory.unshift(exportData);
    if (exportHistory.length > 10) {
      exportHistory = exportHistory.slice(0, 10);
    }
    localStorage.setItem('bluestift_export_history', JSON.stringify(exportHistory));
    renderExportHistory();
  }

  function loadExportHistory() {
    try {
      const saved = localStorage.getItem('bluestift_export_history');
      if (saved) {
        exportHistory = JSON.parse(saved);
      }
    } catch (e) {
      exportHistory = [];
    }
    renderExportHistory();
  }

  function renderExportHistory() {
    const container = document.getElementById('export-history-list');
    if (!container) return;

    if (exportHistory.length === 0) {
      container.innerHTML = `
        <div class="history-empty">
          <i class="fas fa-inbox"></i>
          <p>No recent exports</p>
        </div>
      `;
      return;
    }

    const iconMap = { pdf: 'fa-file-pdf', excel: 'fa-file-excel', csv: 'fa-file-csv' };

    container.innerHTML = exportHistory.map((exp, index) => {
      const date = new Date(exp.timestamp);
      const dateStr = date.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });

      return `
        <div class="history-item" data-index="${index}">
          <div class="history-info">
            <i class="fas ${iconMap[exp.format] || 'fa-file'}"></i>
            <div>
              <strong>${exp.title}</strong>
              <span>${dateStr} - ${exp.filename}</span>
            </div>
          </div>
          <button class="btn-download" data-index="${index}">
            <i class="fas fa-download"></i> Download
          </button>
        </div>
      `;
    }).join('');

    // Add click handlers for download buttons
    container.querySelectorAll('.btn-download').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.getAttribute('data-index'));
        const exp = exportHistory[index];
        if (exp) simulateDownload(exp.filename, exp.format, exp.type);
      });
    });
  }

  function clearExportHistory() {
    if (confirm('Are you sure you want to clear export history?')) {
      exportHistory = [];
      localStorage.removeItem('bluestift_export_history');
      renderExportHistory();
      window.SchoolsUtils?.showSchoolNotification('Export history cleared.', 'info');
    }
  }

  // Register section
  window.SchoolsSections.register('export', { render, init });

})();
