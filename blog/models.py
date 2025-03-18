from django.db import models
from django.utils.text import slugify
from django.contrib.auth.models import User

class Blog(models.Model):
    title = models.CharField(max_length=255, unique=True)
    image = models.ImageField(upload_to='blog_images/', blank=True, null=True)
    description = models.TextField()
    category_name = models.CharField(max_length=100)
    author = models.CharField(max_length=255,blank=True, null=True)
    slug = models.SlugField(unique=True, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
