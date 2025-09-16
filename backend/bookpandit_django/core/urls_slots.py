from django.urls import path
from .views_slots import available_slots

urlpatterns = [
    path('api/slots/', available_slots, name='available_slots'),
]
