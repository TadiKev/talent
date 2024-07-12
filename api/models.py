from django.contrib.auth.models import AbstractUser
from django.db import models
from .utils import encrypt, decrypt
from django.contrib.auth.models import AbstractUser, Group, Permission

class Company(models.Model):
    name = models.CharField(max_length=255)
    registration_date = models.DateField()
    registration_number = models.CharField(max_length=100)
    address = models.TextField()
    contact_person = models.CharField(max_length=255)
    contact_phone = models.CharField(max_length=20)
    email = models.EmailField()
    encrypted_address = models.TextField(null=True, blank=True)
    encrypted_contact_person = models.TextField(null=True, blank=True)
    encrypted_contact_phone = models.TextField(null=True, blank=True)
    encrypted_email = models.TextField(null=True, blank=True)

    def save(self, *args, **kwargs):
        # Encrypt sensitive data before saving
        self.encrypted_address = encrypt(self.address)
        self.encrypted_contact_person = encrypt(self.contact_person)
        self.encrypted_contact_phone = encrypt(self.contact_phone)
        self.encrypted_email = encrypt(self.email)
        super().save(*args, **kwargs)

    def get_address(self):
        return decrypt(self.encrypted_address)

    def get_contact_person(self):
        return decrypt(self.encrypted_contact_person)

    def get_contact_phone(self):
        return decrypt(self.encrypted_contact_phone)

    def get_email(self):
        return decrypt(self.encrypted_email)

    def __str__(self):
        return self.name

class Department(models.Model):
    name = models.CharField(max_length=255)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='departments')

    def __str__(self):
        return f"{self.company.name} - {self.name}"

class Employee(models.Model):
    name = models.CharField(max_length=255)
    employee_id = models.CharField(max_length=50, null=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='employees')
    role = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    duties = models.TextField()
    encrypted_duties = models.TextField(null=True, blank=True)

    def save(self, *args, **kwargs):
        # Encrypt sensitive data before saving
        self.encrypted_duties = encrypt(self.duties)
        super().save(*args, **kwargs)

        EmployeeHistory.objects.create(
            employee=self,
            start_date=self.start_date,
            end_date=self.end_date,
            role=self.role,
            duties=self.duties
        )

    def get_duties(self):
        return decrypt(self.encrypted_duties)

    def __str__(self):
        return f"{self.name} - {self.department.company.name}"
    


class EmployeeHistory(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='history')
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    role = models.CharField(max_length=255)
    duties = models.TextField()
    encrypted_duties = models.TextField(null=True, blank=True)

    def save(self, *args, **kwargs):
        # Encrypt sensitive data before saving
        self.encrypted_duties = encrypt(self.duties)
        super().save(*args, **kwargs)

    def get_duties(self):
        return decrypt(self.encrypted_duties)

    def __str__(self):
        return f"{self.employee.name} - {self.start_date} to {self.end_date}"

from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class CustomUser(AbstractUser):
    is_talent_admin = models.BooleanField(default=False)
    is_company_user = models.BooleanField(default=False)

    class Meta:
        db_table = 'custom_user'
    
    groups = models.ManyToManyField(Group, related_name='custom_users', blank=True)  # Adjusted related_name
    # Adjust related_name to avoid clashes with auth.User
    groups = models.ManyToManyField(Group, related_name='custom_users')
    user_permissions = models.ManyToManyField(Permission, related_name='custom_user_permissions')

    def __str__(self):
        return self.username
