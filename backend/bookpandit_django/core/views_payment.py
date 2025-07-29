from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import os
import requests

# Load keys from environment
ESEWA_MERCHANT_CODE = os.getenv('ESEWA_MERCHANT_CODE')
ESEWA_SECRET_KEY = os.getenv('ESEWA_SECRET_KEY')
IMEPAY_MERCHANT_CODE = os.getenv('IMEPAY_MERCHANT_CODE')
IMEPAY_API_KEY = os.getenv('IMEPAY_API_KEY')
KHALTI_SECRET_KEY = os.getenv('KHALTI_SECRET_KEY')

@csrf_exempt
def verify_esewa(request):
    if request.method == 'POST':
        ref_id = request.POST.get('refId')
        amt = request.POST.get('amt')
        oid = request.POST.get('oid')
        url = 'https://esewa.com.np/epay/transrec'
        payload = {
            'amt': amt,
            'scd': ESEWA_MERCHANT_CODE,
            'pid': oid,
            'rid': ref_id
        }
        try:
            resp = requests.post(url, data=payload)
            if '<response_code>Success</response_code>' in resp.text:
                return JsonResponse({'success': True})
            else:
                return JsonResponse({'success': False, 'raw': resp.text})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    return JsonResponse({'error': 'POST required'})

@csrf_exempt
def verify_imepay(request):
    if request.method == 'POST':
        ref_id = request.POST.get('RefId')
        amt = request.POST.get('Amount')
        url = 'https://staging.imepay.com.np:7979/api/Web/GetTxnStatus'
        payload = {
            'MerchantCode': IMEPAY_MERCHANT_CODE,
            'APIKey': IMEPAY_API_KEY,
            'RefId': ref_id,
            'Amount': amt
        }
        try:
            resp = requests.post(url, json=payload)
            data = resp.json()
            if data.get('ResponseCode') == '0':
                return JsonResponse({'success': True})
            else:
                return JsonResponse({'success': False, 'raw': data})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    return JsonResponse({'error': 'POST required'})

@csrf_exempt
def verify_khalti(request):
    if request.method == 'POST':
        token = request.POST.get('token')
        amount = request.POST.get('amount')
        url = 'https://khalti.com/api/v2/payment/verify/'
        headers = {
            'Authorization': f'Key {KHALTI_SECRET_KEY}'
        }
        payload = {
            'token': token,
            'amount': amount
        }
        try:
            resp = requests.post(url, data=payload, headers=headers)
            data = resp.json()
            if data.get('state') == 'Completed':
                return JsonResponse({'success': True})
            else:
                return JsonResponse({'success': False, 'raw': data})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    return JsonResponse({'error': 'POST required'}) 