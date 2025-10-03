from django.contrib import admin
from .models import Customer, Product, Supplier, ProductSupplier, Order, OrderItem, Payment

# Register your models here
admin.site.register(Customer)
admin.site.register(Product)
admin.site.register(Supplier)
admin.site.register(ProductSupplier)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Payment)
