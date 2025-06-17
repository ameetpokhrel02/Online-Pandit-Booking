document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const service = urlParams.get('service');
    const type = urlParams.get('type');
    const date = urlParams.get('date');
    const time = urlParams.get('time');
    const pandit = urlParams.get('pandit');

    // Update payment summary based on URL parameters
    updatePaymentSummary(service, type, date, time, pandit);

    // Initialize payment method selection
    initializePaymentSelection();

    // Add event listener for proceed to payment button
    document.getElementById('proceed-payment').addEventListener('click', handlePayment);
});

function updatePaymentSummary(service, type, date, time, pandit) {
    const serviceType = document.getElementById('payment-service-type');
    const serviceSubtype = document.getElementById('payment-service-subtype');
    const paymentDate = document.getElementById('payment-date');
    const paymentTime = document.getElementById('payment-time');
    const paymentPandit = document.getElementById('payment-pandit');
    const paymentAmount = document.getElementById('payment-amount');

    // Map service types to their details
    const serviceDetails = {
        'wedding': {
            'full': { price: '₹15,000' },
            'engagement': { price: '₹8,000' },
            'haldi': { price: '₹6,000' }
        },
        'house-warming': {
            'full': { price: '₹8,000' },
            'basic': { price: '₹5,000' }
        },
        'naming': {
            'full': { price: '₹5,000' },
            'simple': { price: '₹3,000' }
        },
        'religious': {
            'pooja': { price: '₹3,000' },
            'havan': { price: '₹5,000' },
            'special': { price: '₹7,000' }
        }
    };

    // Update the summary based on the selected service and type
    if (service && type && serviceDetails[service] && serviceDetails[service][type]) {
        const details = serviceDetails[service][type];
        serviceType.textContent = service.charAt(0).toUpperCase() + service.slice(1).replace('-', ' ');
        serviceSubtype.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        paymentAmount.textContent = details.price;
    }

    // Update date and time if provided
    if (date) {
        paymentDate.textContent = new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    if (time) {
        paymentTime.textContent = time;
    }

    if (pandit) {
        paymentPandit.textContent = decodeURIComponent(pandit);
    }
}

function initializePaymentSelection() {
    const paymentOptions = document.querySelectorAll('.payment-option input[type="radio"]');
    
    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            // Remove selected class from all labels
            document.querySelectorAll('.payment-option label').forEach(label => {
                label.classList.remove('selected');
            });
            
            // Add selected class to the current label
            if (this.checked) {
                this.nextElementSibling.classList.add('selected');
            }
        });
    });
}

// Payment Gateway URLs
const PAYMENT_GATEWAYS = {
    esewa: {
        testUrl: 'https://uat.esewa.com.np/epay/main',
        liveUrl: 'https://esewa.com.np/epay/main',
        params: {
            amt: '',
            psc: 0,
            pdc: 0,
            txAmt: 0,
            tAmt: '',
            pid: '',
            scd: 'EPAYTEST', // Merchant code (replace with your actual merchant code in production)
            su: 'http://localhost/success', // Success URL
            fu: 'http://localhost/failure' // Failure URL
        }
    },
    khalti: {
        testUrl: 'https://test-pay.khalti.com/',
        liveUrl: 'https://pay.khalti.com/',
        config: {
            publicKey: "test_public_key_dc74e0fd57cb46cd93832aee0a390234", // Replace with your actual public key
            productIdentity: "",
            productName: "Pandit Booking",
            productUrl: "http://localhost/product",
            eventHandler: {
                onSuccess: function (payload) {
                    console.log(payload);
                    // Handle success
                },
                onError: function (error) {
                    console.log(error);
                    // Handle errors
                },
                onClose: function () {
                    console.log('Widget is closing');
                }
            }
        }
    },
    imepay: {
        testUrl: 'https://stg.imepay.com.np:7979/api/Web/GetToken',
        liveUrl: 'https://payment.imepay.com.np/api/Web/GetToken',
        params: {
            MerchantCode: 'TEST', // Replace with your actual merchant code
            Amount: '',
            RefId: '',
            TokenId: '',
            Module: 'WEBPAY'
        }
    },
    connectips: {
        testUrl: 'https://uat.connectips.com/connectipswebgw/loginpage',
        liveUrl: 'https://connectips.com/connectipswebgw/loginpage',
        params: {
            MERCHANTID: 'TEST', // Replace with your actual merchant ID
            APPID: '',
            APPNAME: 'Book Pandit',
            TXNID: '',
            TXNAMT: '',
            REFERENCEID: '',
            REMARKS: 'Pandit Booking Payment',
            PARTICULARS: ''
        }
    }
};

// Get the payment amount from the page
function getPaymentAmount() {
    const amountElement = document.getElementById('payment-amount');
    return parseFloat(amountElement.textContent.replace('₹', '').replace(',', ''));
}

// Generate a unique transaction ID
function generateTransactionId() {
    return 'BP' + Date.now() + Math.random().toString(36).substr(2, 9);
}

// Initialize Khalti
function initializeKhalti() {
    if (typeof KhaltiCheckout !== 'undefined') {
        const config = {
            ...PAYMENT_GATEWAYS.khalti.config,
            amount: getPaymentAmount() * 100, // Amount in paisa
        };
        return new KhaltiCheckout(config);
    }
    console.error('Khalti SDK not loaded');
    return null;
}

// Handle eSewa Payment
function handleEsewaPayment() {
    const amount = getPaymentAmount();
    const pid = generateTransactionId();
    
    const form = document.createElement('form');
    form.setAttribute('method', 'POST');
    form.setAttribute('action', PAYMENT_GATEWAYS.esewa.testUrl);

    const params = {
        ...PAYMENT_GATEWAYS.esewa.params,
        tAmt: amount,
        amt: amount,
        pid: pid
    };

    // Create hidden fields
    Object.keys(params).forEach(key => {
        const hiddenField = document.createElement('input');
        hiddenField.setAttribute('type', 'hidden');
        hiddenField.setAttribute('name', key);
        hiddenField.setAttribute('value', params[key]);
        form.appendChild(hiddenField);
    });

    document.body.appendChild(form);
    form.submit();
}

// Handle IME Pay Payment
function handleImePayment() {
    const amount = getPaymentAmount();
    const refId = generateTransactionId();
    
    const params = {
        ...PAYMENT_GATEWAYS.imepay.params,
        Amount: amount,
        RefId: refId
    };

    // In a real implementation, you would:
    // 1. Make a server-side call to get IME token
    // 2. Redirect to IME payment page with token
    window.location.href = PAYMENT_GATEWAYS.imepay.testUrl + '?' + new URLSearchParams(params).toString();
}

// Handle Connect IPS Payment
function handleConnectIpsPayment() {
    const amount = getPaymentAmount();
    const txnId = generateTransactionId();
    
    const params = {
        ...PAYMENT_GATEWAYS.connectips.params,
        TXNID: txnId,
        TXNAMT: amount
    };

    // Redirect to Connect IPS
    window.location.href = PAYMENT_GATEWAYS.connectips.testUrl + '?' + new URLSearchParams(params).toString();
}

// Main payment handler
function handlePayment(paymentMethod) {
    switch(paymentMethod) {
        case 'esewa':
            handleEsewaPayment();
            break;
        case 'khalti':
            const khaltiCheckout = initializeKhalti();
            if (khaltiCheckout) {
                khaltiCheckout.show({amount: getPaymentAmount() * 100});
            }
            break;
        case 'imepay':
            handleImePayment();
            break;
        case 'connectips':
            handleConnectIpsPayment();
            break;
        default:
            alert('Please select a payment method');
    }
} 