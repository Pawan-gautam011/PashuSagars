# serializers.py
from rest_framework import serializers
from .models import Consultation

from .models import Message
from auths.models import CustomUser  # Correct the import of CustomUser here
from .models import CustomUser

class ConsultationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultation
        fields = ["id", "name", "email", "problem", "created_at"]


class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.ReadOnlyField()
    recipient_name = serializers.ReadOnlyField()
    
    class Meta:
        model = Message
        fields = ['id', 'sender', 'recipient', 'content', 'timestamp', 'is_read', 'sender_name', 'recipient_name']
        read_only_fields = ['timestamp']