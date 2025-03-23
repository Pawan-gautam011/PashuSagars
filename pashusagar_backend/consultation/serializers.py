# serializers.py
from rest_framework import serializers
from .models import Consultation

        # serializers.py
from rest_framework import serializers
from .models import Message
from auths.models import CustomUser  # Correct the import of CustomUser here

class ConsultationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultation
        fields = ["id", "name", "email", "problem", "created_at"]
# serializers.py
from rest_framework import serializers
from .models import Message
from .models import CustomUser

class MessageSerializer(serializers.ModelSerializer):
    veterinarian = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.filter(role=2), required=False)

    class Meta:
        model = Message
        fields = ['id', 'user_name', 'user_email', 'problem', 'created_at','veterinarian']