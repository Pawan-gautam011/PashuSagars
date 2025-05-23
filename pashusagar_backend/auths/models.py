# models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator

class CustomUser(AbstractUser):
    USER_ROLES = (
        (0, 'Admin'),
        (1, 'User'),
        (2, 'Veterinarian'),
    )
    

    username = models.CharField(
        max_length=150,
        unique=True,
        help_text='Required. 150 characters or fewer. Letters, numbers, spaces, and common punctuation allowed.',
        validators=[
            RegexValidator(
                regex=r'^[a-zA-Z0-9\s\.,\-_@]+$',
                message='Username may contain only letters, numbers, spaces, and basic punctuation (. , - _ @).',
                code='invalid_username'
            ),
        ],
        error_messages={
            'unique': "A user with that username already exists.",
        },
    )
    
    
    email = models.EmailField(unique=True)
    role = models.PositiveSmallIntegerField(choices=USER_ROLES, default=1)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    specialization = models.CharField(max_length=200, blank=True, null=True)
    clinic_name = models.CharField(max_length=200, blank=True, null=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

    @property
    def is_veterinarian(self):
        return self.role == 2

# Keep the rest of your models.py file unchanged
from django.utils import timezone
from datetime import timedelta

class PasswordResetOTP(models.Model):
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    def is_expired(self):
        """Return True if more than 10 minutes have passed since creation."""
        return timezone.now() > self.created_at + timedelta(minutes=10)

    def __str__(self):
        return f"{self.email} - {self.otp} (Used: {self.is_used})"