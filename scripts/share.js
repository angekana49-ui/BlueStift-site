// ==========================================
// SHARE BUTTON
// Depends on: showNotification (script.js)
// ==========================================

function initShareButton() {
  const shareBtn = document.getElementById('share-btn');

  if (shareBtn) {
    shareBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const url = window.location.href;
      const title = 'Join Bluestift - The Learning Revolution';
      const text = 'Discover Bluestift, the new educational platform that combines AI and gamification to make learning fun and effective!';

      if (navigator.share) {
        navigator.share({
          title: title,
          text: text,
          url: url
        }).then(() => {
          showNotification('Thank you for sharing Bluestift!', 'success');
        }).catch((error) => {
          console.log('Share error:', error);
        });
      } else {
        showShareOptions(url, title, text);
      }

      const menuContent = document.getElementById('menu-content');
      if (menuContent) {
        menuContent.style.display = 'none';
        menuContent.classList.remove('active');
      }
    });
  }
}

function showShareOptions(url, title, text) {
  const existing = document.querySelector('.share-options-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.className = 'share-options-modal';
  modal.innerHTML = `
    <div style="background: ${document.body.classList.contains('dark-theme') ? '#1a1a1a' : '#fff'}; padding: 25px; border-radius: 12px; max-width: 400px; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
      <h3 style="margin-top: 0; color: ${document.body.classList.contains('dark-theme') ? '#f0f0f0' : '#1a1a1a'};"><i class="fas fa-share-alt"></i> Share Bluestift</h3>
      <p style="color: ${document.body.classList.contains('dark-theme') ? '#b0b0b0' : '#666'}; margin-bottom: 20px;">Choose your platform:</p>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        <button class="share-btn" data-platform="whatsapp" style="padding: 12px; background: #25D366; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 10px;">
          <i class="fab fa-whatsapp"></i> WhatsApp
        </button>
        <button class="share-btn" data-platform="facebook" style="padding: 12px; background: #1877F2; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 10px;">
          <i class="fab fa-facebook"></i> Facebook
        </button>
        <button class="share-btn" data-platform="twitter" style="padding: 12px; background: #1DA1F2; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 10px;">
          <i class="fab fa-twitter"></i> Twitter
        </button>
        <button class="share-btn" data-platform="linkedin" style="padding: 12px; background: #0A66C2; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 10px;">
          <i class="fab fa-linkedin"></i> LinkedIn
        </button>
        <button class="share-btn" data-platform="copy" style="padding: 12px; background: #6B7280; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 10px;">
          <i class="fas fa-copy"></i> Copy Link
        </button>
      </div>

      <button class="close-share" style="margin-top: 15px; width: 100%; padding: 10px; background: #c6c9d276; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
        Close
      </button>
    </div>
  `;

  Object.assign(modal.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '10003',
    animation: 'fadeIn 0.3s ease'
  });

  document.body.appendChild(modal);

  modal.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const platform = btn.getAttribute('data-platform');
      const encodedUrl = encodeURIComponent(url);
      const encodedText = encodeURIComponent(text);

      let shareUrl = '';

      switch (platform) {
        case 'whatsapp':
          shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
          break;
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
          break;
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
          break;
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
          break;
        case 'copy':
          modal.remove();
          navigator.clipboard.writeText(url).then(() => {
            showNotification('Link copied to clipboard!', 'success');
          });
          return;
      }

      if (shareUrl) {
        modal.remove();
        window.open(shareUrl, '_blank', 'width=600,height=400');
        showNotification('Thank you for sharing Bluestift!', 'success');
      }
    });
  });

  modal.querySelector('.close-share').addEventListener('click', () => {
    modal.remove();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}
