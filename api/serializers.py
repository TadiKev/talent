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
        return obj.address

    def get_contact_person(self, obj):
        return obj.contact_person

    def get_contact_phone(self, obj):
        return obj.contact_phone

    def get_email(self, obj):
        return obj.email

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
        return obj.duties

class EmployeeHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeHistory
        fields = '__all__'
