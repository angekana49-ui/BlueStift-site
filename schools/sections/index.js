// ==========================================
// SCHOOLS SECTIONS - Template Loader
// Manages dynamic loading of section content
// ==========================================

window.SchoolsSections = (function() {
  'use strict';

  // Registry of section templates
  const sections = {};

  // Track which sections have been rendered
  const rendered = new Set();

  /**
   * Register a section template
   * @param {string} name - Section name (e.g., 'export', 'contact')
   * @param {object} config - Section configuration
   * @param {function} config.render - Returns HTML string
   * @param {function} config.init - Called after HTML is inserted
   */
  function register(name, config) {
    sections[name] = config;
    console.log(`📦 Section registered: ${name}`);
  }

  /**
   * Render a section into its container
   * @param {string} name - Section name
   * @param {boolean} force - Force re-render even if already rendered
   */
  function render(name, force = false) {
    if (!sections[name]) {
      console.warn(`Section "${name}" not found`);
      return false;
    }

    if (rendered.has(name) && !force) {
      return true; // Already rendered
    }

    const container = document.getElementById(`section-${name}`);
    if (!container) {
      console.warn(`Container for section "${name}" not found`);
      return false;
    }

    try {
      // Get HTML from template
      const html = sections[name].render();

      // Insert HTML (keep the section tag, replace inner content)
      container.innerHTML = html;

      // Mark as rendered
      rendered.add(name);

      // Call init function if provided
      if (typeof sections[name].init === 'function') {
        sections[name].init();
      }

      console.log(`✅ Section rendered: ${name}`);
      return true;
    } catch (error) {
      console.error(`Failed to render section "${name}":`, error);
      return false;
    }
  }

  /**
   * Render all registered sections
   */
  function renderAll() {
    Object.keys(sections).forEach(name => render(name));
  }

  /**
   * Check if a section is registered
   */
  function has(name) {
    return !!sections[name];
  }

  /**
   * Get list of registered sections
   */
  function list() {
    return Object.keys(sections);
  }

  // Public API
  return {
    register,
    render,
    renderAll,
    has,
    list
  };
})();

console.log('📂 Schools Sections loader ready');
