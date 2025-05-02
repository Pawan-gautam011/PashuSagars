# Add these URL patterns to your urls.py

from django.urls import path
from django.conf import settings
from django.conf.urls.static import static


from .views import (
    InitiatePaymentView, 
    VerifyPaymentView, 
    HistoryListView,
    get_all_orders,
    get_order,
    update_order_status,
    admin_orders,
    get_order_prescription
)

urlpatterns = [
    # Existing URLs
    path('initiate-payment/', InitiatePaymentView.as_view(), name='initiate-payment'),
    path('verify-payment/', VerifyPaymentView.as_view(), name='verify-payment'),
    path('history/', HistoryListView.as_view(), name='history'),
    
    # New URLs for order management
    path('orders/', get_all_orders, name='all-orders'),
    path('orders/<int:pk>/', get_order, name='get-order'),
    path('orders/<int:pk>/status/', update_order_status, name='update-order-status'),
    path('admin/orders/', admin_orders, name='admin-orders'),
    path('orders/<int:pk>/prescription/', get_order_prescription, name='order-prescription'),
    
    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

