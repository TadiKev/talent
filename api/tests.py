from django.test import TestCase
from .models import Company, Employee
from .forms import CompanyUpdateForm, EmployeeUpdateForm
from .utils import decrypt

class EncryptionTestCase(TestCase):

    def test_company_encryption(self):
        # Create a company via the form
        form_data = {
            'name': 'Test Company',
            'registration_date': '2024-01-01',
            'registration_number': '123456789',
            'address': '123 Test St',
            'contact_person': 'John Doe',
            'number_of_employees': 10,
            'contact_phone': '1234567890',
            'email': 'test@example.com',
        }
        form = CompanyUpdateForm(data=form_data)
        self.assertTrue(form.is_valid())
        company = form.save()

        # Check that the fields are encrypted in the database
        company = Company.objects.get(id=company.id)
        self.assertNotEqual(company.address, form_data['address'])
        self.assertNotEqual(company.contact_person, form_data['contact_person'])
        self.assertNotEqual(company.contact_phone, form_data['contact_phone'])
        self.assertNotEqual(company.email, form_data['email'])

        # Check that the fields are decrypted when loading the form
        form = CompanyUpdateForm(instance=company)
        self.assertEqual(form.initial['address'], form_data['address'])
        self.assertEqual(form.initial['contact_person'], form_data['contact_person'])
        self.assertEqual(form.initial['contact_phone'], form_data['contact_phone'])
        self.assertEqual(form.initial['email'], form_data['email'])

    def test_employee_encryption(self):
        # Create a company for the employee to reference
        company = Company.objects.create(
            name='Test Company',
            registration_date='2024-01-01',
            registration_number='123456789',
            address='123 Test St',
            contact_person='John Doe',
            contact_phone='1234567890',
            email='test@example.com'
        )
        department = company.departments.create(name='Test Department')

        # Create an employee via the form
        form_data = {
            'name': 'Test Employee',
            'employee_id': 'E123',
            'department': department.id,
            'role': 'Developer',
            'start_date': '2024-01-01',
            'end_date': '2024-12-31',
            'duties': 'Develop software',
        }
        form = EmployeeUpdateForm(data=form_data)
        self.assertTrue(form.is_valid())
        employee = form.save()

        # Check that the fields are encrypted in the database
        employee = Employee.objects.get(id=employee.id)
        self.assertNotEqual(employee.duties, form_data['duties'])

        # Check that the fields are decrypted when loading the form
        form = EmployeeUpdateForm(instance=employee)
        self.assertEqual(form.initial['duties'], form_data['duties'])
