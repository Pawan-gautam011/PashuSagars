from django.urls import path
from .views import NotificationListView, MarkNotificationAsReadView,DeleteNotificationView

urlpatterns = [
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('notifications/<int:pk>/read/', MarkNotificationAsReadView.as_view(), name='mark-notification-read'),
    path('notifications/delete/<int:pk>/', DeleteNotificationView.as_view(), name='delete-notification'),

]
