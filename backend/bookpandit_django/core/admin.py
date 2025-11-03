# bookpandit_django/core/admin.py

from django.contrib import admin
from .models import Booking # Import your Booking model

# Register your models here.
# This makes the Booking model appear in the Django Admin interface.
admin.site.register(Booking)
