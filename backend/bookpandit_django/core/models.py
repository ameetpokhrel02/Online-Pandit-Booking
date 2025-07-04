from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('user', 'User'),
        ('pandit', 'Pandit'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')

    def __str__(self):
        return f"{self.username} ({self.role})"


class Booking(models.Model):
    SERVICE_CHOICES = [
        ('marriage', 'Marriage'),
        ('griha_pravesh', 'Griha Pravesh'),
        ('puja', 'Puja'),
        # Add more as needed
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('rejected', 'Rejected'),
        ('completed', 'Completed'),
    ]
    user = models.ForeignKey(User, related_name='user_bookings', on_delete=models.CASCADE)
    pandit = models.ForeignKey(User, related_name='pandit_bookings', on_delete=models.CASCADE, limit_choices_to={'role': 'pandit'})
    service = models.CharField(max_length=50, choices=SERVICE_CHOICES)
    date = models.DateField()
    time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking {self.id} - {self.service} ({self.status})"
