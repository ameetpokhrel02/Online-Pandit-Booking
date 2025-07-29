# Authentication System Documentation

## Overview

The BookPandit platform now includes a comprehensive authentication system that requires users to login before accessing certain features like booking, contact forms, and chat functionality.

## Features

### 🔐 **Protected Features**
- **Booking Services**: All booking buttons and forms require authentication
- **Contact Form**: Users must be logged in to submit contact forms
- **Chat System**: Chat functionality requires authentication
- **Payment Processing**: Payment pages require authentication
- **User Dashboard**: All user-specific features require authentication

### 🌐 **Public Access**
- **Browsing**: Users can view all pages without authentication
- **Service Information**: Service details and pandit profiles are publicly accessible
- **About/Contact Pages**: General information pages are public

## Demo Accounts

For testing purposes, the following demo accounts are available:

| Email | Password | User Name |
|-------|----------|-----------|
| `demo@example.com` | `password` | Demo User |
| `user@bookpandit.com` | `user123` | Test User |

## How It Works

### 1. **User Registration**
- Users can create new accounts via the signup page
- Form validation ensures data integrity
- Passwords are confirmed before account creation

### 2. **User Login**
- Users login with email and password
- Session is maintained using localStorage
- Automatic redirect to intended page after login

### 3. **Authentication Checks**
- Protected features check authentication status
- Unauthenticated users are redirected to login page
- Original destination is preserved for post-login redirect

### 4. **Session Management**
- User sessions persist across browser sessions
- Automatic logout on token expiration
- Secure session storage

## Implementation Details

### Files Structure
```
js/
├── auth.js              # Main authentication system
├── protected-features.js # Protected features handler
└── chatbox.js           # Chat with auth integration
```

### Key Components

#### AuthSystem Class (`auth.js`)
- Handles login/logout functionality
- Manages user sessions
- Updates navigation based on auth status
- Shows notifications for auth events

#### ProtectedFeatures Class (`protected-features.js`)
- Protects booking buttons
- Protects contact forms
- Protects chat functionality
- Adds authentication overlays

#### Chat Integration (`chatbox.js`)
- Checks authentication before allowing chat
- Shows auth required message for unauthenticated users
- Maintains chat history for authenticated users

## Usage Examples

### Requiring Authentication
```javascript
// Check if user is authenticated
if (!window.auth.isAuthenticated) {
    window.auth.requireAuth();
}

// Require auth for specific page
window.auth.requireAuth('booking.html');
```

### Protecting Forms
```javascript
// Protect contact form
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', function(e) {
    if (!window.auth.isAuthenticated) {
        e.preventDefault();
        window.auth.requireAuth('contact.html');
    }
});
```

### Protecting Buttons
```javascript
// Protect booking buttons
const bookingButtons = document.querySelectorAll('a[href*="booking"]');
bookingButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        if (!window.auth.isAuthenticated) {
            e.preventDefault();
            window.auth.requireAuth('booking.html');
        }
    });
});
```

## User Experience

### For Unauthenticated Users
1. **Browse Freely**: Can view all pages and service information
2. **Attempt Protected Actions**: Get redirected to login with helpful messages
3. **Clear Guidance**: Notifications explain why authentication is needed

### For Authenticated Users
1. **Full Access**: Can use all features including booking and chat
2. **User Menu**: Dropdown menu with profile options
3. **Session Persistence**: Stay logged in across browser sessions

## Security Features

- **Token-based Authentication**: JWT-style tokens for session management
- **Secure Storage**: Uses localStorage for session persistence
- **Form Validation**: Client-side validation for all forms
- **Redirect Protection**: Preserves intended destination after login
- **Session Cleanup**: Proper logout and session cleanup

## Future Enhancements

- **Backend Integration**: Connect to Django/Node.js backend APIs
- **Password Recovery**: Forgot password functionality
- **Email Verification**: Email confirmation for new accounts
- **Social Login**: Google, Facebook integration
- **Two-Factor Authentication**: Enhanced security for sensitive operations

## Testing

### Manual Testing Steps
1. **Public Access**: Verify all pages load without authentication
2. **Protected Features**: Try booking/contact/chat without login
3. **Login Flow**: Test login with demo accounts
4. **Session Persistence**: Refresh page and verify login status
5. **Logout**: Test logout functionality
6. **Redirect**: Verify redirect to intended page after login

### Demo Account Testing
```bash
# Test Account 1
Email: demo@example.com
Password: password

# Test Account 2  
Email: user@bookpandit.com
Password: user123
```

## Troubleshooting

### Common Issues
1. **Login Not Working**: Check browser console for errors
2. **Session Lost**: Clear localStorage and login again
3. **Redirect Issues**: Check URL parameters for redirect URL
4. **Protected Features Not Working**: Ensure auth.js is loaded

### Debug Mode
Enable debug logging by adding to browser console:
```javascript
localStorage.setItem('debug', 'true');
```

## Integration Notes

### Backend Integration
When connecting to backend APIs, replace the mock functions in `auth.js`:
- `loginUser()` - Connect to `/api/auth/login`
- `registerUser()` - Connect to `/api/auth/register`
- `logout()` - Connect to `/api/auth/logout`

### Database Schema
Ensure backend has corresponding user model:
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

This authentication system provides a solid foundation for the BookPandit platform while maintaining a good user experience for both authenticated and unauthenticated users. 