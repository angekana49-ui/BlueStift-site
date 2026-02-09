/* ==================================================================
   BLUESTIFT - CAROUSEL MANAGER v1.0
   Gestion des carousels: Info Cards + Quotes
   Auto-scroll, navigation, animations
   ================================================================== */

(function() {
  'use strict';

  /* ==========================================
     INFO CARDS CAROUSEL
     ========================================== */
  
  class InfoCardsCarousel {
    constructor() {
      this.wrapper = document.getElementById('info-cards-wrapper');
      this.originalCards = Array.from(document.querySelectorAll('.info-card'));
      this.dotsContainer = document.getElementById('cards-dots');
      this.leftArrow = document.getElementById('card-arrow-left');
      this.rightArrow = document.getElementById('card-arrow-right');

      if (!this.wrapper || this.originalCards.length === 0) {
        console.warn('Info cards carousel elements not found');
        return;
      }

      this.totalOriginal = this.originalCards.length;
      this.currentIndex = 0; // Index dans les cartes originales (0 to totalOriginal-1)
      this.autoScrollInterval = 5000;
      this.autoScrollTimer = null;
      this.isAutoScrolling = true;
      this.isTransitioning = false;
      this.cloneCount = 2; // Nombre de clones de chaque côté

      this.init();
    }

    init() {
      this.setupInfiniteLoop();
      this.createDots();
      this.attachEventListeners();
      this.startAutoScroll();

      // Pause auto-scroll on hover
      this.wrapper.addEventListener('mouseenter', () => this.pauseAutoScroll());
      this.wrapper.addEventListener('mouseleave', () => this.resumeAutoScroll());
    }

    setupInfiniteLoop() {
      // Cloner les dernières cartes au début
      for (let i = this.cloneCount; i > 0; i--) {
        const clone = this.originalCards[this.totalOriginal - i].cloneNode(true);
        clone.classList.add('clone');
        clone.setAttribute('data-clone', 'start');
        this.wrapper.insertBefore(clone, this.wrapper.firstChild);
      }

      // Cloner les premières cartes à la fin
      for (let i = 0; i < this.cloneCount; i++) {
        const clone = this.originalCards[i].cloneNode(true);
        clone.classList.add('clone');
        clone.setAttribute('data-clone', 'end');
        this.wrapper.appendChild(clone);
      }

      // Mettre à jour la liste des cartes (incluant les clones)
      this.allCards = Array.from(this.wrapper.querySelectorAll('.info-card'));

      // Positionner sur la première carte réelle (après les clones du début)
      requestAnimationFrame(() => {
        this.scrollToPosition(this.cloneCount, true);
      });
    }

    createDots() {
      if (!this.dotsContainer) return;

      this.dotsContainer.innerHTML = '';

      // Créer des dots uniquement pour les cartes originales
      for (let i = 0; i < this.totalOriginal; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');

        dot.addEventListener('click', () => {
          this.goToCard(i);
          this.pauseAutoScroll();
          this.resumeAutoScroll(3000);
        });

        this.dotsContainer.appendChild(dot);
      }

      this.dots = this.dotsContainer.querySelectorAll('.dot');
    }

    attachEventListeners() {
      if (this.leftArrow) {
        this.leftArrow.addEventListener('click', () => {
          this.previousCard();
          this.pauseAutoScroll();
          this.resumeAutoScroll(3000);
        });
      }

      if (this.rightArrow) {
        this.rightArrow.addEventListener('click', () => {
          this.nextCard();
          this.pauseAutoScroll();
          this.resumeAutoScroll(3000);
        });
      }

      // Touch swipe support
      let touchStartX = 0;
      this.wrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      });

      this.wrapper.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) this.nextCard();
          else this.previousCard();
          this.pauseAutoScroll();
          this.resumeAutoScroll(3000);
        }
      });
    }

    getCardWidth() {
      return this.allCards[0].offsetWidth + 24; // card width + gap
    }

    scrollToPosition(positionIndex, instant = false) {
      const card = this.allCards[positionIndex];
      if (!card) return;

      const scrollLeft = card.offsetLeft - 20;

      this.wrapper.scrollTo({
        left: scrollLeft,
        behavior: instant ? 'instant' : 'smooth'
      });
    }

    goToCard(originalIndex) {
      if (this.isTransitioning) return;

      this.currentIndex = originalIndex;
      const positionIndex = originalIndex + this.cloneCount;
      this.scrollToPosition(positionIndex);
      this.updateDots(originalIndex);
    }

    nextCard() {
      if (this.isTransitioning) return;

      this.isTransitioning = true;
      this.currentIndex++;

      const positionIndex = this.currentIndex + this.cloneCount;
      this.scrollToPosition(positionIndex);

      // Si on atteint un clone de fin, téléporter vers le début
      if (this.currentIndex >= this.totalOriginal) {
        setTimeout(() => {
          this.currentIndex = 0;
          this.scrollToPosition(this.cloneCount, true);
          this.isTransitioning = false;
        }, 350);
      } else {
        setTimeout(() => { this.isTransitioning = false; }, 350);
      }

      this.updateDots(this.currentIndex % this.totalOriginal);
    }

    previousCard() {
      if (this.isTransitioning) return;

      this.isTransitioning = true;
      this.currentIndex--;

      const positionIndex = this.currentIndex + this.cloneCount;
      this.scrollToPosition(positionIndex);

      // Si on atteint un clone de début, téléporter vers la fin
      if (this.currentIndex < 0) {
        setTimeout(() => {
          this.currentIndex = this.totalOriginal - 1;
          this.scrollToPosition(this.currentIndex + this.cloneCount, true);
          this.isTransitioning = false;
        }, 350);
      } else {
        setTimeout(() => { this.isTransitioning = false; }, 350);
      }

      this.updateDots((this.currentIndex + this.totalOriginal) % this.totalOriginal);
    }

    updateDots(index) {
      if (!this.dots) return;
      const safeIndex = ((index % this.totalOriginal) + this.totalOriginal) % this.totalOriginal;
      this.dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === safeIndex);
      });
    }

    startAutoScroll() {
      if (!this.isAutoScrolling) return;
      this.autoScrollTimer = setInterval(() => {
        this.nextCard();
      }, this.autoScrollInterval);
    }

    pauseAutoScroll() {
      if (this.autoScrollTimer) {
        clearInterval(this.autoScrollTimer);
        this.autoScrollTimer = null;
      }
      this.isAutoScrolling = false;
    }

    resumeAutoScroll(delay = 0) {
      this.pauseAutoScroll();
      setTimeout(() => {
        this.isAutoScrolling = true;
        this.startAutoScroll();
      }, delay);
    }
  }

  /* ==========================================
     QUOTES CAROUSEL
     ========================================== */
  
  class QuotesCarousel {
    constructor() {
      this.wrapper = document.querySelector('.quotes-wrapper');
      this.quotes = document.querySelectorAll('.quote-item');
      this.dotsContainer = document.getElementById('quotes-dots');
      
      if (!this.wrapper || this.quotes.length === 0) {
        console.warn('Quotes carousel elements not found');
        return;
      }
      
      this.currentIndex = 0;
      this.autoScrollInterval = 7500; // 7.5 seconds
      this.autoScrollTimer = null;
      this.isAutoScrolling = true;
      this.isPaused = false;
      
      this.init();
    }
    
    init() {
      // Ensure all quotes start hidden
      this.quotes.forEach(quote => {
        quote.classList.remove('active', 'fade-out');
      });

      this.createDots();
      this.showQuote(0); // Show first quote immediately
      this.attachEventListeners();
      this.startAutoScroll();

      // Pause auto-scroll on hover
      this.wrapper.addEventListener('mouseenter', () => this.pauseAutoScroll());
      this.wrapper.addEventListener('mouseleave', () => this.resumeAutoScroll());
    }
    
    createDots() {
      if (!this.dotsContainer) return;
      
      this.dotsContainer.innerHTML = '';
      
      this.quotes.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
          this.showQuote(index);
          this.pauseAutoScroll();
          this.resumeAutoScroll(3000); // Resume after 3s
        });
        
        this.dotsContainer.appendChild(dot);
      });
      
      this.dots = this.dotsContainer.querySelectorAll('.dot');
    }
    
    attachEventListeners() {
      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (this.isPaused) return;
        
        if (e.key === 'ArrowLeft') {
          this.previousQuote();
          this.pauseAutoScroll();
          this.resumeAutoScroll(3000);
        } else if (e.key === 'ArrowRight') {
          this.nextQuote();
          this.pauseAutoScroll();
          this.resumeAutoScroll(3000);
        }
      });
    }
    
    showQuote(index) {
      if (index < 0 || index >= this.quotes.length) return;
      
      // Hide all quotes
      this.quotes.forEach((quote, i) => {
        if (i === this.currentIndex && i !== index) {
          // Current quote fading out
          quote.classList.remove('active');
          quote.classList.add('fade-out');
          
          // Remove fade-out class after transition
          setTimeout(() => {
            quote.classList.remove('fade-out');
          }, 800);
        } else if (i !== index) {
          // Other quotes
          quote.classList.remove('active', 'fade-out');
        }
      });
      
      // Show new quote with slight delay for smooth transition
      setTimeout(() => {
        this.quotes[index].classList.add('active');
      }, 100);
      
      this.currentIndex = index;
      this.updateDots(index);
    }
    
    nextQuote() {
      const nextIndex = (this.currentIndex + 1) % this.quotes.length;
      this.showQuote(nextIndex);
    }
    
    previousQuote() {
      const prevIndex = (this.currentIndex - 1 + this.quotes.length) % this.quotes.length;
      this.showQuote(prevIndex);
    }
    
    updateDots(index) {
      if (!this.dots) return;
      
      this.dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    }
    
    startAutoScroll() {
      if (!this.isAutoScrolling) return;
      
      this.autoScrollTimer = setInterval(() => {
        this.nextQuote();
      }, this.autoScrollInterval);
    }
    
    pauseAutoScroll() {
      if (this.autoScrollTimer) {
        clearInterval(this.autoScrollTimer);
        this.autoScrollTimer = null;
      }
      this.isAutoScrolling = false;
      this.isPaused = true;
    }
    
    resumeAutoScroll(delay = 0) {
      this.pauseAutoScroll();
      
      setTimeout(() => {
        this.isAutoScrolling = true;
        this.isPaused = false;
        this.startAutoScroll();
      }, delay);
    }
  }

  /* ==========================================
     INITIALIZATION
     ========================================== */
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousels);
  } else {
    initCarousels();
  }
  
  function initCarousels() {
    // Initialize Info Cards Carousel
    const infoCardsCarousel = new InfoCardsCarousel();
    
    // Initialize Quotes Carousel
    const quotesCarousel = new QuotesCarousel();
    
    // Expose to global scope for debugging (optional)
    if (window.DEBUG) {
      window.infoCardsCarousel = infoCardsCarousel;
      window.quotesCarousel = quotesCarousel;
    }
    
    console.log('Carousels initialized successfully');
  }

  /* ==========================================
     UTILITY: PAUSE ALL CAROUSELS
     Useful for modals or other overlays
     ========================================== */
  
  window.pauseAllCarousels = function() {
    if (window.infoCardsCarousel) {
      window.infoCardsCarousel.pauseAutoScroll();
    }
    if (window.quotesCarousel) {
      window.quotesCarousel.pauseAutoScroll();
    }
  };
  
  window.resumeAllCarousels = function() {
    if (window.infoCardsCarousel) {
      window.infoCardsCarousel.resumeAutoScroll();
    }
    if (window.quotesCarousel) {
      window.quotesCarousel.resumeAutoScroll();
    }
  };

})();

