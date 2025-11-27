from rest_framework import viewsets
from .models import Contract
from .serializers import ContractSerializer
from core.notifications import send_contract_email, send_contract_whatsapp


class ContractViewSet(viewsets.ModelViewSet):
    serializer_class = ContractSerializer
    
    def get_queryset(self):
        return Contract.objects.filter(tenant=self.request.tenant)
    
    def perform_create(self, serializer):
        # Save contract
        contract = serializer.save()
        
        # Send notifications
        try:
            send_contract_email(contract)
            send_contract_whatsapp(contract)
        except Exception as e:
            print(f"Error sending notifications: {e}")
