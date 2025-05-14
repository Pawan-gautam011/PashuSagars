from rest_framework import serializers
from .models import Blog

class BlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = ['id', 'title', 'image', 'description', 'category_name', 'author', 'slug']
        read_only_fields = ['slug']
        extra_kwargs = {
            'title': {'required': True},
            'description': {'required': True},
            'category_name': {'required': True},
            'image': {'required': False},
            'author': {'required': False}
        }

    def validate_title(self, value):
        if len(value) < 5:
            raise serializers.ValidationError("Title must be at least 5 characters long.")
        return value