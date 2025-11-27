import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def reset_admin():
    try:
        user, created = User.objects.get_or_create(username='admin')
        user.set_password('password')
        user.is_superuser = True
        user.is_staff = True
        user.role = 'SUPERADMIN'
        user.save()
        print("Superuser 'admin' password set to 'password'")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    reset_admin()
