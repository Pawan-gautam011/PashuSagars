# orders/serializers.py
from rest_framework import serializers
from .models import Order, OrderItem
from products.models import Appointment

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.title')
    product_price = serializers.ReadOnlyField(source='product.price')
    product_image = serializers.ImageField(source='product.images', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = [
            'product',
            'product_name',
            'product_price',
            'product_image',
            'quantity'
        ]

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    # Make sure to include your shipping fields:
    class Meta:
        model = Order
        fields = [
            'id',
            'payment_status',
            'payment_method',
            'khalti_pidx',
            'created_at',
            'items',
            'shipping_name',
            'shipping_phone',
            'shipping_address',
            'shipping_city',
            'shipping_state',
            'shipping_zip',
        ]
        read_only_fields = ['id', 'khalti_pidx', 'created_at', 'payment_status']

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        # The user is inferred from request context
        validated_data['user'] = self.context['request'].user
        
        # Create the Order with the shipping fields
        order = Order.objects.create(**validated_data)
        
        # Create the related OrderItems
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        return order

# If you need the AppointmentSerializer, keep it as is:
class AppointmentSerializer(serializers.ModelSerializer):
    customer_name = serializers.ReadOnlyField(source='customer.username')
    
    class Meta:
        model = Appointment
        fields = [
            'id',
            'customer',
            'customer_name',
            'pet_name',
            'appointment_date',
            'description',
            'is_confirmed'
        ]
