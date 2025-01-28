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
    veterinarian_name = serializers.ReadOnlyField(source='veterinarian.username')
    customer_name = serializers.ReadOnlyField(source='customer.username')

    class Meta:
        model = Appointment
        fields = [
            'id', 'veterinarian', 'veterinarian_name', 'customer', 'customer_name',
            'first_name', 'last_name', 'email', 'phone_number', 'pet_name',
            'appointment_date', 'description', 'is_confirmed'
        ]
        read_only_fields = ['id', 'customer', 'customer_name']



class ProductStockUpdateSerializer(serializers.Serializer):
    quantity = serializers.IntegerField()

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than zero.")
        return value