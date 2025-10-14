from django.http import JsonResponse
from django.views.decorators.http import require_GET
from .models import Booking

@require_GET
def available_slots(request):
    service = request.GET.get('service')
    # Example: Return dummy slots, replace with real logic
    slots = [
        {'date': '2025-09-20', 'times': ['10:00', '14:00', '16:00']},
        {'date': '2025-09-21', 'times': ['09:00', '13:00']},
    ]
    return JsonResponse({'slots': slots})


def health(request):
    """Simple healthcheck endpoint for load-balancers and monitoring."""
    return JsonResponse({'status': 'ok', 'uptime': 'unknown'})
