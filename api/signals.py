from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Employee, EmployeeHistory

@receiver(post_save, sender=Employee)
def create_employee_history(sender, instance, created, **kwargs):
    if created:
        EmployeeHistory.objects.create(
            employee=instance,
            start_date=instance.start_date,
            end_date=instance.end_date,
            role=instance.role,
            duties=instance.duties
        )
    else:
        EmployeeHistory.objects.create(
            employee=instance,
            start_date=instance.start_date,
            end_date=instance.end_date,
            role=instance.role,
            duties=instance.duties
        )
