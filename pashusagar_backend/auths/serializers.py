from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken

# User Registration Serializer
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ('email', 'username', 'password', 'password2', 'role', 'profile_image', 'phone_number')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords must match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        # Default role is 1 (non-veterinarian). If a role is provided, use that one
        role = validated_data.get('role', 1)  # Default role is 1 (non-veterinarian)
        
        user = CustomUser.objects.create(
            email=validated_data['email'],
            username=validated_data['username'],
            role=role,
            phone_number=validated_data['phone_number'],
        )
        user.set_password(validated_data['password'])
        user.profile_image = validated_data.get('profile_image')
        user.save()
        return user

# Veterinarian Registration Serializer
class VeterinarianRegistrationSerializer(UserRegistrationSerializer):
    specialization = serializers.CharField(required=True, allow_blank=False)
    clinic_name = serializers.CharField(required=True, allow_blank=False)

    class Meta(UserRegistrationSerializer.Meta):
        fields = UserRegistrationSerializer.Meta.fields + ('specialization', 'clinic_name')

    def create(self, validated_data):
        specialization = validated_data.pop('specialization')
        clinic_name = validated_data.pop('clinic_name')

        # Set the role to veterinarian (2)
        validated_data['role'] = 2  # Veterinarian role

        user = super().create(validated_data)

        user.specialization = specialization
        user.clinic_name = clinic_name
        user.save()
        
        return user

# Profile Serializer (for updating user details)
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('email', 'username', 'role', 'profile_image', 'phone_number', 'specialization', 'clinic_name')
        read_only_fields = ('role',)

    def validate_email(self, value):
        user = self.context['request'].user
        if CustomUser.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

# Change Password Serializer
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, validators=[validate_password])

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password does not match.")
        return value

# Forgot Password Serializer
class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email does not exist.")
        return value

# Reset Password Serializer
class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
    new_password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    new_password2 = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({"new_password": "Passwords do not match."})
        return attrs

    def validate_email(self, value):
        if not CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email does not exist.")
        return value

# User List Serializer (for displaying list of users)
class UserListSerializer(serializers.ModelSerializer):
    role_display = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = (
            'id',
            'username',
            'email',
            'role',
            'role_display',
            'profile_image',
            'phone_number',
        )
        read_only_fields = ('id', 'username', 'email', 'role', 'profile_image', 'phone_number')

    def get_role_display(self, obj):
        return obj.get_role_display()

