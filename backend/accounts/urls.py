from accounts import views
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *
from .views import forgot_password, reset_password
router = DefaultRouter()
router.register(r'applications', ApplicationViewSet)
router.register(r'students', StudentViewSet)
router.register(r'mentors', MentorViewSet)
router.register(r'colleges', CollegeViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'domains', DomainViewSet)
router.register(r'tasks', TaskViewSet)
router.register(r'users', UserViewSet)
#router.register('tasks', TaskViewSet, basename='tasks' )

urlpatterns = [
    # ─── AUTH ─────────────────────────────────────────────────
    path('login/', login_view),
    path('protected/', protected_view),
    path('test-auth/', views.test_auth),
    path('get_colleges/', get_colleges),
    # ─── USERS ────────────────────────────────────────────────
    path('mentor_updates/', mentor_updates),
    path('my_students/', my_students),
    path('mentor_dashboard/', mentor_dashboard),
    path("mentor_attendance/", mentor_attendance),
    path('my_students/', my_students),
    path('add_remark/', add_remark),
    path('my_feedback/',my_feedback),
    path('my_notifications/',my_notifications),
    # ─── APPLICATIONS ─────────────────────────────────────────
    path('approve/<int:id>/', approve_application),
    path('create-account/<str:token>/', create_account),


    # ─── DASHBOARD ────────────────────────────────────────────
    path('dashboard/', dashboard_stats),

    # ─── STUDENT PANEL ────────────────────────────────────────
    path('student/profile/', views.my_profile),
    path('student/daily-updates/', views.daily_updates),
    path('student/tasks/', views.my_tasks),
    path('student/tasks/<int:task_id>/complete/', views.complete_task),
    path('student/attendance/', views.my_attendance),
    path('student/progress/', views.my_progress),
    path('student/weekly-report/', views.weekly_report),
    path('student/notifications/', views.my_notifications),
    path('student/feedback/', views.my_feedback),
    path('mentor/dashboard/', mentor_dashboard),
    path('mentor/students/', my_students),
    path('mentor/updates/', mentor_updates),
    path('mentor/attendance/', mentor_attendance),
    path('mentor/add-remark/', add_remark),
    path('admin/updates/', admin_all_updates),
    path('admin/attendance/', admin_attendance),
    # ─── ROUTER (keep at bottom always) ───────────────────────
    path('', include(router.urls)),
    
    path('forgot-password/', forgot_password),
    path('reset-password/<str:token>/', reset_password),
]