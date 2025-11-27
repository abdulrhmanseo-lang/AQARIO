from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Client
from .serializers import ClientSerializer


class ClientViewSet(viewsets.ModelViewSet):
    serializer_class = ClientSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'phone', 'email', 'national_id']
    filterset_fields = ['created_at']
    ordering_fields = ['created_at', 'name']

    def get_queryset(self):
        return Client.objects.filter(tenant=self.request.tenant)
