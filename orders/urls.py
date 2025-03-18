# orders/urls.py
from django.urls import path
from .views import InitiatePaymentView, VerifyPaymentView, HistoryListView

urlpatterns = [
    path('initiate-payment/', InitiatePaymentView.as_view(), name='initiate-payment'),
    path('verify-payment/', VerifyPaymentView.as_view(), name='verify-payment'),
    path('history/', HistoryListView.as_view(), name='history'),
]
