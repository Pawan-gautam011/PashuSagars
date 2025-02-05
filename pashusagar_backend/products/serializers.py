from rest_framework import serializers
from .models import Category, Product

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'category_image')

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')  

    class Meta:
        model = Product
        fields = ('id', 'category', 'category_name', 'title', 'description', 'stock', 'price', 'images')
