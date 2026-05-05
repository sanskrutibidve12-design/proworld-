
from os import link
from django.utils import timezone
from datetime import timedelta
from rest_framework.exceptions import PermissionDenied
from arrow import now
from django.contrib.auth import get_user_model
from openai import models
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.viewsets import ModelViewSet
from django.db.models import Count
import uuid
from django.conf import settings
from django.core.mail import send_mail
from streamlit import user
from .models import Application, Domain, MentorRemark, Student, Course, College, Mentor,User
from .serializers import (
    UserSerializer,
    ApplicationSerializer,
    StudentSerializer,
    DomainSerializer,
    CourseSerializer,
    CollegeSerializer,
    MentorSerializer
)

User = get_user_model()

# 🔐 LOGIN
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    if not user.check_password(password):
        return Response({"error": "Invalid password"}, status=400)

    refresh = RefreshToken.for_user(user)
    mentor_type = None

    if user.role == "mentor":
     try:
        mentor = Mentor.objects.get(user=user)
        mentor_type = mentor.role   # college / industry
     except Mentor.DoesNotExist:
        mentor_type = None
    

    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "role": user.role,
        "email": user.email,
        "mentor_type": mentor_type,
        "name":user.username,
    })


# 🔒 PROTECTED
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({"message": "Authenticated"})


# 👥 USERS get_users function was there

