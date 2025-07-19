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
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm-password');
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    if (!isPasswordStrong(password)) {
        alert('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
        return;
    }
    // Send signup data to Django backend
    fetch('http://localhost:8000/api/signup/', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Account created successfully! Please login to continue.');
            window.location.href = 'login.html';
        } else {
            alert(data.error || 'Signup failed.');
        }
    })
    .catch(() => {
        alert('Signup failed. Please try again.');
    });
}

function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    // Send login data to Django backend
    fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Redirect based on role
            if (data.role === 'admin') {
                window.location.href = 'admin-dashboard.html';
            } else if (data.role === 'pandit') {
                window.location.href = 'pandit-dashboard.html';
            } else {
                window.location.href = 'user-dashboard.html';
            }
        } else {
            alert(data.error || 'Login failed.');
        }
    })
    .catch(() => {
        alert('Login failed. Please try again.');
    });
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