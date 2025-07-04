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
