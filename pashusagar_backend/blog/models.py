from django.db import models
from django.utils.text import slugify
from django.contrib.auth.models import User
import uuid

class Blog(models.Model):
    title = models.CharField(max_length=255, unique=True)
    image = models.ImageField(upload_to='blog_images/', blank=True, null=True)
    description = models.TextField()
    category_name = models.CharField(max_length=100)
    author = models.CharField(max_length=255, blank=True, null=True)
    slug = models.SlugField(unique=True, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            unique_slug = base_slug
            num = 1
            while Blog.objects.filter(slug=unique_slug).exists():
                unique_slug = f'{base_slug}-{num}'
                num += 1
            self.slug = unique_slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title