from django.urls import path
from .views_slots import available_slots, health

urlpatterns = [
    path('api/slots/', available_slots, name='available_slots'),
    path('health/', health, name='health'),
]
