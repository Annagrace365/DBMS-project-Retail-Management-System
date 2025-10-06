from django.urls import path
from .views import LoginView, admin_kpis, AdminCustomerListCreate
from . import views
urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("admin/kpis", views.admin_kpis, name="admin-kpis"),
    path("admin/customers/", AdminCustomerListCreate.as_view(), name="admin-customers"),
    path("admin/orders/", views.list_orders, name="admin-orders"),
    path("admin/products/", views.list_products, name="list-products"),
    path("admin/suppliers/", views.list_suppliers, name="list-suppliers"),
    path("admin/payments/", views.list_payments, name="list-payments"),

]