# 🚀 APPLICATION VIEWSET
class ApplicationViewSet(ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [AllowAny]


# 🎓 STUDENT VIEWSET (🔥 THIS FIXES YOUR ISSUE)
class StudentViewSet(ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Student.objects.all()

        college = self.request.query_params.get('college')
        domain = self.request.query_params.get('domain')
        course = self.request.query_params.get('course')
        sort = self.request.query_params.get('sort')

        if college:
            queryset = queryset.filter(college_id=int(college))

        if domain:
            queryset = queryset.filter(domain_id=domain)

        if course:
            queryset = queryset.filter(course_id=course)

        if sort:
            queryset = queryset.order_by(sort)

        return queryset


# 🎯 DROPDOWNS
@api_view(['GET'])
@permission_classes([AllowAny])
def get_domains(request):
    domains = Domain.objects.all()
    return Response(DomainSerializer(domains, many=True).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_courses(request):
    courses = Course.objects.all()
    return Response(CourseSerializer(courses, many=True).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_colleges(request):
    colleges = College.objects.all()
    return Response(CollegeSerializer(colleges, many=True).data)

# 🎓 MENTOR VIEWSET (🔥 THIS FIXES YOUR ISSUE)
'''class MentorViewSet(ModelViewSet):
    queryset = Mentor.objects.all()
    serializer_class = MentorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Mentor.objects.all()

        college = self.request.query_params.get('college')
        if college:
            queryset = queryset.filter(college_id=int(college))
        return queryset'''

class MentorViewSet(ModelViewSet):
    queryset = Mentor.objects.all()
    serializer_class = MentorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Mentor.objects.all()

        college = self.request.query_params.get('college')
        role = self.request.query_params.get('role')

        if college:
            queryset = queryset.filter(college_id=int(college))

        if role:
            queryset = queryset.filter(role=role)

        return queryset
    
    def perform_destroy(self, instance):
    # delete linked user first
     if instance.user:
        instance.user.delete()

    # then delete mentor
     instance.delete()
    def perform_create(self, serializer):
        mentor = serializer.save()
        print("mentor created", mentor.email)

        # 🔥 generate token
        token = str(uuid.uuid4())
        mentor.token = token
        mentor.save()

        # 🔗 link
        link = f"{settings.FRONTEND_URL}/create-account/{token}"
        # 📧 send email
        send_mail(
            subject="Create Your Mentor Account",
            message=f"""
Hello {mentor.name},

Greetings from Proworld Technology.


We are pleased to inform you that you have been added as a mentor on our platform. You can create your account using this email address and log in to continue.


Once logged in, you will be able to access your dashboard and begin mentoring activities.


If you need any assistance during the setup process, please feel free to contact us.
Thank you for being a part of Proworld Technology. We look forward to your valuable contribution.

Best regards,
Proworld Technology Team

Create your account here:
{link}

""",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[mentor.email],
            
        )
    

class CollegeViewSet(ModelViewSet):
    queryset = College.objects.all()
    serializer_class = CollegeSerializer
    permission_classes = [AllowAny]  

    def get_queryset(self):
        queryset = College.objects.all()
        sort = self.request.query_params.get('sort')
        if sort:
            queryset = queryset.order_by(sort)
        return queryset
    
class CourseViewSet(ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Course.objects.all()

        sort = self.request.query_params.get('sort')
        if sort:
            queryset = queryset.order_by(sort)

        return queryset
# Domain ViewSet
class DomainViewSet(ModelViewSet):
    queryset = Domain.objects.all()
    serializer_class = DomainSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Domain.objects.all()

        sort = self.request.query_params.get('sort')
        if sort:
            queryset = queryset.order_by(sort)

        return queryset  
# Dashboard Stats
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):

    # 📄 APPLICATION STATS
    total_applications = Application.objects.count()
    approved = Application.objects.filter(status='approved').count()
    pending = Application.objects.filter(status='pending').count()
    rejected = Application.objects.filter(status='rejected').count()

    # 🎓 STUDENT STATS
    total_students = Student.objects.count()

    students_per_college = Student.objects.values(
        'college__name'
    ).annotate(count=Count('id'))

    # 🏫 SYSTEM COUNTS
    total_colleges = College.objects.count()
    total_domains = Domain.objects.count()
    total_courses = Course.objects.count()
    total_mentors = Mentor.objects.count()
    total_users = User.objects.count()

    # 📚 COURSE → COLLEGE COUNT
    courses = Course.objects.annotate(
        college_count=Count('colleges')
    ).values('name', 'college_count')

    return Response({
        "applications": {
            "total": total_applications,
            "approved": approved,
            "pending": pending,
            "rejected": rejected
        },
        "students": {
            "total": total_students,
            "by_college": list(students_per_college)
        },
        "system": {
            "colleges": total_colleges,
            "domains": total_domains,
            "courses": total_courses,
            "mentors": total_mentors,
            "users": total_users
        },
        "courses": list(courses)
    })      
#approve logic
@api_view(['POST'])
def approve_application(request, id):
    try:
        app = Application.objects.get(id=id)

        if app.status == "approved":
            return Response({"message": "Already approved"})

        app.status = "approved"

        # generate token
        token = str(uuid.uuid4())
        app.token = token
        app.save()

        # activation link
        link = f"{settings.FRONTEND_URL}/create-account/{token}"

        # send email
        send_mail(
            subject="Application Approved 🎉",
            message=f"""
Dear {app.name},

Greetings from Proworld Technology.
We are pleased to inform you that your application has been successfully accepted.

You can now create your account and log in to access our platform and begin your journey with us.

If you have any questions or require assistance during the process, feel free to reach out to us.

Thank you for joining Proworld Technology. We look forward to having you on board.
Best regards,
Proworld Technology Team

Create your account here:
{link}
""",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[app.email],
        )

        return Response({"message": "Approved + Email sent"})

    except Application.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    
#create account logic
@api_view(['POST'])
@permission_classes([AllowAny])
def create_account(request, token):
    print("api hit")

    password = request.data.get("password")

    # ───── TRY STUDENT FIRST ─────
    try:
        app = Application.objects.get(token=token)

        if app.status != "approved":
            return Response({"error": "Application not approved"}, status=400)

        # already registered?
        if Student.objects.filter(email=app.email).exists():
            return Response({"error": "Account already exists"}, status=400)

        # ✅ create user
        user = User.objects.create(
            username=app.email,
            email=app.email,
            role="student"
        )
        user.set_password(password)
        user.save()

        # ✅ create student NOW
        Student.objects.create(
            user=user,
            name=app.name,
            email=app.email,
            roll_no=app.roll_no,
            mobile_no=app.mobile_no,
            college=app.college,
            course=app.course,
            domain=app.domain,
            is_registered=True
        )

        return Response({"message": "Student account created"})

    except Application.DoesNotExist:
        pass

    # ───── TRY MENTOR ─────
    try:
        mentor = Mentor.objects.get(token=token)

        if mentor.is_registered:
            return Response({"error": "Account already created"}, status=400)

        # ✅ create user
        user = User.objects.create(
            username=mentor.email,
            email=mentor.email,
            role="mentor"
        )
        user.set_password(password)
        user.save()

        # link mentor
        mentor.user = user
        mentor.is_registered = True
        mentor.save()

        return Response({"message": "Mentor account created"})

    except Mentor.DoesNotExist:
        return Response({"error": "Invalid token"}, status=404)


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        # also delete related mentor or student if needed
        try:
            if hasattr(instance, 'mentor'):
                instance.mentor.delete()
        except:
            pass

        try:
            if hasattr(instance, 'student'):
                instance.student.delete()
        except:
            pass

        instance.delete()


# Add these to your existing accounts/views.py
# These are the NEW endpoints needed for the student panel

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count
from datetime import date, timedelta

from .models import (
    Student, DailyUpdate, DailyTask,
    Attendance, Mentor
)
from .serializers import (
    DailyUpdateSerializer, DailyTaskSerializer,
    AttendanceSerializer
)


# ─── HELPER: get student from logged in user ──────────────────────────────────
def get_student_for_user(user):
    try:
        return Student.objects.get(user=user)
    except Student.DoesNotExist:
        return None


# ─── DAILY UPDATE: List + Create ─────────────────────────────────────────────
'''@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def daily_updates(request):
    student = get_student_for_user(request.user)
    if not student:
        return Response({"error": "Student not found"}, status=404)

    if request.method == 'GET':
        updates = DailyUpdate.objects.filter(student=student).order_by('-date')
        return Response(DailyUpdateSerializer(updates, many=True).data)

    if request.method == 'POST':
        content = request.data.get('content', '').strip()
        if not content:
            return Response({"error": "Content is required"}, status=400)

        # One update per day
        today = date.today()
        update, created = DailyUpdate.objects.get_or_create(
            student=student,
            date=today,
            defaults={'content': content}
        )
        if not created:
            update.content = content
            update.save()

        return Response(DailyUpdateSerializer(update).data, status=201)'''

from django.db.models import Q

# ─── DAILY TASKS: List for today ─────────────────────────────────────────────
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_tasks(request):
    student = get_student_for_user(request.user)
    if not student:
        return Response({"error": "Student not found"}, status=404)

    all_param = request.query_params.get('all')
    
    # ✅ fetch tasks for student's domain
    
    tasks = DailyTask.objects.filter(
       Q(domain=student.domain) | Q(assigned_to=student)
        )
   
    if not all_param:
            today = now().date()
            tasks = tasks.filter(date=today)

    # ✅ annotate each task with whether THIS student completed it
    result = []
    for task in tasks:
        result.append({
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "date": str(task.date),
            "completed": student in task.completed_by.all()
        })

    return Response(result)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def complete_task(request, task_id):
    student = get_student_for_user(request.user)
    if not student:
        return Response({"error": "Student not found"}, status=404)

    try:
        task = DailyTask.objects.get(id=task_id)
    except DailyTask.DoesNotExist:
        return Response({"error": "Task not found"}, status=404)

    # ✅ toggle completion for this student
    if student in task.completed_by.all():
        task.completed_by.remove(student)
        completed = False
    else:
        task.completed_by.add(student)
        completed = True

    return Response({"id": task.id, "completed": completed})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_progress(request):
    student = get_student_for_user(request.user)
    if not student:
        return Response({"error": "Student not found"}, status=404)

    # ✅ count domain tasks, not personal tasks
    all_tasks = DailyTask.objects.filter(domain=student.domain)
    total = all_tasks.count()
    completed = all_tasks.filter(completed_by=student).count()

    # streak calculation
    from datetime import timedelta
    updates = list(
        DailyUpdate.objects.filter(student=student)
        .order_by('-date')
        .values_list('date', flat=True)
    )
    streak = 0
    check_date = date.today()
    for update_date in updates:
        if update_date == check_date:
            streak += 1
            check_date -= timedelta(days=1)
        else:
            break

    return Response({
        "total_tasks": total,
        "completed_tasks": completed,
        "percentage": round((completed / total * 100), 1) if total > 0 else 0,
        "streak": streak,
    })
# ─── ATTENDANCE: View my attendance ──────────────────────────────────────────
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_attendance(request):
    student = get_student_for_user(request.user)
    if not student:
        return Response({"error": "Student not found"}, status=404)

    records = Attendance.objects.filter(student=student).order_by('-date')

    # Stats
    total = records.count()
    present = records.filter(present=True).count()

    return Response({
        "stats": {
            "total": total,
            "present": present,
            "absent": total - present,
            "percentage": round((present / total * 100), 1) if total > 0 else 0
        },
        "records": AttendanceSerializer(records, many=True).data
    })


# ─── PROGRESS: Task completion % ─────────────────────────────────────────────
'''@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_progress(request):
    student = get_student_for_user(request.user)
    if not student:
        return Response({"error": "Student not found"}, status=404)

    all_tasks = DailyTask.objects.filter(assigned_to=student)
    total = all_tasks.count()
    completed = all_tasks.filter(completed=True).count()

    # Streak: consecutive days with a daily update
    updates = DailyUpdate.objects.filter(student=student).order_by('-date').values_list('date', flat=True)
    streak = 0
    check_date = date.today()
    for update_date in updates:
        if update_date == check_date:
            streak += 1
            check_date -= timedelta(days=1)
        else:
            break

    return Response({
        "total_tasks": total,
        "completed_tasks": completed,
        "percentage": round((completed / total * 100), 1) if total > 0 else 0,
        "streak": streak
    })
'''

# ─── WEEKLY REPORT: Get updates + tasks for a week ───────────────────────────
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def weekly_report(request):
    student = get_student_for_user(request.user)
    if not student:
        return Response({"error": "Student not found"}, status=404)

    # ?week_start=YYYY-MM-DD  (defaults to current week Monday)
    week_start_str = request.query_params.get('week_start')
    if week_start_str:
        try:
            week_start = date.fromisoformat(week_start_str)
        except ValueError:
            return Response({"error": "Invalid date format"}, status=400)
    else:
        today = date.today()
        week_start = today - timedelta(days=today.weekday())  # Monday

    week_end = week_start + timedelta(days=6)

    updates = DailyUpdate.objects.filter(
        student=student, date__range=[week_start, week_end]
    ).order_by('date')

    tasks = DailyTask.objects.filter(
       domain=student.domain, date__range=[week_start, week_end]
        ).order_by('date')

    return Response({
        "week_start": week_start,
        "week_end": week_end,
        "updates": DailyUpdateSerializer(updates, many=True).data,
        "tasks": DailyTaskSerializer(tasks, many=True).data,
    })


# ─── STUDENT PROFILE: View + Update ─────────────────────────────────────────
'''@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def my_profile(request):
    student = get_student_for_user(request.user)
    if not student:
        return Response({"error": "Student not found"}, status=404)

    if request.method == 'GET':
        return Response({
            "name": student.name,
            "email": student.email,          # read-only in frontend
            "roll_no": student.roll_no,
            "mobile_no": student.mobile_no,
            "college": student.college.name, # read-only in frontend
            "course": student.course.name,
            "domain": student.domain.name,
        })

    if request.method == 'PATCH':
        # Only allow editable fields
        allowed = ['name', 'roll_no', 'mobile_no']
        for field in allowed:
            value = request.data.get(field)
            if value is not None:
                setattr(student, field.replace('_no', '_no'), value)

        # Handle name update in user model too
        if 'name' in request.data:
            student.name = request.data['name']

        student.save()

        # Also update username if name changed
        if 'name' in request.data and student.user:
            student.user.first_name = request.data['name'].split()[0]
            student.user.save()

        return Response({"message": "Profile updated successfully"})
'''

# ─── NOTIFICATIONS: Mentor feedback notifications ────────────────────────────
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_notifications(request):
    student = get_student_for_user(request.user)
    if not student:
        return Response({"error": "Student not found"}, status=404)

    remarks = MentorRemark.objects.filter(
        student=student
    ).select_related('mentor').order_by('-created_at')

    notifications = []
    for r in remarks:
        notifications.append({
            "id": r.id,
            "message": f"{r.mentor.name} gave you a {r.rating}⭐ rating — \"{r.remark[:60]}{'...' if len(r.remark) > 60 else ''}\"",
            "time": r.created_at.strftime("%b %d, %Y · %I:%M %p"),
            "read": False
        })

    return Response({
        "notifications": notifications,
        "unread_count": len(notifications)
    })
# ─── REPLACE these two views in your accounts/views.py ───────────────────────

from datetime import date

# 1. DAILY UPDATES — fixed today's update detection
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def daily_updates(request):
    student = get_student_for_user(request.user)
    if not student:
        return Response({"error": "Student not found"}, status=404)

    if request.method == 'GET':
        updates = DailyUpdate.objects.filter(student=student).order_by('-date')
        return Response(DailyUpdateSerializer(updates, many=True).data)

    if request.method == 'POST':
        content = request.data.get('content', '').strip()
        if not content:
            return Response({"error": "Content is required"}, status=400)

        today = date.today()

        # ✅ Save or update daily update
        update, created = DailyUpdate.objects.get_or_create(
            student=student,
            date=today,
            defaults={'content': content}
        )
        if not created:
            update.content = content
            update.save()

        # ✅ AUTO MARK ATTENDANCE — present when update is submitted
        Attendance.objects.get_or_create(
            student=student,
            date=today,
            defaults={'present': True}
        )
        # If attendance record already exists, make sure it's marked present
        Attendance.objects.filter(student=student, date=today).update(present=True)

        return Response(DailyUpdateSerializer(update).data, status=201)

# 2. PROFILE — added internship_start / internship_end
@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def my_profile(request):
    student = get_student_for_user(request.user)
    if not student:
        return Response({"error": "Student not found"}, status=404)

    if request.method == 'GET':
        return Response({
            "name": student.name,
            "email": student.email,
            "roll_no": student.roll_no,
            "mobile_no": student.mobile_no or "",
            "college": student.college.name,
            "course": student.course.name,
            "domain": student.domain.name,
            # Add internship_start / internship_end to your Student model
            # if you want these — for now returns None
            "internship_start": getattr(student, 'internship_start', None),
            "internship_end": getattr(student, 'internship_end', None),
        })

    if request.method == 'PATCH':
        allowed_fields = ['name', 'roll_no', 'mobile_no']
        for field in allowed_fields:
            value = request.data.get(field)
            if value is not None:
                setattr(student, field, value)
        student.save()

        # Sync name to User model too
        if 'name' in request.data and student.user:
            student.user.first_name = request.data['name'].split()[0]
            student.user.save()

        return Response({"message": "Profile updated successfully"})


# 3. PROGRESS — based on tasks completed
'''@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_progress(request):
    student = get_student_for_user(request.user)
    if not student:
        return Response({"error": "Student not found"}, status=404)

    from .models import DailyTask, DailyUpdate
    from datetime import timedelta

    all_tasks = DailyTask.objects.filter(assigned_to=student)
    total = all_tasks.count()
    completed = all_tasks.filter(completed=True).count()

    # ─── Streak: consecutive days with a daily update ────────────────────────
    updates = list(
        DailyUpdate.objects.filter(student=student)
        .order_by('-date')
        .values_list('date', flat=True)
    )
    streak = 0
    check_date = date.today()
    for update_date in updates:
        if update_date == check_date:
            streak += 1
            check_date -= timedelta(days=1)
        else:
            break

    return Response({
        "total_tasks": total,
        "completed_tasks": completed,
        "percentage": round((completed / total * 100), 1) if total > 0 else 0,
        "streak": streak,
    })'''
# In views.py — add this temporary test view
@api_view(['GET'])
@permission_classes([IsAuthenticated])  
def test_auth(request):
    return Response({"user": str(request.user), "auth": str(request.auth)})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_feedback(request):
    student = get_student_for_user(request.user)

    remarks = MentorRemark.objects.filter(
        student=student
    ).select_related('mentor', 'daily_update').order_by('-created_at')

    data = []

    for r in remarks:
        data.append({
            "id": r.id,
            "mentor_name": r.mentor.name,
            "remark": r.remark,
            "rating": r.rating,
            "created_at": r.created_at,
            "update_date": r.daily_update.date if r.daily_update else None
        })

    return Response(data)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_students(request):
    try:
        mentor = Mentor.objects.get(user=request.user)
    except Mentor.DoesNotExist:
        return Response({"error": "Mentor not found"}, status=404)

    if mentor.role == "college":
     students = Student.objects.filter(college=mentor.college)

    elif mentor.role == "industry":
       students = Student.objects.filter(domain=mentor.domain)

    else:
       students = Student.objects.none()

    data = []
    for s in students:
        attendance = Attendance.objects.filter(student=s)
        total = attendance.count()
        present = attendance.filter(present=True).count()

        percentage = round((present / total * 100), 1) if total > 0 else 0

        data.append({
            "id": s.id,
            "name": s.name,
            "email": s.email,
            "roll_no": s.roll_no,
            "domain": s.domain.name,
            "attendance": percentage
        })

    return Response(data)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mentor_dashboard(request):
    mentor = Mentor.objects.get(user=request.user)

    if mentor.role == "college":
     students = Student.objects.filter(college=mentor.college)

    elif mentor.role == "industry":
     students = Student.objects.filter(domain=mentor.domain)

    else:
      students = Student.objects.none()

    total_students = students.count()

    attendance = Attendance.objects.filter(student__in=students)
    total = attendance.count()
    present = attendance.filter(present=True).count()

    avg_attendance = round((present / total * 100), 1) if total > 0 else 0

    remarks = MentorRemark.objects.filter(mentor=mentor).count()

    return Response({
        "total_students": total_students,
        "avg_attendance": avg_attendance,
        "remarks": remarks
    })
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_remark(request):
    mentor = Mentor.objects.get(user=request.user)

    student_id = request.data.get("student_id")
    remark_text = request.data.get("remark")
    rating = request.data.get("rating", 5)
    update_id = request.data.get("update_id")  # ✅ NEW

    try:
        student = Student.objects.get(id=student_id)
    except Student.DoesNotExist:
        return Response({"error": "Student not found"}, status=404)

    update = None
    if update_id:
        try:
            update = DailyUpdate.objects.get(id=update_id)
        except DailyUpdate.DoesNotExist:
            return Response({"error": "Update not found"}, status=404)

    MentorRemark.objects.create(
        student=student,
        mentor=mentor,
        daily_update=update,   # ✅ LINKED
        remark=remark_text,
        rating=rating
    )

    return Response({"message": "Remark added"})
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mentor_updates(request):
    mentor = Mentor.objects.get(user=request.user)
    if mentor.role == "college":
     students = Student.objects.filter(college=mentor.college)

    elif mentor.role == "industry":
     students = Student.objects.filter(domain=mentor.domain)

    else:
     students = Student.objects.none()

    updates = DailyUpdate.objects.filter(student__in=students).order_by('-date')

    data = []
    for u in updates:
        data.append({
            "id": u.id,
            "student": u.student.name,
            "domain": u.student.domain.name,
            "content": u.content,
            "date": u.date
        })

    return Response(data)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mentor_attendance(request):
    mentor = Mentor.objects.get(user=request.user)
    if mentor.role == "college":
        students = Student.objects.filter(college=mentor.college)

    else:  # industry mentor
        students = Student.objects.filter(domain=mentor.domain) 
    data = []

    for s in students:
        records = Attendance.objects.filter(student=s)
        total = records.count()
        present = records.filter(present=True).count()

        percentage = round((present / total * 100), 1) if total > 0 else 0

        data.append({
            "student": s.name,
            "attendance": percentage
        })

    return Response(data)
class TaskViewSet(ModelViewSet):
    queryset = DailyTask.objects.all()
    serializer_class = DailyTaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
       user = self.request.user

    # ✅ Admin sees all tasks
       if user.role == "admin":
          return DailyTask.objects.all()

       if user.role == "mentor":
        mentor = Mentor.objects.get(user=user)
        if mentor.role == "industry":
            return DailyTask.objects.filter(domain=mentor.domain)

       return DailyTask.objects.none()

    def perform_create(self, serializer):
        user = self.request.user

    # ✅ Admin can create tasks for any domain (domain comes from request data)
        if user.role == "admin":
            serializer.save()
            return

    # Mentor flow stays the same
        if user.role != "mentor":
             raise PermissionDenied("Only mentors or admins can create tasks")

        mentor = Mentor.objects.get(user=user)
        if mentor.role != "industry":
           raise PermissionDenied("Only industry mentors can assign tasks")

        serializer.save(domain=mentor.domain)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_attendance(request):
    records = Attendance.objects.select_related('student').order_by('-date')

    data = []
    for r in records:
        data.append({
            "student": r.student.name,
            "email": r.student.email,
            "date": r.date,
            "present": r.present
        })

    return Response(data)

@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    email = request.data.get("email")

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    # 🔐 Generate token
    token = str(uuid.uuid4())
    user.reset_token = token
    user.token_created_at = timezone.now()
    user.save()

    # 🔗 Frontend reset link
    reset_link = f"http://localhost:8080/reset-password/{token}"

    send_mail(
        subject="Reset Your Password 🔐",
        message=f"""
Hello,

Click below to reset your password:
{reset_link}

This link will expire in 10 minutes.
""",
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[email],
    )

    return Response({"message": "Email sent"})

@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request, token):
    password = request.data.get("password")

    try:
        user = User.objects.get(reset_token=token)
    except User.DoesNotExist:
        return Response({"error": "Invalid token"}, status=400)

    from django.utils import timezone
    from datetime import timedelta

    # ⏱ Token expiry (10 minutes)
    if user.token_created_at < timezone.now() - timedelta(minutes=10):
        return Response({"error": "Token expired"}, status=400)

    # ✅ Set new password
    user.set_password(password)
    user.reset_token = None
    user.token_created_at = None
    user.save()

    return Response({"message": "Password reset successful"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_all_updates(request):
    updates = DailyUpdate.objects.select_related('student').order_by('-date')
    data = []
    for u in updates:
        data.append({
            "id": u.id,
            "student": u.student.name,
            "email": u.student.email,
            "domain": u.student.domain.name,
            "content": u.content,
            "date": u.date
        })
    return Response(data)