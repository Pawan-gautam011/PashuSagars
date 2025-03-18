from django.urls import path
from .views import (
    AdminDashboardView, AdminReportView, AppointmentDetailUpdateView, CategoryListCreateView, CategoryDetailView, DashboardStatsView,
    ProductListCreateView, ProductDetailView,
    MessageListCreateView, MessageDetailView,
    AppointmentListCreateView, AppointmentDetailView, ProductReduceStockView, ProductRestockView, ProductSearchView, VeterinarianAppointmentListView
)

urlpatterns = [
    # Categories
    path('categories/', CategoryListCreateView.as_view(), name='category_list_create'),
    path('categories/<int:pk>/', CategoryDetailView.as_view(), name='category_detail'),

    # Products
    path('products/', ProductListCreateView.as_view(), name='product_list_create'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product_detail'),
    path('products/search/', ProductSearchView.as_view(), name='product-search'),

    # Messages
    path('messages/', MessageListCreateView.as_view(), name='message_list_create'),
    path('messages/<int:pk>/', MessageDetailView.as_view(), name='message_detail'),

    # Appointments
    path('appointments/', AppointmentListCreateView.as_view(), name='appointment_list_create'),
    path('appointments/<int:pk>/', AppointmentDetailView.as_view(), name='appointment_detail'),
    path('veterinarian-appointments/', VeterinarianAppointmentListView.as_view(), name='veterinarian_appointments'),
    path('appointment/<int:pk>/', AppointmentDetailUpdateView.as_view(), name='appointment-detail-update'),
    
    #inventory
    path('inventories/<int:pk>/', ProductRestockView.as_view(), name='inventory_list_create'),
    path('inventoriesreduces/<int:pk>/', ProductReduceStockView.as_view(), name='inventory_detail'),

    #Dashboard
    path('dashboard-stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('dashboard-stats/', AdminDashboardView.as_view(), name='admin-dashboard-stats'),
    path('generate-report/', AdminReportView.as_view(), name='admin-generate-report'),

]
