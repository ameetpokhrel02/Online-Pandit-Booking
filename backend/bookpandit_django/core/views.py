from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from .models import Booking, User
from django.forms.models import model_to_dict
@csrf_exempt
@require_http_methods(["GET"])
def pandit_bookings(request):
    # For demo, get pandit by username from query param (replace with session in production)
    pandit_username = request.GET.get('pandit')
    if not pandit_username:
        return JsonResponse({'error': 'Pandit username required.'}, status=400)
    try:
        pandit = User.objects.get(username=pandit_username, role='pandit')
    except User.DoesNotExist:
        return JsonResponse({'error': 'Pandit not found.'}, status=404)
    bookings = Booking.objects.filter(pandit=pandit).order_by('-date')
    data = [model_to_dict(b, fields=['id', 'service', 'date', 'time', 'status']) for b in bookings]
    return JsonResponse({'bookings': data})

@csrf_exempt
@require_http_methods(["POST"])
def update_pandit_profile(request):
    data = json.loads(request.body)
    username = data.get('username')
    if not username:
        return JsonResponse({'error': 'Username required.'}, status=400)
    try:
        pandit = User.objects.get(username=username, role='pandit')
    except User.DoesNotExist:
        return JsonResponse({'error': 'Pandit not found.'}, status=404)
    pandit.email = data.get('email', pandit.email)
    pandit.first_name = data.get('first_name', pandit.first_name)
    pandit.last_name = data.get('last_name', pandit.last_name)
    # For demo, store bio and skills in first_name/last_name (custom fields recommended)
    pandit.save()
    return JsonResponse({'message': 'Profile updated.'})

@csrf_exempt
@require_http_methods(["POST"])
def update_booking_status(request):
    data = json.loads(request.body)
    booking_id = data.get('booking_id')
    status = data.get('status')
    if not booking_id or status not in ['pending', 'confirmed', 'rejected', 'completed']:
        return JsonResponse({'error': 'Invalid data.'}, status=400)
    try:
        booking = Booking.objects.get(id=booking_id)
    except Booking.DoesNotExist:
        return JsonResponse({'error': 'Booking not found.'}, status=404)
    booking.status = status
    booking.save()
    return JsonResponse({'message': f'Booking status updated to {status}.'})
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login as auth_login
from django.contrib.auth import get_user_model
import json
from .forms import UserSignupForm

User = get_user_model()

def hello(request):
    return JsonResponse({'message': 'Hello from Django!'})

@csrf_exempt
def signup(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        # Only allow user or pandit role for signup
        if data.get('role') not in ['user', 'pandit']:
            return JsonResponse({'error': 'Invalid role for signup.'}, status=400)
        form = UserSignupForm(data)
        if form.is_valid():
            user = form.save()
            return JsonResponse({'message': 'Signup successful!', 'role': user.role})
        else:
            return JsonResponse({'error': form.errors}, status=400)
    return JsonResponse({'error': 'POST request required.'}, status=405)

@csrf_exempt
def login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            # Only allow admin login if role is admin
            if user.role == 'admin' or user.role in ['user', 'pandit']:
                auth_login(request, user)
                return JsonResponse({'message': 'Login successful!', 'role': user.role})
            else:
                return JsonResponse({'error': 'Invalid role.'}, status=403)
        else:
            return JsonResponse({'error': 'Invalid credentials.'}, status=401)
    return JsonResponse({'error': 'POST request required.'}, status=405)
