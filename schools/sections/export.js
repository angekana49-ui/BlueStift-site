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
          'Detailed analysis of a specific class with aggregate performance metrics and subject comparisons.',
          ['Class PKM average', 'Subject breakdown', 'Completion rates'], ['pdf', 'excel'])}

        ${renderExportCard('subject', 'fa-brain', 'Subject Analysis',
          'Deep dive into subject performance: difficulties detected, mastered concepts, and recommendations.',
          ['Difficulty areas', 'Mastered topics', 'Recommendations'], ['pdf', 'excel'])}

        ${renderExportCard('progress', 'fa-chart-area', 'Progress Report',
          'Track evolution over time with charts showing improvement trends and engagement patterns.',
          ['Monthly trends', 'Growth charts', 'Comparisons'], ['pdf', 'excel'])}

        <!-- Full Data Export -->
        <div class="export-card export-card-full" data-export-type="full">
          <div class="export-card-icon">
            <i class="fas fa-database"></i>
          </div>
          <div class="export-card-content">
            <h3>Full Data Export</h3>
            <p>Complete data dump including all classes, subjects, and historical data.</p>
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
                <strong>Monthly Class Summary</strong>
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

  async function populateClassFilter() {
    const classFilter = document.getElementById('export-class-filter');
    if (!classFilter) return;

    let classes;
    if (typeof SchoolsDB !== 'undefined') {
      classes = await SchoolsDB.getClasses();
    } else {
      // Fallback hardcoded for demo
      classes = [
        { id: 'demo-1', name: '12th Grade A' },
        { id: 'demo-2', name: '12th Grade B' },
        { id: 'demo-3', name: '11th Grade A' },
        { id: 'demo-4', name: '10th Grade A' }
      ];
    }

    classes.forEach(cls => {
      const option = document.createElement('option');
      option.value = cls.id;
      option.textContent = cls.name + (cls.studentCount ? ` (${cls.studentCount} students)` : '');
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
        'Scheduled exports coming soon. Contact support to set up automated reports.',
        'warning'
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
      'full': 'Full Data Export'
    };
    return titles[type] || 'Report';
  }

  async function handleExport(type, format, btn) {
    if (format === 'pdf') {
      window.SchoolsUtils?.showSchoolNotification(
        'PDF exports coming soon. Use Excel/CSV for now.',
        'warning'
      );
      return;
    }

    const filters = getExportFilters();
    const reportTitle = getReportTitle(type);
    const originalHTML = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Fetching data...';

    try {
      // Fetch real data from SchoolsDB
      const data = await fetchExportData(type, filters);

      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Building CSV...';

      const csvContent = buildCSVFromData(type, data);

      const date = new Date();
      const dateStr = date.toISOString().split('T')[0];
      const schoolName = (window.SchoolsDashboard?.currentSchool?.name || 'School').replace(/\s+/g, '_');
      const filename = `${schoolName}_${type}_${dateStr}.csv`;

      downloadCSV(filename, csvContent);

      addToExportHistory({
        type, format: 'csv', title: reportTitle, filename, filters,
        timestamp: date.toISOString()
      });

      window.SchoolsUtils?.showSchoolNotification(
        `${reportTitle} downloaded successfully!`,
        'success'
      );

    } catch (err) {
      console.error('Export error:', err);
      window.SchoolsUtils?.showSchoolNotification(
        'Export failed. Please try again.',
        'error'
      );
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalHTML;
    }
  }

  // ------------------------------------
  // DATA FETCHING (real SchoolsDB)
  // ------------------------------------

  async function fetchExportData(type, filters) {
    const db = typeof SchoolsDB !== 'undefined' ? SchoolsDB : null;

    if (type === 'performance' || type === 'progress') {
      const global = db ? await db.getGlobalStats() : null;
      const school = db ? await db.getSchoolInfo() : null;
      return { global, school };
    }

    if (type === 'subject') {
      const classId = filters.classFilter !== 'all' ? filters.classFilter : null;
      const subjects = db ? await db.getSubjects(classId) : [];
      const school = db ? await db.getSchoolInfo() : null;
      return { subjects, school };
    }

    if (type === 'class') {
      const classes = db ? await db.getClasses() : [];
      const selectedId = filters.classFilter !== 'all' ? filters.classFilter : null;

      if (selectedId) {
        const stats = db ? await db.getClassStats(selectedId) : null;
        const cls = classes.find(c => c.id === selectedId);
        return { classes: [{ ...(cls || {}), stats }] };
      }

      // All classes: fetch stats for each
      const classesWithStats = await Promise.all(
        classes.map(async cls => {
          const stats = db ? await db.getClassStats(cls.id) : null;
          return { ...cls, stats };
        })
      );
      return { classes: classesWithStats };
    }

    if (type === 'full') {
      const [global, school, classes, subjects] = await Promise.all([
        db ? db.getGlobalStats() : null,
        db ? db.getSchoolInfo() : null,
        db ? db.getClasses() : [],
        db ? db.getSubjects() : []
      ]);
      return { global, school, classes, subjects };
    }

    return {};
  }

  // ------------------------------------
  // CSV BUILDERS (real data)
  // ------------------------------------

  function buildCSVFromData(type, data) {
    const exportDate = new Date().toLocaleDateString('en-GB');
    const schoolName = data.school?.name || window.SchoolsDashboard?.currentSchool?.name || 'School';

    if (type === 'performance') {
      const g = data.global || {};
      const subjects = g.subjects || [];
      let csv = buildCSVRow(['BlueStift — Performance Report', schoolName, `Exported: ${exportDate}`]);
      csv += '\n';
      csv += buildCSVRow(['OVERVIEW']);
      csv += buildCSVRow(['Metric', 'Value']);
      csv += buildCSVRow(['Total Students', g.students ?? 'N/A']);
      csv += buildCSVRow(['Average PKM', g.pkm != null ? g.pkm.toFixed(3) : 'N/A']);
      csv += buildCSVRow(['Average Streak (days)', g.avgStreak ?? 'N/A']);
      csv += buildCSVRow(['Lessons Completed', g.lessonsCompleted ?? 'N/A']);
      csv += '\n';
      csv += buildCSVRow(['SUBJECTS BREAKDOWN']);
      csv += buildCSVRow(['Subject', 'PKM', 'Difficulty', 'Effort']);
      subjects.forEach(s => {
        csv += buildCSVRow([s.name, s.pkm?.toFixed(3) ?? 'N/A', s.difficulty ?? 'N/A', s.effort ?? 'N/A']);
      });
      return csv;
    }

    if (type === 'subject') {
      const subjects = data.subjects || [];
      let csv = buildCSVRow(['BlueStift — Subject Analysis', schoolName, `Exported: ${exportDate}`]);
      csv += '\n';
      csv += buildCSVRow(['Subject', 'PKM', 'Difficulty Level', 'Effort Level', 'Key Difficulties', 'Mastered Topics']);
      subjects.forEach(s => {
        const difficulties = (s.difficulties || []).join(' | ');
        const mastered = (s.mastered || []).join(' | ');
        csv += buildCSVRow([s.name, s.pkm?.toFixed(3) ?? 'N/A', s.difficulty ?? 'N/A', s.effort ?? 'N/A', difficulties, mastered]);
      });
      return csv;
    }

    if (type === 'class') {
      const classes = data.classes || [];
      let csv = buildCSVRow(['BlueStift — Class Report', schoolName, `Exported: ${exportDate}`]);
      csv += '\n';
      csv += buildCSVRow(['Class', 'Students', 'Avg PKM', 'Subject', 'Subject PKM', 'Difficulty', 'Effort']);
      classes.forEach(cls => {
        const subjects = cls.stats?.subjects || [];
        if (subjects.length === 0) {
          csv += buildCSVRow([cls.name, cls.studentCount ?? 'N/A', cls.stats?.pkm?.toFixed(3) ?? 'N/A', 'No data', '', '', '']);
        } else {
          subjects.forEach((s, i) => {
            csv += buildCSVRow([
              i === 0 ? cls.name : '',
              i === 0 ? (cls.studentCount ?? 'N/A') : '',
              i === 0 ? (cls.stats?.pkm?.toFixed(3) ?? 'N/A') : '',
              s.name, s.pkm?.toFixed(3) ?? 'N/A', s.difficulty ?? 'N/A', s.effort ?? 'N/A'
            ]);
          });
        }
      });
      return csv;
    }

    if (type === 'progress') {
      // No time-series data yet — export current snapshot
      const g = data.global || {};
      let csv = buildCSVRow(['BlueStift — Progress Snapshot', schoolName, `Exported: ${exportDate}`]);
      csv += '\n';
      csv += buildCSVRow(['Note: Time-series data not yet available. Showing current snapshot.']);
      csv += '\n';
      csv += buildCSVRow(['Date', 'Total Students', 'Average PKM', 'Avg Streak', 'Lessons Completed']);
      csv += buildCSVRow([
        exportDate,
        g.students ?? 'N/A',
        g.pkm?.toFixed(3) ?? 'N/A',
        g.avgStreak ?? 'N/A',
        g.lessonsCompleted ?? 'N/A'
      ]);
      return csv;
    }

    if (type === 'full') {
      const g = data.global || {};
      const subjects = data.subjects || [];
      const classes = data.classes || [];

      let csv = buildCSVRow(['BlueStift — Full Data Export', schoolName, `Exported: ${exportDate}`]);
      csv += '\n';

      csv += buildCSVRow(['=== GLOBAL OVERVIEW ===']);
      csv += buildCSVRow(['Metric', 'Value']);
      csv += buildCSVRow(['Total Students', g.students ?? 'N/A']);
      csv += buildCSVRow(['Average PKM', g.pkm?.toFixed(3) ?? 'N/A']);
      csv += buildCSVRow(['Average Streak', g.avgStreak ?? 'N/A']);
      csv += buildCSVRow(['Lessons Completed', g.lessonsCompleted ?? 'N/A']);
      csv += '\n';

      csv += buildCSVRow(['=== SUBJECTS ===']);
      csv += buildCSVRow(['Subject', 'PKM', 'Difficulty', 'Effort']);
      subjects.forEach(s => {
        csv += buildCSVRow([s.name, s.pkm?.toFixed(3) ?? 'N/A', s.difficulty ?? 'N/A', s.effort ?? 'N/A']);
      });
      csv += '\n';

      csv += buildCSVRow(['=== CLASSES ===']);
      csv += buildCSVRow(['Class', 'Students']);
      classes.forEach(cls => {
        csv += buildCSVRow([cls.name, cls.studentCount ?? 'N/A']);
      });

      return csv;
    }

    return 'No data available';
  }

  // ------------------------------------
  // CSV UTILITIES
  // ------------------------------------

  function buildCSVRow(cells) {
    return cells.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',') + '\n';
  }

  function downloadCSV(filename, content) {
    // Add UTF-8 BOM for Excel compatibility
    const bom = '\uFEFF';
    const blob = new Blob([bom + content], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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

    // Add click handlers for re-download buttons
    container.querySelectorAll('.btn-download').forEach(btn => {
      btn.addEventListener('click', async () => {
        const index = parseInt(btn.getAttribute('data-index'));
        const exp = exportHistory[index];
        if (!exp) return;
        const originalHTML = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        try {
          const data = await fetchExportData(exp.type, exp.filters || {});
          const content = buildCSVFromData(exp.type, data);
          downloadCSV(exp.filename, content);
        } catch (e) {
          window.SchoolsUtils?.showSchoolNotification('Re-download failed. Try a new export.', 'error');
        } finally {
          btn.disabled = false;
          btn.innerHTML = originalHTML;
        }
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
