# consultation/routing.py
from django.urls import re_path
from . import consumers, test_consumer

websocket_urlpatterns = [
    re_path(r'ws/messages/$', consumers.MessageConsumer.as_asgi()),
    re_path(r'ws/test/$', test_consumer.TestConsumer.as_asgi()),
]