document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const service = urlParams.get('service');
    const type = urlParams.get('type');

    // Update service summary based on URL parameters
    updateServiceSummary(service, type);

    // Initialize calendar
    initializeCalendar();

    // Initialize time slots
    initializeTimeSlots();

    // Initialize pandit selection
    initializePanditSelection();
});

function updateServiceSummary(service, type) {
    const serviceType = document.getElementById('service-type');
    const serviceSubtype = document.getElementById('service-subtype');
    const serviceDuration = document.getElementById('service-duration');
    const servicePrice = document.getElementById('service-price');

    // Map service types to their details
    const serviceDetails = {
        'wedding': {
            'full': { duration: '4-6 hours', price: '₹15,000' },
            'engagement': { duration: '2-3 hours', price: '₹8,000' },
            'haldi': { duration: '1-2 hours', price: '₹6,000' }
        },
        'house-warming': {
            'full': { duration: '2-3 hours', price: '₹8,000' },
            'basic': { duration: '1-2 hours', price: '₹5,000' }
        },
        'naming': {
            'full': { duration: '2-3 hours', price: '₹5,000' },
            'simple': { duration: '1-2 hours', price: '₹3,000' }
        },
        'religious': {
            'pooja': { duration: '1-2 hours', price: '₹3,000' },
            'havan': { duration: '2-3 hours', price: '₹5,000' },
            'special': { duration: '3-4 hours', price: '₹7,000' }
        }
    };

    // Update the summary based on the selected service and type
    if (service && type && serviceDetails[service] && serviceDetails[service][type]) {
        const details = serviceDetails[service][type];
        serviceType.textContent = service.charAt(0).toUpperCase() + service.slice(1).replace('-', ' ');
        serviceSubtype.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        serviceDuration.textContent = details.duration;
        servicePrice.textContent = details.price;
    }
}

function initializeCalendar() {
    const calendarDays = document.getElementById('calendar-days');
    const currentMonth = document.getElementById('current-month');
    const prevMonthBtn = document.querySelector('.prev-month');
    const nextMonthBtn = document.querySelector('.next-month');

    let currentDate = new Date();
    let currentMonthIndex = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    function updateCalendar() {
        // Clear previous days
        calendarDays.innerHTML = '';

        // Update month and year display
        currentMonth.textContent = new Date(currentYear, currentMonthIndex).toLocaleString('default', { month: 'long', year: 'numeric' });

        // Get first day of the month
        const firstDay = new Date(currentYear, currentMonthIndex, 1);
        const startingDay = firstDay.getDay();

        // Get last day of the month
        const lastDay = new Date(currentYear, currentMonthIndex + 1, 0);
        const totalDays = lastDay.getDate();

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day empty';
            calendarDays.appendChild(emptyCell);
        }

        // Add days of the month
        for (let day = 1; day <= totalDays; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day';
            dayCell.textContent = day;

            // Disable past dates
            const cellDate = new Date(currentYear, currentMonthIndex, day);
            if (cellDate < new Date().setHours(0, 0, 0, 0)) {
                dayCell.classList.add('disabled');
            }

            // Add click event
            dayCell.addEventListener('click', function() {
                if (!this.classList.contains('disabled')) {
                    document.querySelectorAll('.calendar-day').forEach(day => day.classList.remove('selected'));
                    this.classList.add('selected');
                }
            });

            calendarDays.appendChild(dayCell);
        }
    }

    // Initialize calendar
    updateCalendar();

    // Add event listeners for month navigation
    prevMonthBtn.addEventListener('click', function() {
        currentMonthIndex--;
        if (currentMonthIndex < 0) {
            currentMonthIndex = 11;
            currentYear--;
        }
        updateCalendar();
    });

    nextMonthBtn.addEventListener('click', function() {
        currentMonthIndex++;
        if (currentMonthIndex > 11) {
            currentMonthIndex = 0;
            currentYear++;
        }
        updateCalendar();
    });
}

function initializeTimeSlots() {
    const timeSlots = document.querySelectorAll('.time-slot');
    
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            timeSlots.forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
}

function initializePanditSelection() {
    const panditCards = document.querySelectorAll('.pandit-card');
    
    panditCards.forEach(card => {
        card.addEventListener('click', function() {
            panditCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
} 