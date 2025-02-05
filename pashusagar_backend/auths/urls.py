from django.urls import path
from .views import (
    EditProfileView,
    RegisterView,
    LoginAPIView,
    ProfileView,
    ChangePasswordView
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', LoginAPIView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='auth_profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('edit-profile/', EditProfileView.as_view(), name='edit_profile'),
]
