from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminUserOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

class IsAuthenticated(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.created_by == request.user

class IsAdminOrOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.created_by == request.user or request.user.is_staff

class IsAuthenticatedAndSender(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.sender == request.user

class IsVeterinarianOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 2 or request.user.is_staff