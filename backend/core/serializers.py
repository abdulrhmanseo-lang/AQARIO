from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Tenant

User = get_user_model()

class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    tenant = TenantSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'tenant', 'first_name', 'last_name']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    tenant_name = serializers.CharField(write_only=True, required=False)
    subdomain = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'tenant_name', 'subdomain']

    def create(self, validated_data):
        tenant_name = validated_data.pop('tenant_name', None)
        subdomain = validated_data.pop('subdomain', None)
        password = validated_data.pop('password')

        user = User(**validated_data)
        user.set_password(password)
        
        # If registering a new company owner
        if tenant_name and subdomain:
            tenant = Tenant.objects.create(name=tenant_name, subdomain=subdomain)
            user.tenant = tenant
            user.role = User.Role.OWNER
        
        user.save()
        return user
