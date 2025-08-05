from . import views_payment
from . import views

urlpatterns = [
    path('api/verify/esewa/', views_payment.verify_esewa, name='verify_esewa'),
    path('api/verify/imepay/', views_payment.verify_imepay, name='verify_imepay'),
    path('api/verify/khalti/', views_payment.verify_khalti, name='verify_khalti'),
    path('api/mark-paid/', views.mark_paid, name='mark_paid'),
]
