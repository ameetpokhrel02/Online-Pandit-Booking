// Authentication System for BookPandit
class AuthSystem {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.setupEventListeners();
        this.updateNavigation();
    }

    // Check if user is logged in
    checkAuthStatus() {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('user');
        
        if (token && user) {
            try {
                this.currentUser = JSON.parse(user);
                this.isAuthenticated = true;
                this.updateNavigation();
            } catch (error) {
                this.logout();
            }
        }
    }

    // Setup event listeners for forms
    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Signup form
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }

        // Logout button
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => this.handleLogout(e));
        }
    }

    // Handle login
    async handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            // Show loading state
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Logging in...';
            submitBtn.disabled = true;

            // Simulate API call (replace with actual API endpoint)
            const response = await this.loginUser(email, password);
            
            if (response.success) {
                this.login(response.user, response.token);
                this.showNotification('Login successful!', 'success');
                
                // Redirect to dashboard or previous page
                const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || 'user-dashboard.html';
                window.location.href = redirectUrl;
            } else {
                this.showNotification(response.message || 'Login failed', 'error');
            }
        } catch (error) {
            this.showNotification('An error occurred during login', 'error');
        } finally {
            // Reset button
            const submitBtn = e.target.querySelector('button[type="submit"]');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    // Handle signup
    async handleSignup(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userData = {
            fullname: formData.get('fullname'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirm-password')
        };

        // Validate passwords match
        if (userData.password !== userData.confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            return;
        }

        try {
            // Show loading state
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Creating account...';
            submitBtn.disabled = true;

            // Simulate API call (replace with actual API endpoint)
            const response = await this.registerUser(userData);
            
            if (response.success) {
                this.showNotification('Account created successfully! Please login.', 'success');
                // Redirect to login page
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                this.showNotification(response.message || 'Registration failed', 'error');
            }
        } catch (error) {
            this.showNotification('An error occurred during registration', 'error');
        } finally {
            // Reset button
            const submitBtn = e.target.querySelector('button[type="submit"]');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    // Handle logout
    handleLogout(e) {
        e.preventDefault();
        this.logout();
        this.showNotification('Logged out successfully', 'success');
        window.location.href = 'index.html';
    }

    // Login user
    login(user, token) {
        this.currentUser = user;
        this.isAuthenticated = true;
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        this.updateNavigation();
    }

    // Logout user
    logout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        this.updateNavigation();
    }

    // Update navigation based on auth status
    updateNavigation() {
        const navLinks = document.querySelector('.nav-links');
        if (!navLinks) return;

        const authButtons = navLinks.querySelectorAll('.auth-buttons');
        authButtons.forEach(btn => btn.remove());

        if (this.isAuthenticated) {
            // Show user menu
            const userMenu = document.createElement('div');
            userMenu.className = 'auth-buttons';
            userMenu.innerHTML = `
                <div class="user-menu">
                    <button class="user-menu-btn">
                        <i class="fas fa-user"></i>
                        <span>${this.currentUser.fullname}</span>
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="user-dropdown">
                        <a href="user-dashboard.html"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
                        <a href="user-dashboard.html#bookings"><i class="fas fa-calendar"></i> My Bookings</a>
                        <a href="user-dashboard.html#profile"><i class="fas fa-user-edit"></i> Profile</a>
                        <a href="#" class="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a>
                    </div>
                </div>
            `;
            navLinks.appendChild(userMenu);

            // Add event listener for logout
            const logoutBtn = userMenu.querySelector('.logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => this.handleLogout(e));
            }

            // Remove auth overlays when user is authenticated
            if (window.protectedFeatures) {
                window.protectedFeatures.removeAuthOverlays();
            }
        } else {
            // Show login/signup buttons
            const authButtons = document.createElement('div');
            authButtons.className = 'auth-buttons';
            authButtons.innerHTML = `
                <a href="login.html" class="btn btn-secondary" data-i18n="login">Login</a>
                <a href="signup.html" class="btn btn-primary" data-i18n="signup">Sign Up</a>
            `;
            navLinks.appendChild(authButtons);
        }
    }

    // Check if user is authenticated for protected features
    requireAuth(redirectUrl = null) {
        if (!this.isAuthenticated) {
            const currentUrl = window.location.pathname;
            const loginUrl = redirectUrl || `login.html?redirect=${encodeURIComponent(currentUrl)}`;
            this.showNotification('Please login to access this feature', 'warning');
            setTimeout(() => {
                window.location.href = loginUrl;
            }, 2000);
            return false;
        }
        return true;
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.auth-notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification
        const notification = document.createElement('div');
        notification.className = `auth-notification auth-notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add styles
        if (!document.querySelector('#auth-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'auth-notification-styles';
            style.textContent = `
                .auth-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    background: #fff;
                    border-radius: 8px;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
                    padding: 16px 20px;
                    min-width: 300px;
                    max-width: 400px;
                    border-left: 4px solid #1976d2;
                    animation: slideInRight 0.3s ease-out;
                }
                .auth-notification-success { border-left-color: #4caf50; }
                .auth-notification-error { border-left-color: #f44336; }
                .auth-notification-warning { border-left-color: #ff9800; }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .notification-content i {
                    font-size: 1.2rem;
                }
                .auth-notification-success .notification-content i { color: #4caf50; }
                .auth-notification-error .notification-content i { color: #f44336; }
                .auth-notification-warning .notification-content i { color: #ff9800; }
                .notification-close {
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    cursor: pointer;
                    margin-left: auto;
                    color: #666;
                }
                .notification-close:hover { color: #333; }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .user-menu {
                    position: relative;
                    display: inline-block;
                }
                .user-menu-btn {
                    background: #ff8000;
                    color: #fff;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.9rem;
                }
                .user-dropdown {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    background: #fff;
                    border-radius: 8px;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
                    min-width: 200px;
                    display: none;
                    z-index: 1000;
                }
                .user-menu:hover .user-dropdown {
                    display: block;
                }
                .user-dropdown a {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 16px;
                    color: #333;
                    text-decoration: none;
                    border-bottom: 1px solid #eee;
                }
                .user-dropdown a:hover {
                    background: #f5f5f5;
                }
                .user-dropdown a:last-child {
                    border-bottom: none;
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => notification.remove());
        }
    }

    // Get notification icon
    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // Simulate API calls (replace with actual API endpoints)
    async loginUser(email, password) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Demo accounts for testing
        const demoAccounts = {
            'demo@example.com': {
                password: 'password',
                user: {
                    id: 1,
                    fullname: 'Demo User',
                    email: 'demo@example.com',
                    phone: '+977 984223344'
                }
            },
            'user@bookpandit.com': {
                password: 'user123',
                user: {
                    id: 2,
                    fullname: 'Test User',
                    email: 'user@bookpandit.com',
                    phone: '+977 985556667'
                }
            }
        };
        
        const account = demoAccounts[email];
        if (account && account.password === password) {
            return {
                success: true,
                user: account.user,
                token: 'mock-jwt-token-' + Date.now()
            };
        } else {
            return {
                success: false,
                message: 'Invalid email or password. Try demo@example.com / password'
            };
        }
    }

    async registerUser(userData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock validation (replace with actual API call)
        if (userData.email && userData.password) {
            return {
                success: true,
                message: 'Account created successfully'
            };
        } else {
            return {
                success: false,
                message: 'Registration failed'
            };
        }
    }
}

// Initialize authentication system
const auth = new AuthSystem();

// Export for use in other files
window.auth = auth; 