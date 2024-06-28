from django.contrib import admin
from .models import Company, Department, Employee, EmployeeHistory
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

# Register your models here.

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'registration_date', 'registration_number', 'contact_person', 'email')
    list_filter = ('registration_date',)
    search_fields = ('name', 'contact_person', 'email')

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'company')
    list_filter = ('company',)
    search_fields = ('name', 'company__name')

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('name', 'employee_id', 'department', 'role', 'start_date', 'end_date')
    list_filter = ('department', 'role', 'start_date', 'end_date')
    search_fields = ('name', 'employee_id', 'department__name')

@admin.register(EmployeeHistory)
class EmployeeHistoryAdmin(admin.ModelAdmin):
    list_display = ('employee', 'start_date', 'end_date', 'role')
    list_filter = ('employee__name', 'role', 'start_date', 'end_date')
    search_fields = ('employee__name', 'role')



class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('is_talent_admin', 'is_company_user')}),
    )

admin.site.register(CustomUser, CustomUserAdmin)
