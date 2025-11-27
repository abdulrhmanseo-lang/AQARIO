from django.db import models
from core.models import Tenant

class Property(models.Model):
    PROPERTY_TYPES = [
        ('APARTMENT', 'Apartment'),
        ('VILLA', 'Villa'),
        ('OFFICE', 'Office'),
        ('SHOP', 'Shop'),
        ('LAND', 'Land'),
    ]

    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='properties')
    title = models.CharField(max_length=255)
    property_type = models.CharField(max_length=20, choices=PROPERTY_TYPES)
    area = models.DecimalField(max_digits=10, decimal_places=2, help_text="Area in sq meters")
    location = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='property_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
