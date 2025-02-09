import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Message
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        sender_id = data['sender']
        recipient_id = data['recipient']
        message = data['message']

        sender = await User.objects.aget(id=sender_id)
        recipient = await User.objects.aget(id=recipient_id)
        message_instance = await Message.objects.acreate(
            sender=sender, recipient=recipient, content=message
        )

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'sender': sender.username,
                'recipient': recipient.username,
                'message': message_instance.content,
                'timestamp': str(message_instance.timestamp),
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))
