# consultation/views.py
from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import Consultation, Message
from .serializers import ConsultationSerializer, MessageSerializer
from django.core.mail import send_mail
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from datetime import datetime, timedelta
from django.utils import timezone
from auths.models import CustomUser

class ConsultationView(APIView):
    def post(self, request):
        serializer = ConsultationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def messages_list(request):
    """
    Get all messages or create a new message
    """
    if request.method == 'GET':
        # Get messages where the user is either sender or recipient
        messages = Message.objects.filter(
            Q(sender=request.user) | Q(recipient=request.user)
        ).order_by('timestamp')
        
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
    
   # Modification to views.py message_list function (send section)
    elif request.method == 'POST':
        data = request.data.copy()
        data['sender'] = request.user.id
        
        serializer = MessageSerializer(data=data)
        if serializer.is_valid():
            message = serializer.save()
            
            try:
                # Get sender and recipient details for better WebSocket message
                sender_name = request.user.username
                recipient_id = message.recipient.id
                
                # Prepare full message data for WebSocket
                message_data = {
                    'id': message.id,
                    'sender': message.sender.id,
                    'recipient': recipient_id,
                    'sender_name': sender_name,
                    'recipient_name': message.recipient.username,
                    'content': message.content,
                    'timestamp': message.timestamp.isoformat(),
                    'is_read': False
                }
                
                # Send to recipient's WebSocket group
                channel_layer = get_channel_layer()
                async_to_sync(channel_layer.group_send)(
                    f'messages_{recipient_id}',
                    {
                        'type': 'new_message',
                        'message': message_data
                    }
                )
                
                print(f"WebSocket notification sent to recipient {recipient_id}")
            except Exception as e:
                print(f"Error sending WebSocket notification: {str(e)}")
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def message_detail(request, pk):
    """
    Retrieve or update a message
    """
    try:
        message = Message.objects.get(pk=pk)
        
        # Check if user has permission (only sender or recipient can view/update)
        if request.user != message.sender and request.user != message.recipient:
            return Response(
                {"error": "You don't have permission to access this message"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        if request.method == 'GET':
            serializer = MessageSerializer(message)
            return Response(serializer.data)
        
        elif request.method == 'PATCH':
            # Only allow updating is_read field
            data = {'is_read': request.data.get('is_read', False)}
            
            # Only recipient can mark a message as read
            if request.user != message.recipient and 'is_read' in request.data:
                return Response(
                    {"error": "Only the recipient can mark a message as read"}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            serializer = MessageSerializer(message, data=data, partial=True)
            if serializer.is_valid():
                updated_message = serializer.save()
                
                # Notify sender that message was read via WebSocket
                if updated_message.is_read:
                    try:
                        channel_layer = get_channel_layer()
                        async_to_sync(channel_layer.group_send)(
                            f'messages_{updated_message.sender.id}',
                            {
                                'type': 'message_status_update',
                                'message_id': updated_message.id,
                                'is_read': True
                            }
                        )
                    except Exception as e:
                        print(f"Error sending WebSocket notification: {str(e)}")
                
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
    except Message.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def unread_messages_count(request):
    """
    Get the count of unread messages for the current user
    """
    user = request.user
    count = Message.objects.filter(
        recipient=user,
        is_read=False
    ).count()
    
    return Response({'unread_count': count})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_all_messages_read(request):
    """
    Mark all messages for the current user as read
    """
    user = request.user
    
    # Option 1: Mark all unread messages as read
    if 'message_ids' not in request.data:
        messages = Message.objects.filter(
            recipient=user,
            is_read=False
        )
    # Option 2: Mark specific messages as read
    else:
        message_ids = request.data.get('message_ids', [])
        messages = Message.objects.filter(
            recipient=user,
            id__in=message_ids,
            is_read=False
        )
    
    updated_count = messages.update(is_read=True)
    
    # Send WebSocket notifications for each message that was marked as read
    if updated_count > 0:
        channel_layer = get_channel_layer()
        
        # Group messages by sender to send fewer notifications
        senders = {}
        for msg in messages:
            if msg.sender_id not in senders:
                senders[msg.sender_id] = []
            senders[msg.sender_id].append(msg.id)
        
        # Send notification to each sender
        for sender_id, msg_ids in senders.items():
            for msg_id in msg_ids:
                try:
                    async_to_sync(channel_layer.group_send)(
                        f'messages_{sender_id}',
                        {
                            'type': 'message_status_update',
                            'message_id': msg_id,
                            'is_read': True
                        }
                    )
                except Exception as e:
                    # Log error but continue processing
                    print(f"Error sending WebSocket notification: {str(e)}")
    
    return Response({
        'message': f'Marked {updated_count} messages as read',
        'updated_count': updated_count
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def message_polling(request):
    """Endpoint for polling new messages when WebSockets fail"""
    user = request.user
    since = request.query_params.get('since', 0)
    
    try:
        since_timestamp = int(since) / 1000  # Convert JS timestamp to seconds
        since_datetime = datetime.fromtimestamp(since_timestamp, tz=timezone.utc)
    except (ValueError, TypeError):
        # Default to fetching last 10 minutes of messages if invalid timestamp
        since_datetime = timezone.now() - timedelta(minutes=10)
    
    # Get messages where the user is sender or recipient, after the since timestamp
    messages = Message.objects.filter(
        (Q(sender=user) | Q(recipient=user)) & 
        Q(timestamp__gt=since_datetime)
    ).order_by('timestamp')
    
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)

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