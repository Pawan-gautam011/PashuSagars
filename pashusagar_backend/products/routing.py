from django.urls import path,re_path
from .consumers import ChatConsumer

# In your routing.py
websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<room_name>\w+)/$', ChatConsumer.as_asgi()),
]