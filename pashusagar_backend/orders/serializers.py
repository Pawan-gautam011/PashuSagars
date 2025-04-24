from rest_framework import serializers
from .models import Order, OrderItem
from products.models import Product,Appointment
import json

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.title')
    product_price = serializers.ReadOnlyField(source='product.price')
    product_image = serializers.ImageField(source='product.images', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = [
            'id',
            'product',
            'product_name',
            'product_price',
            'product_image',
            'quantity'
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
        # Extract the items data
        items_data = validated_data.pop('items', None)
        
        # Set the user from the request context
        validated_data['user'] = self.context['request'].user
        
        # Create the order
        order = Order.objects.create(**validated_data)
        
        # Create the order items if items_data is provided
        if items_data:
            for item_data in items_data:
                product_id = item_data.get('product')
                quantity = item_data.get('quantity', 1)
                
                try:
                    product = Product.objects.get(id=product_id)
                    
                    # Check if product has enough stock
                    if product.stock < quantity:
                        order.delete()  # Rollback the order
                        raise serializers.ValidationError({
                            'items': f"Not enough stock for '{product.title}'. Available: {product.stock}"
                        })
                    
                    # Create the order item
                    OrderItem.objects.create(
                        order=order,
                        product=product,
                        quantity=quantity
                    )
                except Product.DoesNotExist:
                    order.delete()  # Rollback the order
                    raise serializers.ValidationError({
                        'items': f"Product with ID {product_id} does not exist"
                    })
        
        return order

    def validate(self, data):
        """
        Custom validation for the order data.
        """
        # Validate required fields
        required_fields = ['shipping_name', 'shipping_phone', 'shipping_address', 'shipping_email']
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError({field: "This field is required."})
        
        # Validate payment method
        payment_method = data.get('payment_method')
        if not payment_method:
            raise serializers.ValidationError({'payment_method': "Payment method is required."})
        
        if payment_method not in dict(Order.PAYMENT_METHOD_CHOICES).keys():
            raise serializers.ValidationError({'payment_method': "Invalid payment method."})
        
        # Validate cart items - check if cart is not empty
        items_data = self.initial_data.get('items')
        
        # Handle items that came in as JSON string
        if isinstance(items_data, str):
            try:
                items_data = json.loads(items_data)
            except json.JSONDecodeError:
                raise serializers.ValidationError({'items': "Invalid JSON format for items."})
        
        # Check if cart is empty
        if not items_data or not isinstance(items_data, list) or len(items_data) == 0:
            raise serializers.ValidationError({'non_field_errors': "Cart cannot be empty"})
        
        # Check that each item has valid product and quantity
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
                    raise serializers.ValidationError({
                        'items': f"Quantity for item at position {i} must be greater than 0"
                    })
                
                # Check if product exists
                try:
                    Product.objects.get(id=product_id)
                except Product.DoesNotExist:
                    raise serializers.ValidationError({
                        'items': f"Product with ID {product_id} does not exist"
                    })
            except (ValueError, TypeError):
                raise serializers.ValidationError({
                    'items': f"Invalid product ID or quantity at position {i}"
                })
        
        return data

    def to_internal_value(self, data):
        """
        Pre-process the input data before validation.
        """
        # Create a mutable copy of the data
        mutable_data = data.copy() if hasattr(data, 'copy') else dict(data)
        
        # Handle items if they're provided as a JSON string
        if 'items' in mutable_data and isinstance(mutable_data['items'], str):
            try:
                mutable_data['items'] = json.loads(mutable_data['items'])
            except json.JSONDecodeError:
                # Don't need to raise error here; validate() will handle it
                pass
        
        return super().to_internal_value(mutable_data)
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