from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from .models import Booking

@csrf_exempt
def mark_paid(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        order_id = data.get('order_id')
        method = data.get('method')
        ref_id = data.get('ref_id')
        try:
            booking = Booking.objects.get(id=order_id)
            booking.payment_status = 'paid'
            booking.payment_method = method
            booking.payment_reference = ref_id
            booking.save()
            return JsonResponse({'success': True})
        except Booking.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Booking not found'})
    return JsonResponse({'error': 'POST required'})
