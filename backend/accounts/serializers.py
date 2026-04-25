from rest_framework import serializers
from .models import User, Application, Student, Domain, College, Course, Mentor,Attendance, DailyTask, DailyUpdate, MentorRemark


# 👤 USER
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'role']


# 🌐 DOMAIN
class DomainSerializer(serializers.ModelSerializer):
    class Meta:
        model = Domain
        fields = ['id', 'name', 'description']



# 🏫 COLLEGE
class CollegeSerializer(serializers.ModelSerializer):
    class Meta:
        model = College
        fields = ['id', 'name']


# 📚 COURSE
class CourseSerializer(serializers.ModelSerializer):

    # READ
    college_names = serializers.StringRelatedField(
        source='colleges',
        many=True,
        read_only=True
    )

    # WRITE
    colleges = serializers.PrimaryKeyRelatedField(
        queryset=College.objects.all(),
        many=True
    )

    class Meta:
        model = Course
        fields = ['id', 'name', 'colleges', 'college_names']


# 📄 APPLICATION
class ApplicationSerializer(serializers.ModelSerializer):

    college_name = serializers.CharField(source='college.name', read_only=True)
    course_name = serializers.CharField(source='course.name', read_only=True)
    domain_name = serializers.CharField(source='domain.name', read_only=True)

    class Meta:
        model = Application
        fields = '__all__'


# 🎓 STUDENT
class StudentSerializer(serializers.ModelSerializer):

    # READ
    college_name = serializers.CharField(source='college.name', read_only=True)
    course_name = serializers.CharField(source='course.name', read_only=True)
    domain_name = serializers.CharField(source='domain.name', read_only=True)

    # WRITE (🔥 VERY IMPORTANT)
    college = serializers.PrimaryKeyRelatedField(queryset=College.objects.all())
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all())
    domain = serializers.PrimaryKeyRelatedField(queryset=Domain.objects.all())

    class Meta:
        model = Student
        fields = [
            'id',
            'name',
            'email',
            'roll_no',
            'mobile_no',
            'college',
            'college_name',
            'course',
            'course_name',
            'domain',
            'domain_name'
        ]
# 👨‍🏫 MENTOR
class MentorSerializer(serializers.ModelSerializer):

    college_name = serializers.CharField(source='college.name', read_only=True)

    college = serializers.PrimaryKeyRelatedField(
        queryset=College.objects.all(),
        required=False,
        allow_null=True
    )

    domain = serializers.PrimaryKeyRelatedField(
        queryset=Domain.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = Mentor
        fields = [
            'id',
            'name',
            'email',
            'mobile_no',
            'college',
            'college_name',
            'role',
            'domain'
        ]

    # 🔥 ADD THIS FUNCTION HERE
    def validate(self, data):
        role = data.get("role")

        if role == "college" and not data.get("college"):
            raise serializers.ValidationError("College is required for college mentor")

        if role == "industry" and not data.get("domain"):
            raise serializers.ValidationError("Domain is required for industry mentor")

        return data
    
class DailyUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyUpdate
        fields = ['id', 'date', 'content']
 
class DailyTaskSerializer(serializers.ModelSerializer):
    domain_name = serializers.CharField(source='domain.name', read_only=True)
    completed_count = serializers.SerializerMethodField()

    class Meta:
        model = DailyTask
        fields = [
            'id',
            'title',
            'description',
            'date',
            'domain',
            'domain_name',
            'completed_count'
        ]

    def get_completed_count(self, obj):
        return obj.completed_by.count()
class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = ['id', 'date', 'present']  

class MentorRemarkSerializer(serializers.ModelSerializer):
    mentor_name = serializers.CharField(source='mentor.name', read_only=True)
    update_date = serializers.DateField(source='daily_update.date', read_only=True)

    class Meta:
        model = MentorRemark
        fields = ['id', 'mentor_name', 'remark', 'rating', 'created_at', 'update_date']