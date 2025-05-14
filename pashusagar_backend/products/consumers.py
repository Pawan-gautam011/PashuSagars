import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from urllib.parse import parse_qs

User = get_user_model()

class MessageConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Accept the connection right away for testing
        await self.accept()
        
        # Send a test message to confirm connection
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': 'Connected to WebSocket server!'
        }))
        
        # Get the user from the token later
        query_string = parse_qs(self.scope['query_string'].decode())
        token = query_string.get('token', [None])[0]
        
        if token:
            self.group_name = f'messages_test'
            await self.channel_layer.group_add(
                self.group_name,
                self.channel_name
            )

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            await self.send(text_data=json.dumps({
                'type': 'echo',
                'message': data
            }))
        except Exception as e:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': str(e)
            }))

    async def new_message(self, event):
        await self.send(text_data=json.dumps(event))