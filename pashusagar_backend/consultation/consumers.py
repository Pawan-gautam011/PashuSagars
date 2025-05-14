# consultation/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken

User = get_user_model()

class MessageConsumer(AsyncWebsocketConsumer):
   async def connect(self):
    print("WebSocket connection attempt with query string:", self.scope['query_string'])
    
    try:
        # Extract token from query string
        query_string = self.scope['query_string'].decode()
        print("Decoded query string:", query_string)
        
        token_key = None
        for param in query_string.split('&'):
            if param.startswith('token='):
                token_key = param.split('=')[1]
                print("Token found:", token_key[:10] + "...")
                break
        
        if not token_key:
            print("No token provided")
            await self.close(code=4001)
            return
        
                
            user = await self.get_user_from_token(token_key)
            
            if not user:
                print("Invalid token or user not found")
                await self.close(code=4001)
                return
                
            self.user = user
            self.user_id = user.id
            # Join user's personal notification group
            self.group_name = f'messages_{self.user_id}'
            
            await self.channel_layer.group_add(
                self.group_name,
                self.channel_name
            )
            
            await self.accept()
            print(f"WebSocket connection accepted for user {self.user_id}")
            
            # Send connection confirmation
            await self.send(text_data=json.dumps({
                'type': 'connection_established',
                'message': 'Connected to message notification service'
            }))
            
        except Exception as e:
            print(f"WebSocket connection error: {str(e)}")
            await self.close(code=4002)

    async def disconnect(self, close_code):
        print(f"WebSocket disconnected with code {close_code}")
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        print(f"Received message: {text_data}")
        try:
            data = json.loads(text_data)
            message_type = data.get('type', '')
            
            if message_type == 'ping':
                await self.send(text_data=json.dumps({
                    'type': 'pong'
                }))
                print("Pong sent")
            elif message_type == 'new_message':
                # Process new message
                print("New message received")
                message_data = data.get('message', {})
                recipient_id = message_data.get('recipient')
                
                if recipient_id:
                    # Forward to recipient's group
                    recipient_group = f'messages_{recipient_id}'
                    await self.channel_layer.group_send(
                        recipient_group,
                        {
                            'type': 'new_message',
                            'message': message_data
                        }
                    )
                    print(f"Message forwarded to recipient {recipient_id}")
        except Exception as e:
            print(f"Error processing message: {str(e)}")
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': f'Error processing message: {str(e)}'
            }))

    async def new_message(self, event):
        # Send message notification to WebSocket
        await self.send(text_data=json.dumps(event))
        print(f"Sent message notification to client")
    
    async def message_status_update(self, event):
        # Send message status update to WebSocket
        await self.send(text_data=json.dumps(event))
        print(f"Sent message status update to client")
    
    @database_sync_to_async
    def get_user_from_token(self, token_key):
        """Validate token and return user"""
        try:
            # Decode and validate token
            token = AccessToken(token_key)
            user_id = token.payload.get('user_id')
            
            if not user_id:
                return None
                
            # Get user from database
            return User.objects.get(id=user_id)
        except Exception as e:
            print(f"Token validation error: {str(e)}")
            return None