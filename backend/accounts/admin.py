# Register your models here.
from django.contrib import admin
from .models import College, Course, MentorRemark, User, Domain, Application, Student, Mentor,Attendance, DailyTask, DailyUpdate

admin.site.register(User)
admin.site.register(Domain)
admin.site.register(Application)
admin.site.register(Student)
admin.site.register(Mentor)
admin.site.register(Course)
admin.site.register(College)
admin.site.register(MentorRemark)
admin.site.register(DailyUpdate)
admin.site.register(Attendance)

@admin.register(DailyTask)
class DailyTaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'domain', 'date']
    list_filter = ['domain', 'date']
    search_fields = ['title']