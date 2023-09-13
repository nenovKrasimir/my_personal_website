
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('', include('my_personal_website.core.urls')),
    path('admin/', admin.site.urls),
]
