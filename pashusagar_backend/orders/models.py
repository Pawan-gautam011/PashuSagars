from django.db import models
from django.conf import settings
from products.models import Product
from django.db import models


class Order(models.Model):
    PAYMENT_STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Accepted', 'Accepted'),
        ('Declined', 'Declined'),
        ('Completed', 'Completed'),
        ('Failed', 'Failed'),
        ('Refunded', 'Refunded'),
        ('Cancelled', 'Cancelled'),
    )
    PAYMENT_METHOD_CHOICES = (
        ('Khalti', 'Khalti'),
        ('Cash on Delivery', 'Cash on Delivery'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='orders',
        on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    payment_status = models.CharField(
        max_length=20, choices=PAYMENT_STATUS_CHOICES, default='Pending'
    )
    payment_method = models.CharField(
        max_length=20, choices=PAYMENT_METHOD_CHOICES, null=True, blank=True
    )
    
    # Store Khalti pidx for payment verification
    khalti_pidx = models.CharField(max_length=100, unique=True, null=True, blank=True)

    # Shipping fields
    shipping_name = models.CharField(max_length=100, blank=True, null=True)
    shipping_phone = models.CharField(max_length=20, blank=True, null=True)
    shipping_address = models.TextField(blank=True, null=True)
    shipping_city = models.CharField(max_length=50, blank=True, null=True)
    shipping_state = models.CharField(max_length=50, blank=True, null=True)
    shipping_zip = models.CharField(max_length=20, blank=True, null=True)
    shipping_email = models.EmailField(max_length=254, blank=True, null=True)  

    # For prescription uploads
    prescription_file = models.FileField(upload_to='prescriptions/', null=True, blank=True)
    
    def __str__(self):
        return f"Order {self.id} by {self.user.username}"
    
    @property
    def status(self):
        """
        This property helps maintain compatibility with the frontend
        which might be looking for a 'status' field instead of 'payment_status'
        """
        return self.payment_status
    
    @property
    def total(self):
        """
        Calculate the total order amount including shipping
        """
        items_total = sum(
            item.price * item.quantity for item in self.items.all()
        )

 

        shipping_cost = 100  # Default shipping cost
        return items_total + shipping_cost


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        related_name='items',
        on_delete=models.CASCADE
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.quantity} x {self.product.title}"