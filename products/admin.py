from django.contrib import admin

from .models import Category, Product, Message, Appointment

admin.site.register(Category)
admin.site.register(Product)
admin.site.register(Message)
admin.site.register(Appointment)
