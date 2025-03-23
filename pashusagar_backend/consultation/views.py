from django.shortcuts import render

# Create your views here.
# views.py
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Consultation
from .serializers import ConsultationSerializer

class ConsultationView(APIView):
    def post(self, request):
        serializer = ConsultationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# views.py
from .models import Message, CustomUser
from .serializers import MessageSerializer

# views.py
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view  # <-- Add this import
from .models import Message, CustomUser
from .serializers import MessageSerializer
from django.core.mail import send_mail  # Ensure send_mail is imported as well

# Your existing ConsultationView class (no changes needed here)

@api_view(['GET', 'PATCH'])
def assign_veterinarian_to_message(request, message_id):
    try:
        message = Message.objects.get(id=message_id)

        if request.method == 'GET':
            # Return the message details, including the assigned veterinarian (if any)
            serializer = MessageSerializer(message)
            return Response(serializer.data)

        elif request.method == 'PATCH':
            # Get the veterinarian ID from the request data
            veterinarian_id = request.data.get('veterinarian_id')
            if not veterinarian_id:
                return Response({"error": "Veterinarian ID is required"}, status=status.HTTP_400_BAD_REQUEST)

            try:
                # Fetch the veterinarian based on the ID and role
                veterinarian = CustomUser.objects.get(id=veterinarian_id, role=2)
                message.veterinarian = veterinarian
                message.save()

                # Send an email to the user notifying them of the assigned veterinarian
                subject = f"Consultation Update: {message.problem}"
                message_content = f"Dear {message.user_name},\n\nYour consultation request for the problem '{message.problem}' has been assigned to Dr. {veterinarian.username}."
                send_mail(subject, message_content, 'no-reply@example.com', [message.user_email])

                # Return the updated message with the veterinarian assigned
                serializer = MessageSerializer(message)
                return Response(serializer.data, status=status.HTTP_200_OK)

            except CustomUser.DoesNotExist:
                return Response({"error": "Veterinarian not found"}, status=status.HTTP_404_NOT_FOUND)

    except Message.DoesNotExist:
        return Response({"error": "Message not found"}, status=status.HTTP_404_NOT_FOUND)
