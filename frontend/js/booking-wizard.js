// Booking Wizard JS
const steps = document.querySelectorAll('.wizard-panel');
const stepIndicators = document.querySelectorAll('.wizard-steps .step');
let bookingData = {};
let currentStep = 1;

function showStep(step) {
  steps.forEach((el, idx) => {
    el.classList.toggle('active', idx === step - 1);
  });
  stepIndicators.forEach((el, idx) => {
    el.classList.toggle('active', idx === step - 1);
  });
  currentStep = step;
}

function nextStep(step) {
  // Validate current step
  if (!validateStep(currentStep)) return;
  if (step === 2) {
    bookingData.service = document.querySelector('select[name="service"]').value;
    fetchAvailableSlots(bookingData.service);
  }
  if (step === 3) {
    bookingData.date = document.querySelector('input[name="date"]').value;
    bookingData.time = document.querySelector('input[name="time"]').value;
  }
  if (step === 4) {
    bookingData.name = document.querySelector('input[name="name"]').value;
    bookingData.email = document.querySelector('input[name="email"]').value;
    showReview();
  }
  showStep(step);
}

function prevStep(step) {
  showStep(step);
}

function validateStep(step) {
  let valid = true;
  let errorMsg = '';
  if (step === 1) {
    const service = document.querySelector('select[name="service"]').value;
    if (!service) { valid = false; errorMsg = 'Please select a service.'; }
  }
  if (step === 2) {
    const date = document.querySelector('input[name="date"]').value;
    const time = document.querySelector('input[name="time"]').value;
    if (!date || !time) { valid = false; errorMsg = 'Please select date and time.'; }
  }
  if (step === 3) {
    const name = document.querySelector('input[name="name"]').value;
    const email = document.querySelector('input[name="email"]').value;
    if (!name || !email) { valid = false; errorMsg = 'Please enter your name and email.'; }
  }
  document.querySelectorAll('.error-msg').forEach(e => e.textContent = '');
  if (!valid) {
    document.querySelector(`#step${step} .error-msg`).textContent = errorMsg;
  }
  return valid;
}

function showReview() {
  document.getElementById('review').innerHTML = `
    <h3>Review Your Booking</h3>
    <p><strong>Service:</strong> ${bookingData.service}</p>
    <p><strong>Date:</strong> ${bookingData.date}</p>
    <p><strong>Time:</strong> ${bookingData.time}</p>
    <p><strong>Name:</strong> ${bookingData.name}</p>
    <p><strong>Email:</strong> ${bookingData.email}</p>
  `;
}

async function fetchAvailableSlots(service) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/slots/?service=${encodeURIComponent(service)}`);
    const data = await res.json();
    // TODO: Populate available dates/times in the UI
    console.log('Available slots:', data);
  } catch (err) {
    console.log('Could not fetch slots:', err);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  showStep(1);
  document.getElementById('bookingForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    // For demo, assign pandit1 as the pandit
    bookingData.pandit = 'pandit1';
    const res = await fetch('http://127.0.0.1:8000/api/book/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service: bookingData.service,
        date: bookingData.date,
        time: bookingData.time,
        user_email: bookingData.email,
        user_fullname: bookingData.name,
        pandit: bookingData.pandit
      })
    });
    const data = await res.json();
    if (data.success) {
      document.getElementById('step4').innerHTML += '<div class="success-msg">Booking successful!</div>';
      setTimeout(() => { window.location.href = 'payment.html'; }, 1500);
    } else {
      document.getElementById('step4').innerHTML += `<div class="error-msg">Booking failed: ${data.error || 'Unknown error'}</div>`;
    }
  });
});
