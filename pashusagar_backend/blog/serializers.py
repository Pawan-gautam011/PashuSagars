from rest_framework import serializers
from .models import Blog

class BlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = ['id', 'title', 'image', 'description', 'category_name', 'author', 'slug']
        read_only_fields = ['slug']
