from djoser.serializers import UserCreateSerializer, ActivationSerializer, UserSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.contrib.auth import authenticate


User = get_user_model()

from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from stock.models import Sale, Purchase, Product, Firm, Brand
def add_permissions_to_tester_group():
    tester_group, created = Group.objects.get_or_create(name='Tester')

    models = [Sale, Purchase, Product, Firm, Brand]
    for model in models:
        content_type = ContentType.objects.get_for_model(model)
        permissions = Permission.objects.filter(
            content_type=content_type,
            codename__in=[f'add_{model.__name__.lower()}', f'change_{model.__name__.lower()}', f'delete_{model.__name__.lower()}', f'view_{model.__name__.lower()}']
        )

        for permission in permissions:
            tester_group.permissions.add(permission)

class CustomUserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "image",
            "about",
            "password",
        )
        read_only_fields = ('id', 'is_staff','is_superuser',)

class CustomActivationSerializer(ActivationSerializer):
    def validate(self, attrs):
        attrs = super(CustomActivationSerializer, self).validate(attrs)
        add_permissions_to_tester_group()

        tester_group = Group.objects.get(name='Tester')

        self.user.groups.add(tester_group)
        return attrs

class CustomUserUpdateSerializer(UserSerializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    re_new_password = serializers.CharField(write_only=True)
    re_email = serializers.EmailField(write_only=True)

    class Meta(UserSerializer.Meta):
        model = User
        fields = ('id', 'email', 'first_name', 'last_name' 'image', 'about', 'current_password', 'new_password', 're_new_password', 're_email')
        read_only_fields = ('id', 'is_staff','is_superuser',)
    
    def validate(self, data):
        if data.get('new_password') != data.get('re_new_password'):
            raise serializers.ValidationError("New passwords must match.")
        if data.get('email') != data.get('re_email'):
            raise serializers.ValidationError("Emails must match.")
        
        if not authenticate(email=self.instance.email, password=data.get('current_password')):
            raise serializers.ValidationError("Current password is not correct.")
        
        return data

    def update(self, instance, validated_data):
        re_new_password = validated_data.pop('re_new_password', None)
        re_email = validated_data.pop('re_email', None)
        new_password = validated_data.pop('new_password', None)
        current_password = validated_data.pop('current_password', None)
        user = super().update(instance, validated_data)

        if new_password:
            user.set_password(new_password)
            user.save()

        return user
    
class CustomUserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'is_staff', 'image', 'about')
        read_only_fields = ('id', 'is_staff','is_superuser',)

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        data['first_name'] = self.user.first_name
        data['last_name'] = self.user.last_name
        data['is_staff'] = self.user.is_staff
        data['image'] = self.user.image
        data['about'] = self.user.about

        return data

