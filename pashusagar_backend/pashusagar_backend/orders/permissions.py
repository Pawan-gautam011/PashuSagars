# orders/permissions.py
from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 0

class IsAdminOrOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Admins can access any object
        if request.user.is_authenticated and request.user.role == 0:
            return True
        # Users can only access their own orders
        return obj.user == request.user
