// ==========================================
// CONTRIBUTE MODAL
// Depends on: showNotification (script.js)
// ==========================================

function initContributeModal() {
  const contributeBtn = document.getElementById('contribute-btn');
  const modal = document.getElementById('contribute-modal');
  const closeBtn = modal?.querySelector('.close-modal');
  const form = document.getElementById('contribute-form');

  if (contributeBtn) {
    contributeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal) modal.style.display = 'block';

      const menuContent = document.getElementById('menu-content');
      if (menuContent) {
        menuContent.style.display = 'none';
        menuContent.classList.remove('active');
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const fileInput = document.getElementById('contrib-file');
      const files = Array.from(fileInput.files);

      if (files.length === 0) {
        showNotification('Please select at least one file', 'warning');
        return;
      }

      const maxSize = 50 * 1024 * 1024;
      for (const file of files) {
        if (file.size > maxSize) {
          showNotification(`File "${file.name}" is too large. Maximum: 50MB`, 'warning');
          return;
        }
      }

      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'image/jpeg',
        'image/png',
        'image/jpg',
        'video/mp4',
        'audio/mpeg',
        'audio/mp3'
      ];

      for (const file of files) {
        if (!allowedTypes.includes(file.type)) {
          showNotification(`File type not allowed: ${file.name}. Accepted: PDF, Word, PowerPoint, Images, Videos, Audio`, 'warning');
          return;
        }
      }

      const contributionData = {
        name: document.getElementById('contrib-name').value.trim(),
        email: document.getElementById('contrib-email').value.trim(),
        title: document.getElementById('contrib-title').value.trim(),
        category: document.getElementById('contrib-category').value,
        description: document.getElementById('contrib-description').value.trim() || null
      };

      if (!contributionData.name || !contributionData.email || !contributionData.title || !contributionData.category) {
        showNotification('Please fill all required fields', 'warning');
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading files...';

      try {
        if (!window.BluestiftDB) throw new Error('Service not available. Please refresh the page.');

        console.log('=== STARTING CONTRIBUTION UPLOAD ===');
        console.log('Files:', files.map(f => `${f.name} (${(f.size/1024/1024).toFixed(2)}MB)`));

        await window.BluestiftDB.submitContribution(contributionData, files);

        modal.style.display = 'none';
        form.reset();

        showNotification('Thank you! Your contribution has been uploaded successfully.', 'success');

      } catch (error) {
        console.error('=== UPLOAD FAILED ===');
        console.error('Error:', error);
        console.error('Message:', error.message);

        let errorMsg = 'Upload failed. ';

        if (error.message.includes('policy') || error.message.includes('permission') || error.message.includes('denied')) {
          errorMsg += 'Permission denied. Please contact support.';
        } else if (error.message.includes('size') || error.message.includes('large')) {
          errorMsg += 'File too large. Maximum 50MB per file.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMsg += 'Network error. Please check your connection.';
        } else if (error.message.toLowerCase().includes('bucket')) {
          errorMsg += 'Storage error. Please contact support.';
        } else {
          errorMsg += error.message || 'Unknown error. Please try again.';
        }

        showNotification(errorMsg, 'error');

      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
      }
    });
  }
}
