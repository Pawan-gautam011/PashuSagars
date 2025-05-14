from rest_framework import serializers
from .models import Order, OrderItem
from products.models import Product, Appointment
import json

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.title')
    product_price = serializers.ReadOnlyField(source='product.price')
    product_image = serializers.ImageField(source='product.images', read_only=True)
    price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False) 

    class Meta:
        model = OrderItem
        fields = [
            'id',
            'product',
            'product_name',
            'product_price',
            'product_image',
            'quantity',
            'price'
        ]

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, required=False)
    prescription_file = serializers.FileField(required=False, allow_null=True)
    user_name = serializers.ReadOnlyField(source='user.username')
    user_email = serializers.ReadOnlyField(source='user.email')
    total_amount = serializers.SerializerMethodField()

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
            'shipping_email',
            'user_name',
            'user_email',
            'prescription_file',
            'total_amount'
        ]
        read_only_fields = ['id', 'khalti_pidx', 'created_at', 'payment_status']

    def get_total_amount(self, obj):
        return obj.total

    def create(self, validated_data):
        # ✅ FIX: Read items directly from request.data
        items_data = self.context['request'].data.get('items')
        if isinstance(items_data, str):
            try:
                items_data = json.loads(items_data)
            except json.JSONDecodeError:
                raise serializers.ValidationError({'items': "Invalid JSON format"})

        # Set user
        validated_data['user'] = self.context['request'].user
        order = Order.objects.create(**validated_data)

        if not items_data or not isinstance(items_data, list):
            raise serializers.ValidationError({'items': "Cart cannot be empty"})

        for item in items_data:
            product_id = item.get('product')
            quantity = item.get('quantity')
            price = item.get('price')

            if not product_id or not quantity:
                raise serializers.ValidationError({'items': "Missing product or quantity"})

            try:
                product = Product.objects.get(id=product_id)
            except Product.DoesNotExist:
                order.delete()
                raise serializers.ValidationError({'items': f"Product {product_id} not found"})

            if product.stock < quantity:
                order.delete()
                raise serializers.ValidationError({'items': f"Not enough stock for {product.title}"})

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price=price
            )

        return order

    def validate(self, data):
        # Validate shipping fields
        required_fields = ['shipping_name', 'shipping_phone', 'shipping_address', 'shipping_email']
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError({field: "This field is required."})

        payment_method = data.get('payment_method')
        if not payment_method:
            raise serializers.ValidationError({'payment_method': "Payment method is required."})

        if payment_method not in dict(Order.PAYMENT_METHOD_CHOICES).keys():
            raise serializers.ValidationError({'payment_method': "Invalid payment method."})

        # Validate cart items
        items_data = self.initial_data.get('items')
        if isinstance(items_data, str):
            try:
                items_data = json.loads(items_data)
            except json.JSONDecodeError:
                raise serializers.ValidationError({'items': "Invalid JSON format"})

        if not items_data or not isinstance(items_data, list) or len(items_data) == 0:
            raise serializers.ValidationError({'non_field_errors': "Cart cannot be empty"})

        for i, item in enumerate(items_data):
            if not isinstance(item, dict):
                raise serializers.ValidationError({'items': f"Item at position {i} is not a valid object"})

            if 'product' not in item:
                raise serializers.ValidationError({'items': f"Item at position {i} missing 'product' field"})
            if 'quantity' not in item:
                raise serializers.ValidationError({'items': f"Item at position {i} missing 'quantity' field"})

            try:
                product_id = int(item['product'])
                quantity = int(item['quantity'])

                if quantity <= 0:
                    raise serializers.ValidationError({'items': f"Quantity at position {i} must be > 0"})

                if not Product.objects.filter(id=product_id).exists():
                    raise serializers.ValidationError({'items': f"Product {product_id} does not exist"})
            except (ValueError, TypeError):
                raise serializers.ValidationError({'items': f"Invalid product ID or quantity at position {i}"})

        return data

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
