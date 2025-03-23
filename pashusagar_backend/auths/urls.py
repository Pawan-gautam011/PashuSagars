from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    UserRegistrationView,
    VeterinarianRegistrationView,
    LoginAPIView,
    ProfileView,
    ChangePasswordView,
    LogoutView,
    ForgotPasswordOTPView,
    ResetPasswordOTPView,
    DeactivateAccountView,
    UserListView,
)

urlpatterns = [
    path('register/user/', UserRegistrationView.as_view(), name='register_user'),
    path('register/veterinarian/', VeterinarianRegistrationView.as_view(), name='register_veterinarian'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('password-reset/forgot/', ForgotPasswordOTPView.as_view(), name='forgot_password_otp'),
    path('password-reset/confirm/', ResetPasswordOTPView.as_view(), name='reset_password_otp'),
    path('deactivate-account/', DeactivateAccountView.as_view(), name='deactivate_account'),
    path('users/', UserListView.as_view(), name='user_list'),
]