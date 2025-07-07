from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.forms.models import model_to_dict
# ...existing code...
@csrf_exempt
@require_http_methods(["GET"])
def user_bookings(request):
    email = request.GET.get('email')
    if not email:
        return JsonResponse({'success': False, 'error': 'Email required.'}, status=400)
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'User not found.'}, status=404)
    bookings = Booking.objects.filter(user=user).order_by('-date')
    data = []
    for b in bookings:
        booking_dict = model_to_dict(b, fields=['id', 'service', 'date', 'time', 'status', 'ceremony_notes'])
        # Add pandit info
        booking_dict['pandit'] = {
            'username': b.pandit.username,
            'email': b.pandit.email,
            'full_name': f"{b.pandit.first_name} {b.pandit.last_name}".strip()
        }
        data.append(booking_dict)
    return JsonResponse({'success': True, 'bookings': data})
# Booking creation API
from django.views.decorators.csrf import csrf_exempt
@csrf_exempt
def create_booking(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except Exception:
            data = request.POST
        # Required fields
        required_fields = ['service', 'date', 'time', 'pandit', 'user_email', 'user_fullname']
        for field in required_fields:
            if not data.get(field):
                return JsonResponse({'success': False, 'error': f'Missing field: {field}'}, status=400)
        # Find or create user by email
        from django.contrib.auth import get_user_model
        User = get_user_model()
        user, _ = User.objects.get_or_create(email=data['user_email'], defaults={
            'username': data['user_email'],
            'first_name': data.get('user_fullname', '').split(' ')[0],
            'last_name': ' '.join(data.get('user_fullname', '').split(' ')[1:]),
            'role': 'user',
        })
        # Find pandit by username or email
        try:
            pandit = User.objects.get(username=data['pandit'], role='pandit')
        except User.DoesNotExist:
            try:
                pandit = User.objects.get(email=data['pandit'], role='pandit')
            except User.DoesNotExist:
                return JsonResponse({'success': False, 'error': 'Pandit not found.'}, status=404)
        # Create booking
        from .models import Booking
        booking = Booking.objects.create(
            user=user,
            pandit=pandit,
            service=data['service'],
            date=data['date'],
            time=data['time'],
            ceremony_notes=data.get('notes', ''),
        )
        return JsonResponse({'success': True, 'message': 'Booking created!', 'booking_id': booking.id})
    return JsonResponse({'success': False, 'error': 'POST request required.'}, status=405)
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login as auth_login
from django.contrib.auth import get_user_model
import json
from .forms import UserSignupForm
from .models import ChatMessage
from django.utils import timezone
from django.db.models import Q
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from .models import Booking, User
from django.forms.models import model_to_dict

User = get_user_model()

# --- Chat APIs ---

@csrf_exempt
@require_http_methods(["POST"])
def send_message(request):
    data = json.loads(request.body)
    sender_username = data.get('sender')
    receiver_username = data.get('receiver')
    message = data.get('message')
    if not (sender_username and receiver_username and message):
        return JsonResponse({'error': 'Missing fields.'}, status=400)
    try:
        sender = User.objects.get(username=sender_username)
        receiver = User.objects.get(username=receiver_username)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found.'}, status=404)
    chat = ChatMessage.objects.create(sender=sender, receiver=receiver, message=message, timestamp=timezone.now())
    return JsonResponse({'message': 'Message sent.', 'id': chat.id, 'timestamp': chat.timestamp})

@csrf_exempt
@require_http_methods(["GET"])
def get_messages(request):
    user1 = request.GET.get('user1')
    user2 = request.GET.get('user2')
    if not (user1 and user2):
        return JsonResponse({'error': 'Missing users.'}, status=400)
    messages = ChatMessage.objects.filter(
        (Q(sender__username=user1) & Q(receiver__username=user2)) |
        (Q(sender__username=user2) & Q(receiver__username=user1))
    ).order_by('timestamp')
    data = [
        {
            'id': m.id,
            'sender': m.sender.username,
            'receiver': m.receiver.username,
            'message': m.message,
            'timestamp': m.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            'is_read': m.is_read
        }
        for m in messages
    ]
    return JsonResponse({'messages': data})

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
    data = []
    for b in bookings:
        booking_dict = model_to_dict(b, fields=['id', 'service', 'date', 'time', 'status', 'ceremony_notes'])
        # Add user info
        booking_dict['user'] = {
            'username': b.user.username,
            'email': b.user.email,
            'full_name': f"{b.user.first_name} {b.user.last_name}".strip()
        }
        data.append(booking_dict)
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

def hello(request):
    return JsonResponse({'message': 'Hello from Django!'})

@csrf_exempt
def signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except Exception:
            data = request.POST
        # Only allow user or pandit role for signup
        if data.get('role') not in ['user', 'pandit']:
            return JsonResponse({'error': 'Invalid role for signup.'}, status=400)
        form = UserSignupForm(data)
        if form.is_valid():
            user = form.save()
            return JsonResponse({'success': True, 'message': 'Signup successful!', 'role': user.role})
        else:
            return JsonResponse({'success': False, 'error': form.errors}, status=400)
    return JsonResponse({'success': False, 'error': 'POST request required.'}, status=405)

@csrf_exempt
def login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except Exception:
            data = request.POST
        username = data.get('username') or data.get('email')
        password = data.get('password')
        # Support login with email or username
        user = None
        if username:
            # Try username first
            user = authenticate(request, username=username, password=password)
            if user is None:
                # Try email if username failed
                from django.contrib.auth import get_user_model
                User = get_user_model()
                try:
                    user_obj = User.objects.get(email=username)
                    user = authenticate(request, username=user_obj.username, password=password)
                except User.DoesNotExist:
                    user = None
        if user is not None:
            # Only allow admin login if role is admin
            if user.role == 'admin' or user.role in ['user', 'pandit']:
                auth_login(request, user)
                return JsonResponse({'success': True, 'message': 'Login successful!', 'role': user.role})
            else:
                return JsonResponse({'success': False, 'error': 'Invalid role.'}, status=403)
        else:
            return JsonResponse({'success': False, 'error': 'Invalid credentials.'}, status=401)
    return JsonResponse({'success': False, 'error': 'POST request required.'}, status=405)
