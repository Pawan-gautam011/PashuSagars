# models.py
from django.db import models
from  auths.models import CustomUser


class Consultation(models.Model):
    name = models.CharField(max_length=100)  # Name of the person requesting the consultation
    email = models.EmailField()  # Email of the person requesting the consultation
    problem = models.TextField()  # The problem described in the consultation
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp when the consultation is created

    def __str__(self):
        return f"Consultation from {self.name} - {self.problem[:50]}"  # Truncate problem description for display

class Message(models.Model):
    user_name = models.CharField(max_length=100)
    user_email = models.EmailField()
    problem = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    veterinarian = models.ForeignKey(CustomUser, null=True, blank=True, limit_choices_to={'role': 2}, on_delete=models.SET_NULL)

    def _str_(self):
        return f"Message from {self.user_name}"

    def send_email_to_user(self):
        """Send an email to the user when a veterinarian is assigned."""
        if self.veterinarian:
            subject = f"Consultation Update: {self.problem}"
            message = f"Dear {self.user_name},\n\nYour consultation request for the problem '{self.problem}' has been assigned to Dr. {self.veterinarian.username}."
            send_mail(subject, message, 'no-reply@example.com', [self.user_email])