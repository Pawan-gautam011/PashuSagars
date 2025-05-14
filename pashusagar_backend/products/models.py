from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils.timezone import now

# Category Model
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    category_image = models.ImageField(upload_to='category_images/', blank=True, null=True)

    def __str__(self):
        return self.name

# Product Model with Inventory Management
class Product(models.Model):
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    stock = models.PositiveIntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    images = models.ImageField(upload_to='product_images/', blank=True, null=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='products', on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    is_poisonous = models.BooleanField(default=False, help_text="Indicates if the medicine is potentially poisonous to animals")

    def __str__(self):
        return self.title

    # Inventory management methods
    def reduce_stock(self, quantity):
        if quantity > self.stock:
            raise ValidationError("Not enough stock available.")
        self.stock -= quantity
        self.save()

    def restock(self, quantity):
        if quantity <= 0:
            raise ValidationError("Quantity must be positive.")
        self.stock += quantity
        self.save()

# Message Model for Chat
class Message(models.Model):
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='product_sent_messages', on_delete=models.CASCADE, db_index=True
    )
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='product_received_messages', on_delete=models.CASCADE, db_index=True
    )
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)

    def __str__(self):
        return f"Message from {self.sender.username} to {self.recipient.username} at {self.timestamp}"


class Appointment(models.Model):
    status_choices = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ]

    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='customer_appointments', on_delete=models.CASCADE
    )
    veterinarian = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        related_name='veterinarian_appointments',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(db_index=True)
    phone_number = models.CharField(max_length=15)
    pet_name = models.CharField(max_length=100)
    appointment_date = models.DateTimeField(db_index=True)
    description = models.TextField(blank=True, null=True)
    is_confirmed = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=status_choices, default='pending')

    def __str__(self):
        vet_name = self.veterinarian.username if self.veterinarian else "No Veterinarian Assigned"
        return f"Appointment for {self.pet_name} with {vet_name} on {self.appointment_date}"

    def clean(self):
        if self.appointment_date < now():
            raise ValidationError("Appointment date cannot be in the past.")