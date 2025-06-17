document.addEventListener('DOMContentLoaded', function() {
    // Initialize password toggle functionality
    initializePasswordToggle();

    // Add form submission handlers
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Add social login handlers
    const googleBtn = document.querySelector('.btn-google');
    if (googleBtn) {
        googleBtn.addEventListener('click', handleGoogleLogin);
    }

    const facebookBtn = document.querySelector('.btn-facebook');
    if (facebookBtn) {
        facebookBtn.addEventListener('click', handleFacebookLogin);
    }
});

function initializePasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

function handleSignup(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Validate passwords match
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm-password');
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    // Validate password strength
    if (!isPasswordStrong(password)) {
        alert('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
        return;
    }
    
    // Here you would typically send the data to your backend
    // For now, we'll just show a success message and redirect to login
    alert('Account created successfully! Please login to continue.');
    window.location.href = 'login.html';
}

function handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Here you would typically send the data to your backend
    // For now, we'll just show a success message and redirect to home
    alert('Login successful!');
    window.location.href = 'index.html';
}

function handleGoogleLogin() {
    // Here you would typically integrate with Google OAuth
    alert('Google login coming soon!');
}

function handleFacebookLogin() {
    // Here you would typically integrate with Facebook OAuth
    alert('Facebook login coming soon!');
}

function isPasswordStrong(password) {
    // Password must be at least 8 characters long and contain:
    // - At least one uppercase letter
    // - At least one lowercase letter
    // - At least one number
    // - At least one special character
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
} 