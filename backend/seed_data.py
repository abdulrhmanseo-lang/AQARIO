import os
import django
import random
from datetime import date, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.models import Tenant, User
from properties.models import Property
from contracts.models import Contract
from finance.models import Invoice

def seed():
    print("Seeding data...")

    # Create Tenants
    tenant1, _ = Tenant.objects.get_or_create(name="Alpha Real Estate", subdomain="alpha")
    tenant2, _ = Tenant.objects.get_or_create(name="Beta Properties", subdomain="beta")

    # Create Users
    # SuperAdmin
    if not User.objects.filter(username="admin").exists():
        User.objects.create_superuser("admin", "admin@example.com", "password")
    
    # Tenant 1 Users
    owner1, _ = User.objects.get_or_create(username="alpha_owner", email="owner@alpha.com", role=User.Role.OWNER, tenant=tenant1)
    owner1.set_password("password")
    owner1.save()

    client1, _ = User.objects.get_or_create(username="alpha_client", email="client@alpha.com", role=User.Role.CLIENT, tenant=tenant1)
    client1.set_password("password")
    client1.save()

    # Tenant 2 Users
    owner2, _ = User.objects.get_or_create(username="beta_owner", email="owner@beta.com", role=User.Role.OWNER, tenant=tenant2)
    owner2.set_password("password")
    owner2.save()

    # Create Properties for Tenant 1
    for i in range(5):
        prop = Property.objects.create(
            tenant=tenant1,
            title=f"Alpha Property {i+1}",
            property_type=random.choice(['APARTMENT', 'VILLA', 'OFFICE']),
            area=random.randint(50, 500),
            location=f"Location {i+1}",
            price=random.randint(1000, 10000),
            description="Beautiful property"
        )
        
        # Create Contract
        if i < 2:
            contract = Contract.objects.create(
                tenant=tenant1,
                property=prop,
                client=client1,
                start_date=date.today(),
                end_date=date.today() + timedelta(days=365),
                amount=prop.price
            )
            
            # Create Invoice
            Invoice.objects.create(
                tenant=tenant1,
                contract=contract,
                amount=contract.amount,
                due_date=date.today() + timedelta(days=30),
                status='PENDING'
            )

    print("Seeding complete!")

if __name__ == '__main__':
    seed()
