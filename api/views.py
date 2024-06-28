from rest_framework import status, generics, viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse, Http404
from django.middleware.csrf import get_token
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views.generic.base import View
from rest_framework.decorators import api_view
from django.contrib.auth import get_user_model, authenticate, login as auth_login, logout as auth_logout
from .models import Employee, Company
from .serializers import EmployeeSerializer
import csv
import pandas as pd
import json
from .permissions import IsTalentAdmin, IsCompanyUser, IsCompanyUserOrReadOnly
from rest_framework.decorators import permission_classes


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

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views.generic.base import View
from rest_framework import status, permissions

from .models import Company
import json

@method_decorator(csrf_exempt, name='dispatch')
class SaveOrUpdateCompanyView(View):
    permission_classes = [permissions.IsAuthenticated, IsCompanyUser] 

    def post(self, request):
        try:
            data = json.loads(request.body)
            company_id = data.get('company_id', None)

            if company_id:
                company = Company.objects.get(id=company_id)
                company.name = data['name']
                company.registration_date = data['registration_date']
                company.registration_number = data['registration_number']
                company.address = data['address']
                company.contact_person = data['contact_person']
                company.contact_phone = data['contact_phone']
                company.email = data['email']
                company.save()
                return JsonResponse({'message': 'Company updated successfully'}, status=status.HTTP_200_OK)
            else:
                company = Company.objects.create(
                    name=data['name'],
                    registration_date=data['registration_date'],
                    registration_number=data['registration_number'],
                    address=data['address'],
                    contact_person=data['contact_person'],
                    contact_phone=data['contact_phone'],
                    email=data['email']
                )
                return JsonResponse({'message': 'Company created successfully', 'company_id': company.id}, status=status.HTTP_201_CREATED)
        except Company.DoesNotExist:
            return JsonResponse({'error': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)





@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, IsCompanyUserOrReadOnly])
def get_company_id(request):
    try:
        company = Company.objects.latest('id')
        return JsonResponse({'companyId': company.id})
    except Company.DoesNotExist:
        return JsonResponse({'companyId': None})

@csrf_exempt
@require_http_methods(["PUT"])
@permission_classes([permissions.IsAuthenticated, IsCompanyUser])
def update_company_raw(request, companyId):
    try:
        company = Company.objects.get(id=companyId)
        data = json.loads(request.body)
        company.name = data.get('name', company.name)
        company.registration_date = data.get('registration_date', company.registration_date)
        company.registration_number = data.get('registration_number', company.registration_number)
        company.address = data.get('address', company.address)
        company.contact_person = data.get('contact_person', company.contact_person)
        company.contact_phone = data.get('contact_phone', company.contact_phone)
        company.email = data.get('email', company.email)
        company.save()
        return JsonResponse({'message': 'Company updated successfully', 'companyId': company.id})
    except Company.DoesNotExist:
        return JsonResponse({'error': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


from django.contrib.auth import get_user_model, authenticate, login as auth_login, logout as auth_logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.middleware.csrf import get_token
from rest_framework import status
import json

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

# Login view
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
                return JsonResponse({'message': 'Login successful', 'role': 'admin' if user.is_superuser else 'user'})
            else:
                return JsonResponse({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    return JsonResponse({'error': 'Only POST requests are allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

# Logout view
@csrf_exempt
def logout(request):
    if request.method == 'POST':
        auth_logout(request)
        return JsonResponse({'message': 'Logout successful'})

    return JsonResponse({'error': 'Only POST requests are allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

# Check authentication status
def check_auth(request):
    if request.user.is_authenticated:
        role = 'admin' if request.user.is_superuser else 'user'
        return JsonResponse({'authenticated': True, 'role': role})
    else:
        return JsonResponse({'authenticated': False})

# View to get CSRF token
def csrf_token(request):
    return JsonResponse({'csrfToken': get_token(request)})


# api/views.py
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Employee
from .serializers import EmployeeSerializer
from django.http import Http404

class EmployeeDetail(APIView):
    """
    Retrieve, update or delete an employee instance.
    """
    def get_object(self, pk):
        try:
            return Employee.objects.get(pk=pk)
        except Employee.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        employee = self.get_object(pk)
        serializer = EmployeeSerializer(employee)
        return Response(serializer.data)

    def delete(self, request, pk, format=None):
        employee = self.get_object(pk)
        employee.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

