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
    city = models.CharField(max_length=100)
    address = models.CharField(max_length=500)
    area = models.DecimalField(max_digits=10, decimal_places=2, help_text="Area in sq meters")
    price = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField(blank=True)
    main_image = models.ImageField(upload_to='properties/main/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='properties/gallery/')
    caption = models.CharField(max_length=255, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['uploaded_at']

    def __str__(self):
        return f"{self.property.title} - Image {self.id}"
