# consultation/models.py
from django.db import models
from django.conf import settings
from django.utils import timezone

class Consultation(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    problem = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Consultation from {self.name} - {self.problem[:50]}"

class Message(models.Model):
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='consultation_sent_messages'  # Changed from 'sent_messages'
    )
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='consultation_received_messages'  # Changed from 'received_messages'
    )
    content = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now)
    is_read = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['timestamp']
    
    def __str__(self):
        return f"Message from {self.sender} to {self.recipient} at {self.timestamp}"
    
    @property
    def sender_name(self):
        return self.sender.username
    
    @property
    def recipient_name(self):
        return self.recipient.username