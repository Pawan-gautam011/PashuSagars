# views.py
import random
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.core.mail import send_mail
from django.contrib.auth import authenticate, update_session_auth_hash
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser, PasswordResetOTP
from .serializers import (
    UserListSerializer,
    UserRegistrationSerializer,
    VeterinarianRegistrationSerializer,
    ProfileSerializer,
    ChangePasswordSerializer,
    ForgotPasswordSerializer,
    ResetPasswordSerializer,
)

# Registration and Login Endpoints
class UserRegistrationView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserRegistrationSerializer

class VeterinarianRegistrationView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = VeterinarianRegistrationSerializer

# class LoginAPIView(APIView):
#     permission_classes = [permissions.AllowAny]

#     def post(self, request):
#         email = request.data.get('email')
#         password = request.data.get('password')

#         if not email or not password:
#             return Response({'error': 'Please provide both email and password.'}, status=status.HTTP_400_BAD_REQUEST)

#         user = authenticate(request, username=email, password=password)

#         if not user:
#             return Response({'error': 'Invalid email or password.'}, status=status.HTTP_401_UNAUTHORIZED)

#         if not user.is_active:
#             return Response({'error': 'Account is disabled.'}, status=status.HTTP_401_UNAUTHORIZED)

#         refresh = RefreshToken.for_user(user)
#         access_token = refresh.access_token

#         return Response({
#             'refresh': str(refresh),
#             'access': str(access_token),
#             'role': user.role,
#             'user_id': user.id,
#             'phone': user.phone_number,
#             'email': user.email,
#             'username': user.username
#         }, status=status.HTTP_200_OK)

class LoginAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({'error': 'Please provide both email and password.'}, 
                          status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=email, password=password)

        if not user:
            return Response({'error': 'Invalid email or password.'}, 
                          status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_active:
            return Response({'error': 'Account is disabled.'}, 
                          status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user_id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'phone_number': user.phone_number,
        }, status=status.HTTP_200_OK)

# Profile, Change Password, and Logout
class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            update_session_auth_hash(request, user)
            return Response({"detail": "Password updated successfully."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'detail': 'Logout successful'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Forgot and Reset Password Endpoints
class ForgotPasswordOTPView(generics.GenericAPIView):
    serializer_class = ForgotPasswordSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        PasswordResetOTP.objects.filter(email=email, is_used=False).update(is_used=True)

        otp = str(random.randint(100000, 999999))
        PasswordResetOTP.objects.create(email=email, otp=otp)

        subject = "Your Password Reset OTP"
        message = f"Your OTP for password reset is {otp}. It is valid for 10 minutes."
        from_email = "pashusagar@gmail.com"
        recipient_list = [email]
        send_mail(subject, message, from_email, recipient_list)

        return Response({"detail": "OTP sent to your email."}, status=status.HTTP_200_OK)

class ResetPasswordOTPView(generics.GenericAPIView):
    serializer_class = ResetPasswordSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        otp = serializer.validated_data['otp']
        new_password = serializer.validated_data['new_password']

        otp_record = (
            PasswordResetOTP.objects.filter(email=email, otp=otp, is_used=False)
            .order_by('-created_at')
            .first()
        )
        if not otp_record:
            return Response({"detail": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)

        if otp_record.is_expired():
            otp_record.is_used = True
            otp_record.save()
            return Response({"detail": "OTP has expired. Please request a new one."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        user.set_password(new_password)
        user.save()

        otp_record.is_used = True
        otp_record.save()

        return Response({"detail": "Password reset successfully."}, status=status.HTTP_200_OK)

class UserListView(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserListSerializer
    permission_classes = [permissions.IsAuthenticated]
    
# New: Deactivate Account Endpoint
class DeactivateAccountView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        user.is_active = False
        user.save()
        return Response({"detail": "Account deactivated successfully."}, status=status.HTTP_200_OK)
