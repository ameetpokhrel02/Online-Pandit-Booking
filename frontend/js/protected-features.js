// Protected Features Authentication Handler
class ProtectedFeatures {
    constructor() {
        this.init();
    }

    init() {
        // Wait for auth system to be available
        if (window.auth) {
            this.setupProtectedFeatures();
        } else {
            // Wait for auth to load
            document.addEventListener('DOMContentLoaded', () => {
                if (window.auth) {
                    this.setupProtectedFeatures();
                }
            });
        }
    }

    setupProtectedFeatures() {
        this.protectBookingButtons();
        this.protectContactForm();
        this.protectChatFeature();
        this.protectPaymentFeatures();
        this.protectUserSpecificFeatures();
    }

    // Protect all booking buttons
    protectBookingButtons() {
        const bookingButtons = document.querySelectorAll('a[href*="booking"], a[href*="service-selection"]');
        bookingButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                if (!window.auth.isAuthenticated) {
                    e.preventDefault();
                    const targetUrl = button.getAttribute('href');
                    window.auth.requireAuth(targetUrl);
                }
            });
        });
    }

    // Protect contact form
    protectContactForm() {
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                if (!window.auth.isAuthenticated) {
                    e.preventDefault();
                    window.auth.requireAuth('contact.html');
                }
            });
        }
    }

    // Protect chat feature
    protectChatFeature() {
        // Chat is handled in chatbox.js, but we can add additional protection here
        const chatIcon = document.getElementById('pandit-chatbox-icon');
        if (chatIcon && !window.auth.isAuthenticated) {
            chatIcon.addEventListener('click', (e) => {
                if (!window.auth.isAuthenticated) {
                    e.preventDefault();
                    window.auth.requireAuth();
                }
            });
        }
    }

    // Protect payment features
    protectPaymentFeatures() {
        const paymentButtons = document.querySelectorAll('a[href*="payment"]');
        paymentButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                if (!window.auth.isAuthenticated) {
                    e.preventDefault();
                    window.auth.requireAuth('payment.html');
                }
            });
        });
    }

    // Protect user-specific features
    protectUserSpecificFeatures() {
        const userFeatures = document.querySelectorAll('a[href*="dashboard"], a[href*="profile"]');
        userFeatures.forEach(link => {
            link.addEventListener('click', (e) => {
                if (!window.auth.isAuthenticated) {
                    e.preventDefault();
                    window.auth.requireAuth();
                }
            });
        });
    }

    // Add authentication overlay to protected content
    addAuthOverlay(container, message = 'Please login to access this feature') {
        if (!window.auth.isAuthenticated) {
            const overlay = document.createElement('div');
            overlay.className = 'auth-overlay';
            overlay.innerHTML = `
                <div class="auth-overlay-content">
                    <i class="fas fa-lock"></i>
                    <h3>Authentication Required</h3>
                    <p>${message}</p>
                    <div class="auth-overlay-buttons">
                        <a href="login.html" class="btn btn-primary">Login</a>
                        <a href="signup.html" class="btn btn-secondary">Sign Up</a>
                    </div>
                </div>
            `;

            // Add styles if not already present
            if (!document.querySelector('#auth-overlay-styles')) {
                const style = document.createElement('style');
                style.id = 'auth-overlay-styles';
                style.textContent = `
                    .auth-overlay {
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(255, 255, 255, 0.95);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 100;
                        border-radius: inherit;
                    }
                    .auth-overlay-content {
                        text-align: center;
                        padding: 2rem;
                        max-width: 300px;
                    }
                    .auth-overlay-content i {
                        font-size: 3rem;
                        color: #ff8000;
                        margin-bottom: 1rem;
                    }
                    .auth-overlay-content h3 {
                        margin-bottom: 0.5rem;
                        color: #333;
                    }
                    .auth-overlay-content p {
                        margin-bottom: 1.5rem;
                        color: #666;
                    }
                    .auth-overlay-buttons {
                        display: flex;
                        gap: 1rem;
                        justify-content: center;
                    }
                    .auth-overlay-buttons .btn {
                        padding: 0.5rem 1rem;
                        font-size: 0.9rem;
                    }
                `;
                document.head.appendChild(style);
            }

            container.style.position = 'relative';
            container.appendChild(overlay);
        }
    }

    // Remove auth overlay when user logs in
    removeAuthOverlays() {
        const overlays = document.querySelectorAll('.auth-overlay');
        overlays.forEach(overlay => overlay.remove());
    }
}

// Initialize protected features
const protectedFeatures = new ProtectedFeatures();

// Export for use in other files
window.protectedFeatures = protectedFeatures; 