from django.db import models
from core.models import Tenant, User
from properties.models import Property

class Contract(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='contracts')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='contracts')
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='contracts', limit_choices_to={'role': User.Role.CLIENT})
    start_date = models.DateField()
    end_date = models.DateField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    pdf_file = models.FileField(upload_to='contracts_pdfs/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Contract: {self.property.title} - {self.client.username}"
