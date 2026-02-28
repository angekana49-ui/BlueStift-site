// ==========================================
// FEEDBACK MODAL
// Depends on: showNotification (script.js)
// ==========================================

function initFeedbackModal() {
  const feedbackBtn = document.getElementById('feedback-btn');
  const modal = document.getElementById('feedback-modal');
  const closeBtn = modal?.querySelector('.close-modal');
  const form = document.getElementById('feedback-form');
  const stars = document.querySelectorAll('.star');
  const ratingInput = document.getElementById('feedback-rating');

  if (feedbackBtn) {
    feedbackBtn.addEventListener('click', (e) => {
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

  stars.forEach(star => {
    // Effet hover: illumine les étoiles jusqu'à celle survolée
    star.addEventListener('mouseenter', () => {
      const rating = star.getAttribute('data-rating');
      stars.forEach(s => {
        const starRating = s.getAttribute('data-rating');
        if (starRating <= rating) {
          s.style.color = '#fbbf24';
          s.style.transform = 'scale(1.15)';
        } else {
          s.style.color = 'rgba(255, 255, 255, 0.3)';
          s.style.transform = 'scale(1)';
        }
      });
    });

    // Reset au départ de la souris: remet les étoiles actives
    star.addEventListener('mouseleave', () => {
      stars.forEach(s => {
        if (s.classList.contains('active')) {
          s.style.color = '#fbbf24';
          s.style.transform = 'scale(1)';
        } else {
          s.style.color = 'rgba(255, 255, 255, 0.3)';
          s.style.transform = 'scale(1)';
        }
      });
    });

    // Clic: sélection permanente
    star.addEventListener('click', () => {
      const rating = star.getAttribute('data-rating');
      ratingInput.value = rating;

      stars.forEach(s => {
        const starRating = s.getAttribute('data-rating');
        if (starRating <= rating) {
          s.classList.add('active');
          s.style.color = '#fbbf24';
        } else {
          s.classList.remove('active');
          s.style.color = 'rgba(255, 255, 255, 0.3)';
        }
        s.style.transform = 'scale(1)';
      });
    });
  });

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!ratingInput.value) {
        showNotification('Please give a rating before submitting', 'warning');
        return;
      }

      const feedbackData = {
        name: document.getElementById('feedback-name').value || null,
        email: document.getElementById('feedback-email').value || null,
        rating: ratingInput.value,
        type: document.getElementById('feedback-type').value,
        message: document.getElementById('feedback-message').value
      };

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

      try {
        await window.BluestiftDB.submitFeedback(feedbackData);

        modal.style.display = 'none';
        form.reset();
        stars.forEach(s => s.classList.remove('active'));

        showNotification('Thank you for your feedback!', 'success');

      } catch (error) {
        console.error('Feedback error:', error);
        showNotification('Submission failed. Please try again.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
      }
    });
  }
}
