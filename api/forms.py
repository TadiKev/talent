# api/forms.py
from django import forms
from .models import Company, Employee
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser
from .utils import encrypt, decrypt

class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = CustomUser
        fields = ['username', 'email']

    def save(self, commit=True):
        user = super().save(commit=False)
        if commit:
            user.save()
        return user

class CustomUserUpdateForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = ['username', 'email']

    def save(self, commit=True):
        user = super().save(commit=False)
        if commit:
            user.save()
        return user

class CompanyUpdateForm(forms.ModelForm):
    class Meta:
        model = Company
        fields = ['name', 'registration_date', 'registration_number', 'address', 'contact_person', 'contact_phone', 'email']

    def save(self, commit=True):
        company = super().save(commit=False)
        company.address = encrypt(self.cleaned_data['address'])
        company.contact_person = encrypt(self.cleaned_data['contact_person'])
        company.contact_phone = encrypt(self.cleaned_data['contact_phone'])
        company.email = encrypt(self.cleaned_data['email'])
        if commit:
            company.save()
        return company

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance.pk:
            self.fields['address'].initial = decrypt(self.instance.address)
            self.fields['contact_person'].initial = decrypt(self.instance.contact_person)
            self.fields['contact_phone'].initial = decrypt(self.instance.contact_phone)
            self.fields['email'].initial = decrypt(self.instance.email)

class EmployeeUpdateForm(forms.ModelForm):
    class Meta:
        model = Employee
        fields = ['name', 'employee_id', 'department', 'role', 'start_date', 'end_date', 'duties']

    def save(self, commit=True):
        employee = super().save(commit=False)
        employee.duties = encrypt(self.cleaned_data['duties'])
        if commit:
            employee.save()
        return employee

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance.pk:
            self.fields['duties'].initial = decrypt(self.instance.duties)
