from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers

from .models import Profile


User = get_user_model()
ORG_FIELDS = (
    "organization_name",
    "organization_website",
    "organization_type",
    "organization_description",
)


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)
    role = serializers.ChoiceField(choices=Profile.ROLE_CHOICES, required=False)

    def validate_email(self, value):
        email = value.strip().lower()
        if User.objects.filter(username=email).exists():
            raise serializers.ValidationError("Account already exists")
        return email

    def validate(self, attrs):
        if attrs.get("password") != attrs.get("confirm_password"):
            raise serializers.ValidationError({"confirm_password": "Passwords do not match"})
        return attrs

    def create(self, validated_data):
        email = validated_data["email"]
        password = validated_data["password"]
        role = validated_data.get("role", Profile.ROLE_ATHLETE)
        first_name = validated_data["first_name"].strip()
        last_name = validated_data["last_name"].strip()

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )
        user.profile.role = role
        user.profile.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=Profile.ROLE_CHOICES, required=False)

    def validate(self, attrs):
        email = (attrs.get("email") or "").strip().lower()
        password = attrs.get("password") or ""
        requested_role = attrs.get("role")

        user = authenticate(username=email, password=password)
        if not user:
            raise serializers.ValidationError("Invalid credentials")

        if requested_role and user.profile.role != requested_role:
            raise serializers.ValidationError({"role": "Role mismatch"})

        attrs["user"] = user
        attrs["email"] = email
        return attrs


class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)
    first_name = serializers.CharField(source="user.first_name", required=False, allow_blank=True)
    last_name = serializers.CharField(source="user.last_name", required=False, allow_blank=True)
    full_name = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Profile
        fields = [
            "email",
            "first_name",
            "last_name",
            "full_name",
            "role",
            "handle",
            "bio",
            "phone",
            "website",
            "address_line",
            "postal_code",
            "city",
            "country",
            "organization_name",
            "organization_website",
            "organization_type",
            "organization_description",
        ]
        read_only_fields = ["email", "role"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        first = instance.user.first_name or ""
        last = instance.user.last_name or ""
        full_name = f"{first} {last}".strip()
        data["full_name"] = full_name or instance.user.email
        return data

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", {})
        full_name = validated_data.pop("full_name", None)

        if full_name is not None:
            cleaned = full_name.strip()
            if cleaned:
                parts = cleaned.split()
                user_data["first_name"] = parts[0]
                user_data["last_name"] = " ".join(parts[1:]) if len(parts) > 1 else ""
            else:
                user_data["first_name"] = ""
                user_data["last_name"] = ""

        if instance.role != Profile.ROLE_ORGANIZER:
            for field in ORG_FIELDS:
                validated_data.pop(field, None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if user_data:
            for attr, value in user_data.items():
                setattr(instance.user, attr, value)
            instance.user.save()

        return instance
