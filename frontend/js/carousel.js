
class PanditCarousel {
    constructor() {
        this.images = document.querySelectorAll('.pandit-carousel .pandit-image');
        this.currentIndex = 0;
        this.interval = null;
        this.intervalTime = 3000; // 3 seconds
        this.init();
    }

    init() {
        if (this.images.length > 0) {
            this.startCarousel();
        }
    }

    nextImage() {
        // Remove active class from current image
        this.images[this.currentIndex].classList.remove('active');
        
        // Move to next image
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        
        // Add active class to new image
        this.images[this.currentIndex].classList.add('active');
    }

    startCarousel() {
        // Set initial active image
        this.images[this.currentIndex].classList.add('active');
        
        // Start automatic rotation
        this.interval = setInterval(() => {
            this.nextImage();
        }, this.intervalTime);
    }

    stopCarousel() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    pauseOnHover() {
        const carouselContainer = document.querySelector('.pandit-photo');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => {
                this.stopCarousel();
            });
            
            carouselContainer.addEventListener('mouseleave', () => {
                this.startCarousel();
            });
        }
    }

    // Method to manually change image (for future use)
    goToImage(index) {
        if (index >= 0 && index < this.images.length) {
            this.images[this.currentIndex].classList.remove('active');
            this.currentIndex = index;
            this.images[this.currentIndex].classList.add('active');
        }
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const carousel = new PanditCarousel();
    carousel.pauseOnHover(); // Pause on hover for better UX
});

// Export for potential future use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PanditCarousel;
} 