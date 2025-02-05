from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)
    category_image = models.ImageField(upload_to='category_images/', blank=True, null=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    category = models.ForeignKey(
        Category, related_name='products', on_delete=models.CASCADE
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    stock = models.PositiveIntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    images = models.ImageField(upload_to='product_images/', blank=True, null=True)

    def __str__(self):
        return self.title
