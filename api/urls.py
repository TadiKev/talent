from django.urls import path
from . import views  # Import all views from the same module
from .views import file_upload_view, EmployeeSearchView
from .views import file_upload_view, EmployeeSearchView, get_company_id, update_company_raw, SaveOrUpdateCompanyView
from .views import (
    csrf_token,
    check_auth,
    signup,
    login,
    logout,
)

urlpatterns = [
    path('upload/', views.file_upload_view, name='file_upload'),
    path('upload/', views.file_upload_view, name='file_upload'),
    
    path('search/', EmployeeSearchView.as_view(), name='employee_search'),
    path('csrf-token/', views.get_csrf_token, name='csrf-token'),
    path('employees/', views.EmployeeCreateView.as_view(), name='employee-create'),
    path('employees/<int:pk>/', views.EmployeeDetail.as_view(), name='employee-detail'),

    path('save-or-update-company/', SaveOrUpdateCompanyView.as_view(), name='save_or_update_company'),
    path('get-company-id/', get_company_id, name='get_company_id'),
    path('update-company-raw/<int:companyId>/', update_company_raw, name='update_company_raw'),
    path('check-auth/', check_auth, name='check_auth'),
    path('signup/', signup, name='signup'),
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),
    path('csrf-token/', csrf_token, name='csrf-token'), # Ensure this matches with your frontend request URL
    # Add other URL patterns as needed
]
