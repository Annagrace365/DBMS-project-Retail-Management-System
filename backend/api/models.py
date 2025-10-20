# backend/api/models.py
from django.db import models
class Users(models.Model):
    username = models.CharField(max_length=100, unique=True, null=False, blank=False)
    email = models.EmailField(unique=True, null=False, blank=False)
    password = models.CharField(max_length=128, null=False, blank=False)
    role = models.CharField(max_length=50, null=False, blank=False)  # admin, customer, manager

    def __str__(self):
        return self.username

# Customer
class Customer(models.Model):
    customer_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    address = models.TextField()
    phone = models.CharField(max_length=20)

    def __str__(self):
        return self.name

# Product
class Product(models.Model):
    product_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()

    def __str__(self):
        return self.name

# Supplier
class Supplier(models.Model):
    supplier_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    contact = models.CharField(max_length=100)

    def __str__(self):
        return self.name

# ProductSupplier
class ProductSupplier(models.Model):
    product_id = models.ForeignKey(Product, on_delete=models.CASCADE)
    supplier_id = models.ForeignKey(Supplier, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('product_id', 'supplier_id')

# Order
class Order(models.Model):
    order_id = models.AutoField(primary_key=True)
    customer_id = models.ForeignKey(Customer, on_delete=models.CASCADE)
    order_date = models.DateField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    # New fields for POS system
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, default='pending')  # e.g. pending, completed
    cashier = models.ForeignKey('Users', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Order {self.order_id} - {self.customer_id.name}"
# OrderItem
class OrderItem(models.Model):
    order_id = models.ForeignKey(Order, on_delete=models.CASCADE)
    product_id = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True)  # nullable now
    quantity = models.PositiveIntegerField()

    # New fields for manual/custom items
    name = models.CharField(max_length=255, blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    class Meta:
        unique_together = ('order_id', 'product_id')

    def __str__(self):
        if self.product_id:
            return f"{self.product_id.name} x {self.quantity}"
        return f"{self.name} x {self.quantity}"

# Payment
class Payment(models.Model):
    payment_id = models.AutoField(primary_key=True)
    order_id = models.ForeignKey(Order, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_mode = models.CharField(max_length=50)  # e.g., Cash, Card, UPI

    def __str__(self):
        return f"Payment {self.payment_id} for Order {self.order_id.order_id}"
