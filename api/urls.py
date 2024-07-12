from django.urls import path
from . import views  # Import all views from the same module
from .views import csrf_token, save_or_update_company, get_company, delete_company

from .views import (
    file_upload_view,
    EmployeeSearchView,
    logout_view,
    EmployeeHistoryListAPIView,
    csrf_token,
    check_auth,
    signup,
    login,
    get_csrf_token,
)

urlpatterns = [
    path('upload/', file_upload_view, name='file_upload'),
    path('search/', EmployeeSearchView.as_view(), name='employee_search'),
    path('csrf-token/', csrf_token, name='csrf-token'),  
    path('get-csrf-token/', get_csrf_token, name='get_csrf_token'), 
    path('employees/', views.EmployeeCreateView.as_view(), name='employee-create'),
    path('employees/<int:employee_id>/', views.EmployeeDetail.as_view(), name='employee-detail'),
    path('employees/<int:employee_id>/history/', EmployeeHistoryListAPIView.as_view(), name='employee_history'),
    path('save-or-update-company/', views.save_or_update_company, name='save_or_update_company'),
    path('company/<str:registration_number>/', views.get_company, name='get_company'),
    path('delete-company/<str:registration_number>/', views.delete_company, name='delete_company'),
    path('check-auth/', check_auth, name='check_auth'),
    path('signup/', signup, name='signup'),
    path('login/', login, name='login'),
    path('logout/', logout_view, name='logout'),
    
]