/* ==========================================
   USAGE NOTES
   ========================================== */

/*
  INTEGRATION DANS INDEX.HTML :
  
  Ajouter avant la fermeture de </body> :
  <script src="carousel-manager.js"></script>
  
  Ou si vous avez deja d'autres scripts :
  <script src="supabase-client.js"></script>
  <script src="lessons/science-lessons.js"></script>
  ...
  <script src="carousel-manager.js"></script> <!-- NOUVEAU -->
  <script src="script.js"></script>
  <script src="lesson-module.js"></script>
  
  
  DEBUG MODE :
  
  Pour activer le debug et acceder aux instances dans la console :
  window.DEBUG = true;
  
  Puis dans la console :
  window.infoCardsCarousel.scrollToCard(3);
  window.quotesCarousel.showQuote(2);
  
  
  FONCTIONNALITES :
  
  Info Cards Carousel :
  - Auto-scroll toutes les 5 secondes
  - Click sur dots pour navigation
  - Click sur arrows pour prev/next
  - Swipe support sur mobile
  - Pause au hover, resume apres 3s
  - Detection scroll pour update dots
  - Animation pulse sur carte active
  
  Quotes Carousel :
  - Auto-scroll toutes les 7.5 secondes
  - Click sur dots pour navigation
  - Keyboard arrows (left/right) pour navigation
  - Fade in/out smooth
  - Pause au hover, resume apres 3s
  - Transition douce entre citations
  
  
  PERSONNALISATION :
  
  Pour changer les intervalles :
  this.autoScrollInterval = 5000; // Info cards (ligne 31)
  this.autoScrollInterval = 7500; // Quotes (ligne 198)
  
  Pour desactiver l'auto-scroll :
  this.isAutoScrolling = false;
  
  Pour changer le seuil de swipe :
  const swipeThreshold = 50; // pixels (ligne 162)
*/