from django.urls import path
from .views import LoginView, admin_kpis, AdminCustomerListCreate, delete_customer
from . import views

urlpatterns = [
    path("login/", LoginView.as_view(), name="api-login"),
    path("admin/kpis/", views.admin_kpis, name="admin-kpis"),
    path("admin/customers/", AdminCustomerListCreate.as_view(), name="admin-customers"),
    path("admin/orders/", views.list_orders, name="admin-orders"),
    path("admin/products/", views.list_products, name="list-products"),
    path("admin/suppliers/", views.list_suppliers, name="list-suppliers"),
    path("admin/payments/", views.list_payments, name="list-payments"),
    path("admin/customers/<int:pk>/", delete_customer, name="delete-customer"),
    path("admin/customers/<int:pk>/update/", views.update_customer, name="update-customer"),
    path("admin/products/create/", views.create_product, name="create_product"),
    path("admin/suppliers/create/", views.create_supplier, name="create-supplier"),
    path("admin/products/<int:pk>/", views.patch_product, name="patch-product"),

    # Cashier endpoints
    path('cashier/products/', views.list_products, name='cashier-products'),  # <-- ADD THIS
    path('cashier/orders/', views.CreateOrderView.as_view(), name='create-order'),
    path('cashier/orders/<int:order_id>/add-item/', views.AddItemToOrderView.as_view(), name='add-item-to-order'),
    path('cashier/orders/<int:order_id>/complete-sale/', views.CompleteSaleView.as_view(), name='complete-sale'),
]
