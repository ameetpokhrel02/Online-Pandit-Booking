from django.urls import path
from .views_slots import available_slots, health, hello

urlpatterns = [
    path('api/slots/', available_slots, name='available_slots'),
    path('health/', health, name='health'),
    path('api/hello/', hello, name='hello'),
]
