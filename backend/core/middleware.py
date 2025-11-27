from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse
from .models import Tenant

class TenantMiddleware(MiddlewareMixin):
    def process_request(self, request):
        tenant_id = request.headers.get('X-Tenant-ID')
        
        if tenant_id:
            try:
                request.tenant = Tenant.objects.get(id=tenant_id)
            except Tenant.DoesNotExist:
                return JsonResponse({'error': 'Invalid Tenant ID'}, status=400)
        else:
            request.tenant = None
