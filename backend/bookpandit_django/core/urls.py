from django.urls import path
from . import views

urlpatterns = [
    path('hello/', views.hello, name='hello'),
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('pandit/bookings/', views.pandit_bookings, name='pandit_bookings'),
    path('pandit/profile/', views.update_pandit_profile, name='update_pandit_profile'),
    path('pandit/booking-status/', views.update_booking_status, name='update_booking_status'),
    path('chat/send/', views.send_message, name='send_message'),
    path('chat/get/', views.get_messages, name='get_messages'),
    path('book/', views.create_booking, name='create_booking'),
    path('user/bookings/', views.user_bookings, name='user_bookings'),
]
