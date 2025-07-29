from . import views_payment

urlpatterns += [
    path('api/verify/esewa/', views_payment.verify_esewa, name='verify_esewa'),
    path('api/verify/imepay/', views_payment.verify_imepay, name='verify_imepay'),
    path('api/verify/khalti/', views_payment.verify_khalti, name='verify_khalti'),
]
