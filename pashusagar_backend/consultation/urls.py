# consultation/urls.py
from django.urls import path
from .views import (
    ConsultationView,
    messages_list,
    message_detail,
    unread_messages_count,
    mark_all_messages_read,
    message_polling,
    assign_veterinarian_to_message
)

urlpatterns = [
    path("consultation/", ConsultationView.as_view(), name="consultation"),
    path('messages/', messages_list, name='messages-list'),
    path('messages/<int:pk>/', message_detail, name='message-detail'),
    path('messages/unread/count/', unread_messages_count, name='unread-messages-count'),
    path('messages/mark-read/', mark_all_messages_read, name='mark-all-messages-read'),
    path('messages/polling/', message_polling, name='message-polling'),
    path('messages/<int:message_id>/assign/', assign_veterinarian_to_message, name='assign-veterinarian'),
]