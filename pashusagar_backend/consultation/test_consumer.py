# consultation/test_consumer.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class TestConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("Test WebSocket connection attempt")
        await self.accept()
        print("Test WebSocket connection accepted")
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': 'Test connection successful'
        }))

    async def disconnect(self, close_code):
        print(f"Test WebSocket disconnected with code {close_code}")

    async def receive(self, text_data):
        print(f"Test received: {text_data}")
        await self.send(text_data=json.dumps({
            'type': 'echo',
            'message': text_data
        }))