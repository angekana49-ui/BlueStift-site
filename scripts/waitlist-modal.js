// ==========================================
// WAITLIST MODAL
// Depends on: showNotification, updateEarlyBirdCounter (script.js)
// ==========================================

function initWaitlistModal() {
  const modal = document.getElementById('waitlist-modal');
  const closeBtns = document.querySelectorAll('#waitlist-modal .close-modal');
  const form = document.getElementById('waitlist-form');

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (modal) modal.style.display = 'none';
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.style.display === 'block') {
      modal.style.display = 'none';
    }
  });

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = document.getElementById('waitlist-submit');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing up...';

      try {
        if (!window.BluestiftDB) throw new Error('Service not available. Please refresh the page.');

        const formData = {
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
          interest: document.getElementById('interest').value || null
        };

        const result = await window.BluestiftDB.joinWaitlist(formData);

        if (modal) modal.style.display = 'none';
        form.reset();

        localStorage.setItem('bluestift_user_email', formData.email);

        if (result.alreadyRegistered) {
          showNotification(
            `You're already registered at position #${result.position}!`,
            'info'
          );
        } else {
          const message = result.isEarlyBird
            ? `Congratulations! You're Early Bird #${result.position}!`
            : `Welcome! You're on the waitlist at position #${result.position}`;

          showNotification(message, 'success');
        }

        await updateEarlyBirdCounter();

      } catch (error) {
        console.error('Waitlist error:', error);
        showNotification('Registration failed. Please try again.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }
}
