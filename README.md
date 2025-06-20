
# Book Pandit - Online Pandit Booking Platform

A modern web platform for booking pandits for religious ceremonies and events.

## Features

- User-friendly interface for booking pandits
- Multiple service categories
- Secure payment integration
- User authentication and profile management
- Responsive design for all devices

## Tech Stack

- React.js with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Firebase for authentication and database
- Modern UI/UX design

## Project Structure

```
BookPandit/
├── index.html              # Home page
├── services.html           # Services listing page
├── about.html              # About page
├── contact.html            # Contact page
├── login.html              # Login page
├── signup.html             # Sign up page
├── booking.html            # Booking form page
├── calendar.html           # Calendar selection page
├── payment.html            # Payment page
├── styles/
│   └── main.css            # Main stylesheet
├── js/
│   ├── main.js             # Main JavaScript
│   ├── auth.js             # Authentication functions
│   └── calendar.js         # Calendar functionality
└── images/                 # Image assets
    ├── logo/               # Logo images
    │   ├── logo.png        # Main logo
    │   └── favicon.ico     # Website favicon
    ├── auth/               # Authentication related images
    │   └── auth-bg.jpg     # Authentication background
    ├── services/           # Service related images
    │   ├── wedding.jpg     # Wedding ceremony
    │   ├── house-warming.jpg # House warming
    │   ├── naming.jpg      # Naming ceremony
    │   ├── religious.jpg   # Religious events
    │   ├── griha-pravesh.jpg # Griha pravesh
    │   └── special-pujas.jpg # Special pujas
    ├── payment/            # Payment gateway logos
    │   ├── esewa-logo.png  # eSewa logo
    │   ├── imepay-logo.png # IME Pay logo
    │   ├── khalti-logo.png # Khalti logo
    │   └── connectips-logo.png # Connect IPS logo
    ├── pandits/            # Pandit profile images
    │   ├── pandit1.jpg     # Pandit Ramesh Sharma
    │   └── pandit2.jpg     # Pandit Amit Kumar
    └── features/           # Feature icons
        ├── experienced.jpg # Experienced pandits
        ├── easy-booking.jpg # Easy booking
        ├── pricing.jpg     # Transparent pricing
        └── support.jpg     # 24/7 support
```
Backend
/BookPandit
│
├── /app
│ ├── /components
│ ├── /pages
│ ├── /styles
│ ├── /js
│ └── /images
│
├── /backend
│ ├── /config
│ ├── /controllers
│ ├── /models
│ ├── /routes
│ ├── /middlewares
│ ├── /utils
│ ├── server.js
│ └── database.js
│
├── /public
│ ├── index.html
│ ├── services.html
│ ├── about.html
│ ├── contact.html
│ ├── payment.html
│ └── our-pandits.html
│
├── package.json
├── .env
└── README.md
## Required Images

### Logo and Branding
1. `images/logo/logo.png` - Main website logo (Recommended size: 200x50px)
2. `images/logo/favicon.ico` - Website favicon (16x16px or 32x32px)

### Authentication
1. `images/auth/auth-bg.jpg` - Background image for login/signup pages (Recommended size: 1200x800px)

### Services
1. `images/services/wedding.jpg` - Wedding ceremony image (Recommended size: 400x300px)
2. `images/services/house-warming.jpg` - House warming ceremony image (400x300px)
3. `images/services/naming.jpg` - Naming ceremony image (400x300px)
4. `images/services/religious.jpg` - Religious events image (400x300px)
5. `images/services/griha-pravesh.jpg` - Griha pravesh ceremony image (400x300px)
6. `images/services/special-pujas.jpg` - Special pujas image (400x300px)

### Payment Gateways
1. `images/payment/esewa-logo.png` - eSewa payment gateway logo (200x100px)
2. `images/payment/imepay-logo.png` - IME Pay payment gateway logo (200x100px)
3. `images/payment/khalti-logo.png` - Khalti payment gateway logo (200x100px)
4. `images/payment/connectips-logo.png` - Connect IPS payment gateway logo (200x100px)

### Pandit Profiles
1. `images/pandits/pandit1.jpg` - Pandit Ramesh Sharma profile image (200x200px)
2. `images/pandits/pandit2.jpg` - Pandit Amit Kumar profile image (200x200px)

### Features
1. `images/features/experienced.jpg` - Experienced pandits icon (100x100px)
2. `images/features/easy-booking.jpg` - Easy booking icon (100x100px)
3. `images/features/pricing.jpg` - Transparent pricing icon (100x100px)
4. `images/features/support.jpg` - 24/7 support icon (100x100px)

## Image Guidelines

1. All images should be optimized for web use
2. Use appropriate file formats:
   - Photos: JPG or WebP
   - Logos and icons: PNG with transparency
   - Icons: SVG (preferred) or PNG
3. Maintain consistent aspect ratios within each category
4. Ensure images are high quality but optimized for fast loading
5. Consider responsive design when choosing image sizes

## Setup Instructions

### Prerequisites
- Node.js
- MySQL (via XAMPP)
- Sequelize
- Express.js

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd BookPandit
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   - Start XAMPP and ensure MySQL is running.
   - Create a new database named `book_pandit`.

4. Configure the database connection:
   - Create a `.env` file in the root directory and add your database credentials:
     ```
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=
     DB_NAME=book_pandit
     ```

5. Run the server:
   ```bash
   node backend/server.js
   ```

## Role-Based Authentication
- Users can register and log in to book services.
- Admins can manage users, bookings, and services.

### Database Models
- User: Contains fields for username, password, role (user/admin), etc.
- Booking: Contains fields for service type, date, user ID, etc.
- Pandit: Contains fields for name, experience, location, etc.

## License
This project is licensed under the MIT License.

## Project Overview
Book Pandit is a web application that allows users to book pandits for various religious ceremonies. The application features user and admin dashboards, payment integration, and a list of available pandits. 