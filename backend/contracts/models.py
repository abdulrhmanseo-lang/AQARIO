from django.db import models
from core.models import Tenant
from properties.models import Property
from clients.models import Client


class Contract(models.Model):
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('EXPIRED', 'Expired'),
        ('TERMINATED', 'Terminated'),
    ]

    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='contracts')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='contracts')
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='contracts')
    start_date = models.DateField()
    end_date = models.DateField()
    monthly_amount = models.DecimalField(max_digits=12, decimal_places=2)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    pdf_file = models.FileField(upload_to='contracts/', blank=True, null=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Contract: {self.property.title} - {self.client.name}"
