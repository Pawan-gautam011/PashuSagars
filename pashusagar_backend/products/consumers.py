import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from .models import Message
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser


User = get_user_model()


class MessageConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for handling real-time message notifications
    """
    async def connect(self):
        try:
            # Get token from query string
            token_key = self.scope['query_string'].decode().split('=')[1].split('&')[0]
            user = await self.get_user_from_token(token_key)
            
            if isinstance(user, AnonymousUser):
                await self.close(code=4001)
                return
                
            self.user = user
            self.group_name = f'messages_{user.id}'
            
            # Join user's personal group
            await self.channel_layer.group_add(
                self.group_name,
                self.channel_name
            )
            
            await self.accept()
            
            # Send connection confirmation
            await self.send(text_data=json.dumps({
                'type': 'connection_established',
                'message': 'Connected to message notification service'
            }))
            
        except (IndexError, TokenError, InvalidToken) as e:
            print(f"WebSocket connection error: {str(e)}")
            await self.close(code=4001)
            return
        except Exception as e:
            print(f"Unexpected WebSocket connection error: {str(e)}")
            await self.close(code=4001)
            return

    async def disconnect(self, close_code):
        # Leave group
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message_type = data.get('type', '')
            
            if message_type == 'ping':
                await self.send(text_data=json.dumps({
                    'type': 'pong'
                }))
            elif message_type == 'new_message':
                # Process new message
                message_data = data.get('message', {})
                recipient_id = message_data.get('recipient')
                
                if recipient_id:
                    # Forward to recipient's group
                    await self.channel_layer.group_send(
                        f'messages_{recipient_id}',
                        {
                            'type': 'new_message',
                            'message': message_data
                        }
                    )
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Invalid JSON format'
            }))
        except Exception as e:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': f'Error processing message: {str(e)}'
            }))

    async def new_message(self, event):
        # Send message notification to WebSocket
        await self.send(text_data=json.dumps(event))
    
    async def message_status_update(self, event):
        # Send message status update to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'message_status_update',
            'message_id': event['message_id'],
            'is_read': event['is_read']
        }))
    
    @database_sync_to_async
    def get_user_from_token(self, token_key):
        """Validate token and return user"""
        try:
            # Decode and validate token
            token = AccessToken(token_key)
            user_id = token.payload.get('user_id')
            
            if not user_id:
                return AnonymousUser()
                
            # Get user from database
            return User.objects.get(id=user_id)
        except (TokenError, InvalidToken, User.DoesNotExist):
            return AnonymousUser()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        # Add to room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        # Accept the connection
        await self.accept()
        
        # Send connection confirmation message
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': 'Connected to chat server',
            'room': self.room_name
        }))

    async def disconnect(self, close_code):
        # Remove from room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            sender_id = data.get('sender')
            recipient_id = data.get('recipient')
            message = data.get('message')
            
            if not all([sender_id, recipient_id, message]):
                await self.send(text_data=json.dumps({
                    'type': 'error',
                    'message': 'Invalid message format. Required fields: sender, recipient, message'
                }))
                return
                
            # Get user objects
            try:
                sender = await self.get_user(sender_id)
                recipient = await self.get_user(recipient_id)
            except User.DoesNotExist:
                await self.send(text_data=json.dumps({
                    'type': 'error',
                    'message': 'User not found'
                }))
                return
            
            # Save message to database
            message_instance = await self.save_message(sender, recipient, message)
            
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'sender': sender.username,
                    'recipient': recipient.username,
                    'message': message_instance.content,
                    'timestamp': str(message_instance.timestamp),
                    'message_id': message_instance.id
                }
            )
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Invalid JSON format'
            }))
        except Exception as e:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': f'Error processing message: {str(e)}'
            }))

    async def chat_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps(event))
    
    @database_sync_to_async
    def get_user(self, user_id):
        return User.objects.get(id=user_id)
    
    @database_sync_to_async
    def save_message(self, sender, recipient, content):
        return Message.objects.create(sender=sender, recipient=recipient, content=content)



class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if self.scope["user"].is_anonymous:
            await self.close()
        else:
            self.group_name = f'notifications_{self.scope["user"].id}'
            await self.channel_layer.group_add(
                self.group_name,
                self.channel_name
            )
            await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )

    async def new_notification(self, event):
        await self.send(text_data=json.dumps(event))