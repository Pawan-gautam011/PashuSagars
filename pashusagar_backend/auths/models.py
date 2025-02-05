from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    USER_ROLES = (
        (0, 'Admin'),
        (1, 'User'),
    )
    email = models.EmailField(unique=True)
    role = models.PositiveSmallIntegerField(choices=USER_ROLES, default=1)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)  # Optional
    phone_number = models.CharField(max_length=15, blank=True, null=True)  # Add phone_number field

    USERNAME_FIELD = 'email'  # Use email to log in
    REQUIRED_FIELDS = ['username']  # Username is still required

    def __str__(self):
        return self.email
