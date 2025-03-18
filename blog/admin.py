from django.contrib import admin
from .models import Blog

@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ('title', 'category_name', 'author', 'slug')  
    search_fields = ('title', 'author', 'category_name')  
    list_filter = ('category_name', 'author')  
    prepopulated_fields = {'slug': ('title',)}  
    ordering = ('title',)  
