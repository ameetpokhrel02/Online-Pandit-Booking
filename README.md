
# Book Pandit - Online Pandit Booking Platform

A modern web platform for booking pandits for religious ceremonies and events.

---

## Features

- User-friendly interface for booking pandits
- Multiple service categories
- Secure payment integration
- User authentication and profile management
- Responsive design for all devices
- Modern UI/UX with translation (English/Nepali)
- Admin dashboard for managing users, bookings, and services

---

## Tech Stack

- HTML5, CSS3 (with modern CSS and responsive design)
- JavaScript (Vanilla, modular)
- Django (backend API)
- MySQL (database)
- Node.js (for backend/server.js)
- Express.js, Sequelize (backend API)
- Font Awesome (icons)

---

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
├── user-dashboard.html     # User dashboard
├── admin-dashboard.html    # Admin dashboard
├── service-selection.html  # Service selection page
├── our-pandits.html        # Pandit profiles
├── styles/
│   ├── main.css            # Main stylesheet
│   ├── dashboard.css       # Dashboard styles
│   └── pandit.css          # Pandit page styles
├── js/
│   ├── main.js             # Main JavaScript
│   ├── auth.js             # Authentication functions
│   ├── payment.js          # Payment logic
│   └── calendar.js         # Calendar functionality
├── images/
│   ├── logo/               # Logo images
│   ├── auth/               # Auth images
│   ├── services/           # Service images
│   ├── payment/            # Payment logos
│   ├── pandits/            # Pandit profile images
│   └── features/           # Feature icons
├── vidoes/
│   └── vidoes/             # Video files (e.g. astrology vide.mp4, glob.mp4)
├── lang.json               # Translation file
├── backend/                # Backend (Django/Node)
│   ├── server.js
│   ├── database.js
│   ├── models/
│   ├── routes/
│   └── middlewares/
└── README.md
```

---

## Required Images & Assets

**Logo and Branding**
- `images/logo/logo.png` - Main website logo (200x50px recommended)
- `images/logo/favicon.ico` - Website favicon (16x16px or 32x32px)

**Authentication**
- `images/auth/auth-bg.jpg` - Login/signup background (1200x800px recommended)

**Services**
- `images/services/wedding.jpg` - Wedding ceremony (400x300px)
- `images/services/house-warming.jpg` - House warming (400x300px)
- `images/services/naming.jpg` - Naming ceremony (400x300px)
- `images/services/religious.jpg` - Religious events (400x300px)
- `images/services/griha-pravesh.jpg` - Griha pravesh (400x300px)
- `images/services/special-pujas.jpg` - Special pujas (400x300px)

**Payment Gateways**
- `images/payment/esewa-logo.png` - eSewa (200x100px)
- `images/payment/imepay-logo.png` - IME Pay (200x100px)
- `images/payment/khalti-logo.png` - Khalti (200x100px)
- `images/payment/connectips-logo.png` - Connect IPS (200x100px)

**Pandit Profiles**
- `images/pandits/pandit1.jpg` - Pandit Ramesh Sharma (200x200px)
- `images/pandits/pandit2.jpg` - Pandit Amit Kumar (200x200px)

**Features**
- `images/features/experienced.jpg` - Experienced pandits (100x100px)
- `images/features/easy-booking.jpg` - Easy booking (100x100px)
- `images/features/pricing.jpg` - Transparent pricing (100x100px)
- `images/features/support.jpg` - 24/7 support (100x100px)

**Videos**
- `vidoes/vidoes/astrology vide.mp4` - Astrology background video
- `vidoes/vidoes/glob.mp4` - Globe earth video for hero section

---

## Setup & Installation

### Prerequisites
- Node.js
- MySQL (via XAMPP or local install)
- Django (for backend API)
- Express.js, Sequelize (for Node backend)

### Steps
1. Clone the repository and navigate to the project folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your database credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=book_pandit
   ```
4. Run the backend server:
   ```bash
   node backend/server.js
   ```
5. For Django API, run:
   ```bash
   python manage.py runserver
   ```

---

## Role-Based Authentication
- Users can register and log in to book services.
- Admins can manage users, bookings, and services.

---

## Database Models
- **User**: username, password, role (user/admin), etc.
- **Booking**: service type, date, user ID, etc.
- **Pandit**: name, experience, location, etc.

---

## Screenshots

### Mobile View
<img width="410" height="778" alt="Mobile View" src="https://github.com/user-attachments/assets/5bf4da18-3aec-40fb-9819-e69b96c24566" />

### Web View
<img width="1857" height="950" alt="Web View" src="https://github.com/user-attachments/assets/ebeeee98-53b5-487b-b946-d41452b56f1d" />

### Web View with Ads Popup
<img width="1863" height="946" alt="Web View with Ads" src="https://github.com/user-attachments/assets/60913741-622b-4585-9f85-9aceaf1d82e0" />

---

## License
This project is licensed under the MIT License.

---

## Project Overview
Book Pandit is a web application that allows users to book pandits for various religious ceremonies. The application features user and admin dashboards, payment integration, and a list of available pandits. It is designed for modern usability, security, and scalability.
