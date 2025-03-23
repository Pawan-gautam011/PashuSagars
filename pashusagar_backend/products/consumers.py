# import json
# from channels.generic.websocket import AsyncWebsocketConsumer
# from .models import Message
# from django.contrib.auth import get_user_model

# User = get_user_model()

# class ChatConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.room_name = self.scope['url_route']['kwargs']['room_name']
#         self.room_group_name = f'chat_{self.room_name}'

#         await self.channel_layer.group_add(self.room_group_name, self.channel_name)
#         await self.accept()

#     async def disconnect(self, close_code):
#         await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

#     async def receive(self, text_data):
#         data = json.loads(text_data)
#         sender_id = data['sender']
#         recipient_id = data['recipient']
#         message = data['message']

#         sender = await User.objects.aget(id=sender_id)
#         recipient = await User.objects.aget(id=recipient_id)
#         message_instance = await Message.objects.acreate(
#             sender=sender, recipient=recipient, content=message
#         )

#         await self.channel_layer.group_send(
#             self.room_group_name,
#             {
#                 'type': 'chat_message',
#                 'sender': sender.username,
#                 'recipient': recipient.username,
#                 'message': message_instance.content,
#                 'timestamp': str(message_instance.timestamp),
#             }
#         )

#     async def chat_message(self, event):
#         await self.send(text_data=json.dumps(event))


# // end //
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Message
from django.contrib.auth import get_user_model

User = get_user_model()

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