from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Sum, Q
from django.utils import timezone
from properties.models import Property
from contracts.models import Contract
from finance.models import Invoice
from clients.models import Client


class DashboardViewSet(viewsets.ViewSet):
    """
    Dashboard analytics endpoint
    """
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        tenant = request.tenant
        
        # Get counts
        properties_count = Property.objects.filter(tenant=tenant).count()
        clients_count = Client.objects.filter(tenant=tenant).count()
        active_contracts = Contract.objects.filter(
            tenant=tenant, 
            status='ACTIVE'
        ).count()
        
        # Get financial stats
        total_revenue = Invoice.objects.filter(
            tenant=tenant,
            status='PAID'
        ).aggregate(total=Sum('total_amount'))['total'] or 0
        
        pending_amount = Invoice.objects.filter(
            tenant=tenant,
            status='PENDING'
        ).aggregate(total=Sum('total_amount'))['total'] or 0
        
        overdue_amount = Invoice.objects.filter(
            tenant=tenant,
            status='OVERDUE'
        ).aggregate(total=Sum('total_amount'))['total'] or 0
        
        # Revenue by month (last 6 months)
        from datetime import datetime, timedelta
        six_months_ago = timezone.now() - timedelta(days=180)
        
        monthly_revenue = Invoice.objects.filter(
            tenant=tenant,
            status='PAID',
            paid_date__gte=six_months_ago
        ).extra(
            select={'month': 'strftime("%%Y-%%m", paid_date)'}
        ).values('month').annotate(
            revenue=Sum('total_amount')
        ).order_by('month')
        
        # Property distribution by type
        property_distribution = Property.objects.filter(
            tenant=tenant
        ).values('property_type').annotate(
            count=Count('id')
        )
        
        return Response({
            'counts': {
                'properties': properties_count,
                'clients': clients_count,
                'active_contracts': active_contracts,
            },
            'financial': {
                'total_revenue': float(total_revenue),
                'pending_amount': float(pending_amount),
                'overdue_amount': float(overdue_amount),
            },
            'charts': {
                'monthly_revenue': list(monthly_revenue),
                'property_distribution': list(property_distribution),
            }
        })
