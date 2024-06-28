from rest_framework import serializers
from .models import Company, Department, Employee, EmployeeHistory

class CompanySerializer(serializers.ModelSerializer):
    address = serializers.SerializerMethodField()
    contact_person = serializers.SerializerMethodField()
    contact_phone = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = ['id', 'name', 'registration_date', 'registration_number', 'address', 'contact_person', 'contact_phone', 'email']

    def get_address(self, obj):
        return obj.get_address()

    def get_contact_person(self, obj):
        return obj.get_contact_person()

    def get_contact_phone(self, obj):
        return obj.get_contact_phone()

    def get_email(self, obj):
        return obj.get_email()

class DepartmentSerializer(serializers.ModelSerializer):
    company = CompanySerializer()

    class Meta:
        model = Department
        fields = ['id', 'name', 'company']

class EmployeeSerializer(serializers.ModelSerializer):
    duties = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = ['id', 'name', 'employee_id', 'department', 'role', 'start_date', 'end_date', 'duties']

    def get_duties(self, obj):
        return obj.get_duties()

class EmployeeHistorySerializer(serializers.ModelSerializer):
    duties = serializers.SerializerMethodField()

    class Meta:
        model = EmployeeHistory
        fields = ['id', 'employee', 'start_date', 'end_date', 'role', 'duties']

    def get_duties(self, obj):
        return obj.get_duties()

# api/serializers.py

from rest_framework import serializers
from .models import Employee

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'
