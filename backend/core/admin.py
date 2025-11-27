from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Tenant

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'tenant', 'is_staff')
    list_filter = ('role', 'tenant')
    fieldsets = UserAdmin.fieldsets + (
        ('SaaS Info', {'fields': ('role', 'tenant')}),
    )

@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    list_display = ('name', 'subdomain', 'created_at')
