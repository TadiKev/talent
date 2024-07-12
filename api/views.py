from rest_framework import status, generics, viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from django.http import JsonResponse, Http404
from django.middleware.csrf import get_token
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views.generic.base import View
from django.contrib.auth import get_user_model, authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth import logout
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from rest_framework import status
from .permissions import IsTalentAdmin, IsCompanyUser, IsCompanyUserOrReadOnly
from django.contrib.auth.decorators import login_required

from .models import Employee, Company, EmployeeHistory
from .serializers import EmployeeSerializer, EmployeeHistorySerializer

import csv
import pandas as pd
import json



class EmployeeCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsCompanyUser]
    def post(self, request, *args, **kwargs):
        serializer = EmployeeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def get_csrf_token(request):
    return JsonResponse({'csrfToken': get_token(request)})



class EmployeeSearchView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, IsCompanyUserOrReadOnly]
    serializer_class = EmployeeSerializer
  

    def get_queryset(self):
        queryset = Employee.objects.all()
        name = self.request.query_params.get('name')
        role = self.request.query_params.get('role')
        department = self.request.query_params.get('department')
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')

        if name:
            queryset = queryset.filter(name__icontains=name)
        if role:
            queryset = queryset.filter(role__icontains=role)
        if department:
            queryset = queryset.filter(department__name__icontains=department)
        if start_date:
            queryset = queryset.filter(start_date=start_date)
        if end_date:
            queryset = queryset.filter(end_date=end_date)

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


@csrf_exempt
@require_http_methods(["POST"])
@permission_classes([permissions.IsAuthenticated, IsCompanyUser])
def file_upload_view(request):
    try:
        uploaded_file = request.FILES['file']
        return JsonResponse({'message': 'File uploaded successfully!'})
    except KeyError:
        return JsonResponse({'error': 'No file was uploaded.'}, status=status.HTTP_400_BAD_REQUEST)


def create_employee_from_row(row):
    # Implement your logic to create Employee instance from a row of data
    # Example:
    employee = Employee(
        name=row['name'],
        employee_id=row['employee_id'],
        department=row['department'],
        role=row['role'],
        start_date=row['start_date'],
        end_date=row['end_date'],
        duties=row['duties'],
        company=row['company']
    )
    employee.save()
    return employee

