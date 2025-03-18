from rest_framework import serializers
from .models import Category, Product, Message, Appointment

# Category Serializer
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'category_image']

# Product Serializer
class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    created_by_name = serializers.ReadOnlyField(source='created_by.username')

    class Meta:
        model = Product
        fields = [
            'id', 'category', 'category_name', 'title', 'description',
            'stock', 'price', 'images', 'created_by', 'created_by_name', 'created_at'
        ]
        read_only_fields = ['created_by', 'created_at']


# Message Serializer
class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.ReadOnlyField(source='sender.username')
    recipient_name = serializers.ReadOnlyField(source='recipient.username')

    class Meta:
        model = Message
        fields = ['id', 'sender', 'sender_name', 'recipient', 'recipient_name', 'content', 'timestamp']
        read_only_fields = ['id', 'timestamp']


# Appointment Serializer
class AppointmentSerializer(serializers.ModelSerializer):
    customer_name = serializers.ReadOnlyField(source='customer.username')

    class Meta:
        model = Appointment
        fields = [
            'id', 'customer', 'customer_name', 'first_name', 'last_name',
            'email', 'appointment_date', 'description', 'is_confirmed', 'status'
        ]
        read_only_fields = ['id', 'customer', 'customer_name']



class ProductStockUpdateSerializer(serializers.Serializer):
    quantity = serializers.IntegerField()

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than zero.")
        return value
    
# Serializer for Dashboard Stats
class DashboardStatsSerializer(serializers.Serializer):
    total_products = serializers.IntegerField()
    total_appointments = serializers.IntegerField()
    pending_appointments = serializers.IntegerField()
    total_messages = serializers.IntegerField()
    unread_messages = serializers.IntegerField()


from rest_framework import serializers
from auths.models import CustomUser
from orders.models import Order, OrderItem
from django.db.models import Sum

class AdminDashboardSerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    total_products = serializers.IntegerField()
    total_appointments = serializers.IntegerField()
    total_orders = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=10, decimal_places=2)

class ReportSerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    total_products = serializers.IntegerField()
    total_appointments = serializers.IntegerField()
    total_orders = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=10, decimal_places=2)
    pending_orders = serializers.IntegerField()
    completed_orders = serializers.IntegerField()
    failed_orders = serializers.IntegerField()
    refunded_orders = serializers.IntegerField()
