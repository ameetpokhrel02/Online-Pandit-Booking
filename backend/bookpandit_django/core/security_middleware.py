import time
from django.http import HttpResponse

# Very small in-memory rate limiter for demo purposes only.
class SimpleRateLimitMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.requests = {}

    def __call__(self, request):
        # Key by IP
        ip = request.META.get('REMOTE_ADDR', 'unknown')
        now = time.time()
        window = 60  # seconds
        limit = 120  # requests per window
        timestamps = self.requests.get(ip, [])
        # drop old
        timestamps = [t for t in timestamps if now - t < window]
        if len(timestamps) >= limit:
            return HttpResponse('Too Many Requests', status=429)
        timestamps.append(now)
        self.requests[ip] = timestamps

        response = self.get_response(request)

        # Add some recommended security headers
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['Referrer-Policy'] = 'no-referrer-when-downgrade'
        response['Permissions-Policy'] = 'geolocation=(), microphone=()'
        return response