@csrf_exempt
@require_http_methods(["POST"])
@permission_classes([permissions.IsAuthenticated, IsCompanyUser])
def bulk_company_upload(request):
    try:
        uploaded_file = request.FILES['file']

        if uploaded_file.name.endswith('.csv'):
            dataset = csv.DictReader(uploaded_file.read().decode('utf-8-sig').splitlines())
        elif uploaded_file.name.endswith('.xlsx'):
            dataset = pd.read_excel(uploaded_file).to_dict('records')
        else:
            return JsonResponse({'error': 'Unsupported file format'}, status=status.HTTP_400_BAD_REQUEST)

        employees_created = []
        errors = []

        for idx, row in enumerate(dataset, start=1):
            try:
                if not row.get('name'):
                    errors.append(f"Row {idx}: Employee 'name' field is required.")
                    continue

                employee = create_employee_from_row(row)
                employees_created.append(employee.id)
            except Exception as e:
                errors.append(f"Row {idx}: Error creating employee from row: {str(e)}")

        if errors:
            return JsonResponse({'error': '\n'.join(errors)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return JsonResponse({'message': 'Bulk employees created successfully', 'employees_created': employees_created}, status=status.HTTP_201_CREATED)

    except KeyError:
        return JsonResponse({'error': 'No file was uploaded.'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def bulk_company_upload(request):
    try:
        uploaded_file = request.FILES['file']

        if uploaded_file.name.endswith('.csv'):
            dataset = csv.DictReader(uploaded_file.read().decode('utf-8-sig').splitlines())
        elif uploaded_file.name.endswith('.xlsx'):
            dataset = pd.read_excel(uploaded_file).to_dict('records')
        else:
            return JsonResponse({'error': 'Unsupported file format'}, status=status.HTTP_400_BAD_REQUEST)

        employees_created = []
        errors = []

        for idx, row in enumerate(dataset, start=1):
            try:
                if not row.get('name'):
                    errors.append(f"Row {idx}: Employee 'name' field is required.")
                    continue

                employee = create_employee_from_row(row)
                employees_created.append(employee.id)
            except Exception as e:
                errors.append(f"Row {idx}: Error creating employee from row: {str(e)}")

        if errors:
            return JsonResponse({'error': '\n'.join(errors)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return JsonResponse({'message': 'Bulk employees created successfully', 'employees_created': employees_created}, status=status.HTTP_201_CREATED)

    except KeyError:
        return JsonResponse({'error': 'No file was uploaded.'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Company
import json

@csrf_exempt
@require_http_methods(["POST"])
def save_or_update_company(request):
    try:
        data = json.loads(request.body)
        registration_number = data.get('registration_number')

        if not registration_number:
            return HttpResponseBadRequest('Registration number is required')

        # Check if company with this registration number already exists
        try:
            existing_company = Company.objects.get(registration_number=registration_number)
            # If exists, update the existing company (assuming other fields can change)
            existing_company.name = data.get('name', existing_company.name)
            existing_company.registration_date = data.get('registration_date', existing_company.registration_date)
            existing_company.address = data.get('address', existing_company.address)
            existing_company.contact_person = data.get('contact_person', existing_company.contact_person)
            existing_company.contact_phone = data.get('contact_phone', existing_company.contact_phone)
            existing_company.email = data.get('email', existing_company.email)
            existing_company.save()
            return JsonResponse({'message': 'Company updated successfully'})
        except Company.DoesNotExist:
            # If not exists, create a new company
            new_company = Company(
                registration_number=registration_number,
                name=data.get('name', ''),
                registration_date=data.get('registration_date', None),
                address=data.get('address', ''),
                contact_person=data.get('contact_person', ''),
                contact_phone=data.get('contact_phone', ''),
                email=data.get('email', '')
            )
            new_company.save()
            return JsonResponse({'message': 'Company created successfully'})

    except Exception as e:
        return HttpResponseBadRequest(str(e))


@ensure_csrf_cookie
@require_http_methods(["GET"])
def get_company(request, registration_number):
    try:
        company = Company.objects.get(registration_number=registration_number)
        data = {
            'name': company.name,
            'registration_date': company.registration_date,
            'registration_number': company.registration_number,
            'address': company.address,
            'contact_person': company.contact_person,
            'contact_phone': company.contact_phone,
            'email': company.email,
        }
        return JsonResponse(data)
    except Company.DoesNotExist:
        return HttpResponseBadRequest('Company does not exist')
    except Exception as e:
        return HttpResponseBadRequest(str(e))

@csrf_exempt
@require_http_methods(["DELETE"])
def delete_company(request, registration_number):
    try:
        company = Company.objects.get(registration_number=registration_number)
        company.delete()
        return JsonResponse({'message': 'Company deleted successfully'})
    except Company.DoesNotExist:
        return HttpResponseBadRequest('Company does not exist')
    except Exception as e:
        return HttpResponseBadRequest(str(e))



# Get the custom User model
CustomUser = get_user_model()

# Sign up view
# Get the custom User model
CustomUser = get_user_model()

# Sign up view
@csrf_exempt
def signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')

            if not username or not email or not password:
                return JsonResponse({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)

            if CustomUser.objects.filter(username=username).exists() or CustomUser.objects.filter(email=email).exists():
                return JsonResponse({'error': 'Username or email already exists'}, status=status.HTTP_400_BAD_REQUEST)

            # Create a CustomUser instance
            user = CustomUser.objects.create_user(
                username=username,
                email=email,
                password=password,
            )

            # Assuming you have a URL named 'profile' where you want to redirect after signup
            return JsonResponse({'success': 'User registered successfully', 'redirect_url': '/profile'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    return JsonResponse({'error': 'Only POST requests are allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@csrf_exempt
def login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')

            if not username or not password:
                return JsonResponse({'error': 'Missing username or password'}, status=status.HTTP_400_BAD_REQUEST)

            user = authenticate(request, username=username, password=password)

            if user is not None:
                auth_login(request, user)
                role = 'talent_verify' if user.is_talent_admin else 'is_company_user'
                return JsonResponse({'message': 'Login successful', 'role': role})
            else:
                return JsonResponse({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    return JsonResponse({'error': 'Only POST requests are allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


# Logout view
from django.middleware.csrf import get_token
from django.http import JsonResponse
def get_csrf_token(request):
    token = get_token(request)
    return JsonResponse({'csrfToken': token})

@csrf_exempt
def logout_view(request):
    if request.method == 'POST':
        logout(request)
        return JsonResponse({'message': 'Logged out successfully'}, status=200)
    return JsonResponse({'error': 'Invalid request method'}, status=405)


def check_auth(request):
    if request.user.is_authenticated:
        role = 'talent_verify' if request.user.is_talent_admin else 'is_company_user'
        return JsonResponse({'authenticated': True, 'role': role})
    else:
        return JsonResponse({'authenticated': False})


# View to get CSRF token
def csrf_token(request):
    return JsonResponse({'csrfToken': get_token(request)})


# views.py



class EmployeeHistoryListAPIView(generics.ListAPIView):
    queryset = EmployeeHistory.objects.all()
    serializer_class = EmployeeHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        employee_id = self.kwargs['employee_id']
        return EmployeeHistory.objects.filter(employee_id=employee_id)




from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import Employee
from api.serializers import EmployeeSerializer

class EmployeeDetail(APIView):
    def get(self, request, employee_id):
        try:
            employee = Employee.objects.get(employee_id=employee_id)
            serializer = EmployeeSerializer(employee)
            return Response(serializer.data)
        except Employee.DoesNotExist:
            return Response({"detail": "Employee not found."}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, employee_id):
        try:
            employee = Employee.objects.get(employee_id=employee_id)
            employee.delete()
            return Response({'message': 'Employee deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Employee.DoesNotExist:
            return Response({"detail": "Employee not found."}, status=status.HTTP_404_NOT_FOUND)
