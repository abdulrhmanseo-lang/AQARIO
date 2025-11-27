from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import HttpResponse
from django.core.files.base import ContentFile
from .models import Invoice
from .serializers import InvoiceSerializer
from .pdf_generator import generate_invoice_pdf
from core.notifications import send_invoice_email, send_invoice_whatsapp
import os


class InvoiceViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceSerializer
    
    def get_queryset(self):
        return Invoice.objects.filter(tenant=self.request.tenant)
    
    def perform_create(self, serializer):
        # Save invoice
        invoice = serializer.save()
        
        # Generate PDF
        try:
            pdf_data = generate_invoice_pdf(invoice)
            pdf_filename = f'invoice_{invoice.invoice_number}.pdf'
            invoice.pdf_file.save(pdf_filename, ContentFile(pdf_data), save=True)
        except Exception as e:
            print(f"Error generating PDF: {e}")
        
        # Send notifications
        try:
            send_invoice_email(invoice)
            send_invoice_whatsapp(invoice)
        except Exception as e:
            print(f"Error sending notifications: {e}")
    
    @action(detail=True, methods=['get'])
    def download_pdf(self, request, pk=None):
        """
        Download invoice PDF
        """
        invoice = self.get_object()
        
        if not invoice.pdf_file:
            # Generate PDF if it doesn't exist
            try:
                pdf_data = generate_invoice_pdf(invoice)
                pdf_filename = f'invoice_{invoice.invoice_number}.pdf'
                invoice.pdf_file.save(pdf_filename, ContentFile(pdf_data), save=True)
            except Exception as e:
                return Response(
                    {'error': 'Failed to generate PDF'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        # Return PDF file
        try:
            response = HttpResponse(invoice.pdf_file.read(), content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="invoice_{invoice.invoice_number}.pdf"'
            return response
        except Exception as e:
            return Response(
                {'error': 'Failed to download PDF'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
