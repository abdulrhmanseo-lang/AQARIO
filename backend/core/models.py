from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class Tenant(models.Model):
    name = models.CharField(max_length=100)
    subdomain = models.SlugField(unique=True)
    logo = models.ImageField(upload_to='tenant_logos/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class User(AbstractUser):
    class Role(models.TextChoices):
        SUPERADMIN = 'SUPERADMIN', _('Super Admin')
        OWNER = 'OWNER', _('Company Owner')
        ADMIN = 'ADMIN', _('Admin')
        EMPLOYEE = 'EMPLOYEE', _('Employee')
        CLIENT = 'CLIENT', _('Client')

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CLIENT)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='users', null=True, blank=True)

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
