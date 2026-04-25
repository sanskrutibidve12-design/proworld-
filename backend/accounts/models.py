from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


# 🏫 COLLEGE MODEL
class College(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


# 📚 COURSE MODEL (FIXED)
class Course(models.Model):
    name = models.CharField(max_length=100)
    # 🔥 MANY TO MANY
    colleges = models.ManyToManyField(College, related_name='courses')

    def __str__(self):
        return f"{self.name} ({', '.join([c.name for c in self.colleges.all()])})"


# 👤 USER MODEL
class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('mentor', 'Mentor'),
        ('student', 'Student'),
    )

    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    def __str__(self):
        return self.username


# 🌐 DOMAIN MODEL
class Domain(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name


# 📄 APPLICATION MODEL
class Application(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    roll_no = models.CharField(max_length=50)
    mobile_no = models.CharField(max_length=15, blank=True, null=True)
    college = models.ForeignKey(College, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    domain = models.ForeignKey(Domain, on_delete=models.CASCADE)
    token = models.CharField(max_length=255, null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=(('pending', 'Pending'), ('approved', 'Approved'),('rejected', 'Rejected'), ),
        default='pending'
    )

    def __str__(self):
        return self.name





# 👨‍🏫 MENTOR MODEL
class Mentor(models.Model):
    ROLE_CHOICES = (
        ('college', 'College Mentor'),
        ('industry', 'Industry Mentor'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    token = models.CharField(max_length=255, null=True, blank=True)
    is_registered = models.BooleanField(default=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    mobile_no = models.CharField(max_length=15, blank=True, null=True)
    college = models.ForeignKey(College, on_delete=models.CASCADE,null=True, blank=True)
    domain = models.ForeignKey(Domain, on_delete=models.SET_NULL, null=True, blank=True)
    def __str__(self):
        return f"{self.name} ({self.role})"

class Student(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    roll_no = models.CharField(max_length=50)
    mobile_no = models.CharField(max_length=15, blank=True, null=True)
    college = models.ForeignKey(College, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    domain = models.ForeignKey(Domain, on_delete=models.CASCADE)
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    is_registered = models.BooleanField(default=False)
    mentor = models.ForeignKey(Mentor, on_delete=models.SET_NULL, null=True, blank=True)
    def __str__(self):
        return self.name


# ================= DAILY UPDATE =================
class DailyUpdate(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    content = models.TextField()


# ================= DAILY TASK =================
class DailyTask(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    domain = models.ForeignKey(Domain, on_delete=models.CASCADE, null=True, blank=True)  # ✅ assign by domain
    date = models.DateField()
    completed_by = models.ManyToManyField(Student, blank=True, related_name='completed_tasks')  # ✅ track who completed
    assigned_to = models.ForeignKey(Student, null=True, blank=True, on_delete=models.CASCADE)
    def __str__(self):
        return self.title

# ================= ATTENDANCE =================
class Attendance(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    date = models.DateField()
    present = models.BooleanField(default=True)

class MentorRemark(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='remarks')
    mentor = models.ForeignKey(Mentor, on_delete=models.CASCADE)
    daily_update = models.ForeignKey(DailyUpdate, on_delete=models.CASCADE, null=True, blank=True)
    remark = models.TextField()
    rating = models.IntegerField(default=5)  # 1-5
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.mentor.name} → {self.student.name}"

# ⚡ SIGNAL: AUTO CREATE STUDENT
@receiver(post_save, sender=Application)
def create_student_on_approval(sender, instance, created, **kwargs):
    if instance.status == 'approved':
        if not Student.objects.filter(email=instance.email).exists():
            Student.objects.create(
                name=instance.name,
                email=instance.email,
                roll_no=instance.roll_no,
                college=instance.college,
                course=instance.course,
                domain=instance.domain
            )


