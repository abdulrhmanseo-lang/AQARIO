from django.core.mail import send_mail
from django.conf import settings
from twilio.rest import Client
import os


def send_invoice_email(invoice):
    """
    Send email notification when invoice is created
    """
    if not invoice.contract or not invoice.contract.client:
        return
    
    client = invoice.contract.client
    if not client.email:
        return
    
    subject = f'فاتورة جديدة #{invoice.invoice_number} - عقاريو'
    
    message = f"""
    السلام عليكم {client.name},
    
    تم إصدار فاتورة جديدة لك عبر نظام عقاريو.
    
    تفاصيل الفاتورة:
    - رقم الفاتورة: #{invoice.invoice_number}
    - المبلغ الأساسي: {invoice.amount} ريال
    - الضريبة: {invoice.tax_amount} ريال
    - الإجمالي: {invoice.total_amount} ريال
    - تاريخ الاستحقاق: {invoice.due_date}
    
    يمكنك تحميل الفاتورة من خلال لوحة التحكم.
    
    شكراً لتعاملكم معنا،
    فريق عقاريو
    """
    
    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [client.email],
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False


def send_contract_email(contract):
    """
    Send email notification when contract is created
    """
    if not contract.client:
        return
    
    client = contract.client
    if not client.email:
        return
    
    subject = f'عقد جديد - عقاريو'
    
    message = f"""
    السلام عليكم {client.name},
    
    تم إنشاء عقد جديد لك عبر نظام عقاريو.
    
    تفاصيل العقد:
    - العقار: {contract.property.title if contract.property else '-'}
    - تاريخ البداية: {contract.start_date}
    - تاريخ الانتهاء: {contract.end_date}
    - القيمة الشهرية: {contract.monthly_amount} ريال
    - القيمة الإجمالية: {contract.total_amount} ريال
    
    يمكنك تحميل العقد من خلال لوحة التحكم.
    
    شكراً لتعاملكم معنا،
    فريق عقاريو
    """
    
    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [client.email],
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False


def send_whatsapp_notification(phone_number, message_type, details):
    """
    Send WhatsApp notification using Twilio
    Note: Requires Twilio account and WhatsApp Business API setup
    """
    # Twilio credentials (should be in settings/environment variables)
    account_sid = getattr(settings, 'TWILIO_ACCOUNT_SID', None)
    auth_token = getattr(settings, 'TWILIO_AUTH_TOKEN', None)
    whatsapp_from = getattr(settings, 'TWILIO_WHATSAPP_FROM', None)
    
    if not all([account_sid, auth_token, whatsapp_from]):
        print("WhatsApp notification skipped: Twilio credentials not configured")
        return False
    
    try:
        client = Client(account_sid, auth_token)
        
        if message_type == 'invoice':
            message_body = f"""
📄 *تم إصدار فاتورة جديدة عبر عقاريو*

المبلغ: {details.get('amount', 0)} ريال
رقم الفاتورة: #{details.get('invoice_number', '-')}

نرجو المتابعة والسداد في الموعد المحدد.

شكراً لتعاملكم معنا 🙏
            """
        elif message_type == 'contract':
            message_body = f"""
📋 *تم إنشاء عقد جديد عبر عقاريو*

العقار: {details.get('property', '-')}
القيمة: {details.get('amount', 0)} ريال

يمكنك مراجعة تفاصيل العقد من خلال لوحة التحكم.

شكراً لتعاملكم معنا 🙏
            """
        else:
            message_body = "إشعار جديد من عقاريو"
        
        # Format phone number for WhatsApp (must include country code)
        if not phone_number.startswith('whatsapp:'):
            phone_number = f'whatsapp:+966{phone_number.lstrip("0")}'
        
        message = client.messages.create(
            from_=whatsapp_from,
            body=message_body,
            to=phone_number
        )
        
        print(f"WhatsApp message sent: {message.sid}")
        return True
        
    except Exception as e:
        print(f"Error sending WhatsApp: {e}")
        return False


def send_invoice_whatsapp(invoice):
    """
    Send WhatsApp notification for new invoice
    """
    if not invoice.contract or not invoice.contract.client:
        return False
    
    client = invoice.contract.client
    if not client.phone:
        return False
    
    details = {
        'invoice_number': invoice.invoice_number,
        'amount': float(invoice.total_amount),
    }
    
    return send_whatsapp_notification(client.phone, 'invoice', details)


def send_contract_whatsapp(contract):
    """
    Send WhatsApp notification for new contract
    """
    if not contract.client:
        return False
    
    client = contract.client
    if not client.phone:
        return False
    
    details = {
        'property': contract.property.title if contract.property else '-',
        'amount': float(contract.total_amount),
    }
    
    return send_whatsapp_notification(client.phone, 'contract', details)
