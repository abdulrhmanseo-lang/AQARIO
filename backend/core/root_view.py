from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        "status": "running",
        "message": "Real Estate SaaS API is operational.",
        "documentation": "/swagger/"
    })
