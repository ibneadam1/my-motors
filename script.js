// Menu toggle functionality
const menuBtn = document.querySelector('.menu-btn');
const sideNav = document.querySelector('.side-nav');
const overlay = document.querySelector('.overlay');

menuBtn.addEventListener('click', () => {
    sideNav.classList.toggle('active');
    overlay.classList.toggle('active');
});

overlay.addEventListener('click', () => {
    sideNav.classList.remove('active');
    overlay.classList.remove('active');
});

// Page navigation functionality
const navItems = document.querySelectorAll('.nav-item');
const pageSections = document.querySelectorAll('.page-section');
const brandCards = document.querySelectorAll('.brand-card');
const backButtons = document.querySelectorAll('.back-button');

// Show home page by default
showPage('home');

// Navigation items click
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = item.getAttribute('data-page');
        showPage(page);
        
        // Close menu if on mobile
        sideNav.classList.remove('active');
        overlay.classList.remove('active');
    });
});

// Brand cards click
brandCards.forEach(card => {
    card.addEventListener('click', () => {
        const brand = card.getAttribute('data-brand');
        showPage(`${brand}-bikes`);
    });
});

// Back buttons click
backButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const page = button.getAttribute('data-page');
        showPage(page);
    });
});

function showPage(pageId) {
    // Hide all pages
    pageSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show requested page
    document.getElementById(`${pageId}-page`).classList.add('active');
    
    // Scroll to top
    window.scrollTo(0, 0);
}


//slider 

  function buyNow(button) {
    const name = encodeURIComponent(button.getAttribute('data-name'));
    const price = encodeURIComponent(button.getAttribute('data-price'));
    const image = encodeURIComponent(button.getAttribute('data-image'));

    const url = `purchase.html?name=${name}&price=${price}&image=${image}`;
    window.location.href = url;
  }



// Slider Manager Class
class SliderManager {
    constructor() {
      this.sliders = [];
      this.init();
    }
  
    init() {
      document.addEventListener('DOMContentLoaded', () => {
        this.setupAllSliders();
        this.setupBuyButtons();
        this.setupBackButton();
      });
    }
  
    setupAllSliders() {
      document.querySelectorAll('.slider-container').forEach((container, index) => {
        const slider = container.querySelector('.slider');
        if (!slider) return;
  
        // Ensure unique ID if not present
        if (!slider.id) {
          slider.id = `slider-${index}-${Math.random().toString(36).substr(2, 5)}`;
        }
  
        // Initialize new slider instance
        this.sliders.push(new Slider(slider, container));
      });
    }
  
    setupBuyButtons() {
      document.addEventListener('click', (e) => {
        if (e.target.classList.contains('buy-btn')) {
          const vehicleCard = e.target.closest('.vehicle-card');
          if (vehicleCard) {
            const vehicleName = vehicleCard.querySelector('h2')?.textContent || 'Vehicle';
            const vehiclePrice = vehicleCard.querySelector('.price')?.textContent || '';
            
            localStorage.setItem('selectedVehicle', vehicleName);
            localStorage.setItem('selectedPrice', vehiclePrice);
            window.location.href = 'contact.html';
          }
        }
      });
    }
  
    setupBackButton() {
      const backButton = document.querySelector('.back-button');
      if (backButton) {
        backButton.addEventListener('click', (e) => {
          e.preventDefault();
          window.location.href = backButton.getAttribute('href');
        });
      }
    }
  }
  
  // Individual Slider Class
  class Slider {
    constructor(slider, container) {
      this.slider = slider;
      this.container = container;
      this.images = slider.querySelectorAll('img');
      this.currentIndex = 0;
      this.autoScrollInterval = null;
      this.touchStartX = 0;
      this.touchEndX = 0;
      
      this.initDots();
      this.setupNavigation();
      this.setupAutoScroll();
      this.setupEvents();
      this.updateSliderState();
    }
  
    initDots() {
      // Create or find dots container
      this.dotsContainer = this.container.querySelector('.slider-nav');
      if (!this.dotsContainer) {
        this.dotsContainer = document.createElement('div');
        this.dotsContainer.className = 'slider-nav';
        this.container.appendChild(this.dotsContainer);
      }
      
      // Clear existing dots
      this.dotsContainer.innerHTML = '';
      
      // Create new dots
      this.images.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'slider-dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => this.goToSlide(index));
        this.dotsContainer.appendChild(dot);
      });
    }
  
    setupNavigation() {
      // Previous button
      this.prevBtn = this.container.querySelector('.prev');
      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.navigate(-1);
        });
      }
      
      // Next button
      this.nextBtn = this.container.querySelector('.next');
      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.navigate(1);
        });
      }
    }
  
    setupAutoScroll() {
      this.stopAutoScroll();
      this.autoScrollInterval = setInterval(() => {
        this.navigate(1);
      }, 5000);
    }
  
    stopAutoScroll() {
      if (this.autoScrollInterval) {
        clearInterval(this.autoScrollInterval);
      }
    }
  
    setupEvents() {
      // Mouse events
      this.container.addEventListener('mouseenter', () => this.stopAutoScroll());
      this.container.addEventListener('mouseleave', () => this.setupAutoScroll());
      
      // Touch events for mobile
      this.slider.addEventListener('touchstart', (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
        this.stopAutoScroll();
      }, { passive: true });
      
      this.slider.addEventListener('touchend', (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
        this.setupAutoScroll();
      }, { passive: true });
      
      // Update state on scroll
      this.slider.addEventListener('scroll', () => this.updateSliderState());
    }
  
    handleSwipe() {
      const threshold = 50; // Minimum swipe distance
      const difference = this.touchStartX - this.touchEndX;
      
      if (difference > threshold) {
        this.navigate(1); // Swipe left - next
      } else if (difference < -threshold) {
        this.navigate(-1); // Swipe right - previous
      }
    }
  
    navigate(direction) {
      this.currentIndex += direction;
      
      // Handle wrap-around
      if (this.currentIndex < 0) {
        this.currentIndex = this.images.length - 1;
      } else if (this.currentIndex >= this.images.length) {
        this.currentIndex = 0;
      }
      
      this.goToSlide(this.currentIndex);
    }
  
    goToSlide(index) {
      this.currentIndex = index;
      this.slider.scrollTo({
        left: index * this.slider.offsetWidth,
        behavior: 'smooth'
      });
    }
  
    updateSliderState() {
      const scrollPosition = this.slider.scrollLeft;
      const slideWidth = this.slider.offsetWidth;
      this.currentIndex = Math.round(scrollPosition / slideWidth);
      
      const dots = this.dotsContainer.querySelectorAll('.slider-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === this.currentIndex);
      });
    }
  }
  
  // Initialize the slider manager when the script loads
  new SliderManager();