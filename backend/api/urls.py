# backend/api/urls.py
from django.urls import path
from .views import LoginView, admin_kpis
from . import views
urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("admin/kpis", views.admin_kpis, name="admin-kpis"),

]
