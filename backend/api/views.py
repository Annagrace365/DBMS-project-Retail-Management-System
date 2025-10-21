from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import permission_classes, authentication_classes, api_view
from datetime import date, timedelta
from django.db.models import Sum, Count, Max
from rest_framework import generics, status
from django.http import JsonResponse
from .models import Customer, Order, OrderItem, Product, Payment, Supplier, ProductSupplier
from .serializers import CustomerSerializer, OrderListSerializer
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import check_password
from .models import Users  # Your custom Users model
import secrets
from django.db.models import Q
from .serializers import OrderSerializer

# ---------- LOGIN ----------
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        identifier = request.data.get("identifier")
        password = request.data.get("password")
        role = request.data.get("role")

        if not identifier or not password or not role:
            return Response(
                {"success": False, "message": "All fields are required"},
                status=400
            )

        try:
            # Fetch user by role and identifier (username/email)
            user = Users.objects.filter(role=role).filter(
                Q(username=identifier) | Q(email=identifier)
            ).first()
        except Exception as e:
            return Response({"success": False, "message": str(e)}, status=500)

        if not user:
            return Response(
                {"success": False, "message": "User not found or role mismatch"},
                status=401
            )

        if user.password != password:
            return Response(
                {"success": False, "message": "Invalid password"},
                status=401
            )

        return Response({
            "success": True,
            "username": user.username,
            "role": user.role
        })
# ---------- KPIs ----------
@api_view(['GET'])
@permission_classes([AllowAny])
@authentication_classes([])
def admin_kpis(request):
    today = date.today()
    today_sales_agg = Order.objects.filter(order_date=today).aggregate(total=Sum('amount'))
    today_sales = float(today_sales_agg['total'] or 0)
    total_orders_today = Order.objects.filter(order_date=today).count()
    LOW_STOCK_THRESHOLD = 5
    low_stock_count = Product.objects.filter(stock__lt=LOW_STOCK_THRESHOLD).count()
    thirty_days_ago = today - timedelta(days=30)
    active_customers = Customer.objects.filter(order__order_date__gte=thirty_days_ago).distinct().count()

    top_products_qs = (
        OrderItem.objects
        .values('product_id', 'product_id__name')
        .annotate(qty_sold=Sum('quantity'))
        .order_by('-qty_sold')[:8]
    )
    top_products = [
        {"id": p['product_id'], "name": p['product_id__name'], "qty_sold": int(p['qty_sold'])}
        for p in top_products_qs
    ]

    recent_orders_qs = Order.objects.order_by('-order_date')[:8].values(
        'order_id', 'customer_id__name', 'amount', 'order_date'
    )
    recent_orders = [
        {
            "id": o['order_id'],
            "customer_name": o['customer_id__name'],
            "amount": float(o['amount']),
            "order_date": o['order_date'].isoformat()
        }
        for o in recent_orders_qs
    ]

    data = {
        "todaySales": today_sales,
        "totalOrdersToday": total_orders_today,
        "lowStockCount": low_stock_count,
        "activeCustomers": active_customers,
        "topProducts": top_products,
        "recentOrders": recent_orders
    }
    return Response(data)


# ---------- CUSTOMER LIST / CREATE ----------
@authentication_classes([])
class AdminCustomerListCreate(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = CustomerSerializer

    def get_queryset(self):
        qs = Customer.objects.annotate(
            orders_count=Count("order"),
            last_order_date=Max("order__order_date")
        ).order_by("-last_order_date", "-customer_id")
        return qs

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        instance = Customer.objects.filter(pk=serializer.instance.pk).annotate(
            orders_count=Count("order"),
            last_order_date=Max("order__order_date")
        ).first()
        out = CustomerSerializer(instance).data
        return Response(out, status=status.HTTP_201_CREATED)


# ---------- UPDATE CUSTOMER ----------
@api_view(["PATCH"])
@permission_classes([AllowAny])
def update_customer(request, pk):
    try:
        customer = Customer.objects.get(pk=pk)
    except Customer.DoesNotExist:
        return Response({"success": False, "message": "Customer not found"}, status=404)

    serializer = CustomerSerializer(customer, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"success": True, "message": "Customer updated", "customer": serializer.data})
    return Response({"success": False, "errors": serializer.errors}, status=400)


# ---------- DELETE CUSTOMER ----------
@api_view(["DELETE"])
@permission_classes([AllowAny])
def delete_customer(request, pk):
    try:
        customer = Customer.objects.get(pk=pk)
        customer.delete()
        return Response({"success": True, "message": "Customer deleted"})
    except Customer.DoesNotExist:
        return Response({"success": False, "message": "Customer not found"}, status=404)


# ---------- LIST ORDERS ----------
# LIST ORDERS
@api_view(["GET"])
@permission_classes([AllowAny])
@authentication_classes([])
def list_orders(request):
    orders = Order.objects.select_related("customer_id", "cashier").all().order_by("-order_date")
    serializer = OrderListSerializer(orders, many=True)
    return Response(serializer.data)


# GET ORDER DETAILS
@api_view(["GET"])
@permission_classes([AllowAny])
@authentication_classes([])
def get_order(request, pk):
    try:
        o = Order.objects.get(pk=pk)
    except Order.DoesNotExist:
        return Response({"success": False, "message": "Order not found"}, status=404)

    items = []
    for item in OrderItem.objects.filter(order_id=o):
        total = float(item.price) * item.quantity if item.price else 0
        items.append({
            "name": item.name if item.name else (item.product_id.name if item.product_id else ""),
            "price": float(item.price or 0),
            "quantity": item.quantity,
            "total": total,
        })

    data = {
        "order_id": o.order_id,
        "customer_name": o.customer_id.name,
        "cashier_name": o.cashier.username if o.cashier else "-",
        "subtotal": float(o.subtotal),
        "tax": float(o.tax),
        "amount": float(o.amount),
        "status": o.status,
        "items": items,
    }
    return Response(data)

# ---------- LIST PRODUCTS ----------
@api_view(["GET"])
@permission_classes([AllowAny])
@authentication_classes([])
def list_products(request):
    products = Product.objects.prefetch_related('productsupplier_set__supplier_id').all()
    data = []
    for product in products:
        suppliers = [ps.supplier_id.name for ps in product.productsupplier_set.all()]
        data.append({
            "product_id": product.product_id,
            "sku": f"P-{product.product_id:04d}",
            "name": product.name,
            "price": float(product.price),
            "stock": product.stock,
            "supplier_name": ", ".join(suppliers) if suppliers else "-",
        })
    return JsonResponse(data, safe=False)


# ---------- CREATE PRODUCT ----------
@api_view(["POST"])
@permission_classes([AllowAny])
def create_product(request):
    data = request.data
    name = data.get("name")
    price = data.get("price")
    stock = data.get("stock", 0)
    supplier_ids = data.get("supplier_ids", [])

    if not name or price is None:
        return Response({"success": False, "message": "Name and price are required"}, status=400)

    product = Product.objects.create(name=name, price=price, stock=stock)

    for sid in supplier_ids:
        try:
            supplier = Supplier.objects.get(pk=sid)
            ProductSupplier.objects.create(product_id=product, supplier_id=supplier)
        except Supplier.DoesNotExist:
            continue

    return Response({"success": True, "message": "Product created", "product_id": product.product_id}, status=201)

@api_view(["PATCH"])
@permission_classes([AllowAny])
def patch_product(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({"success": False, "message": "Product not found"}, status=404)

    data = request.data
    name = data.get("name")
    price = data.get("price")
    stock = data.get("stock")
    supplier_ids = data.get("supplier_ids", [])

    if name is not None:
        product.name = name
    if price is not None:
        product.price = price
    if stock is not None:
        product.stock = stock
    product.save()

    # Update suppliers: remove old, add new
    ProductSupplier.objects.filter(product_id=product).delete()
    for sid in supplier_ids:
        try:
            supplier = Supplier.objects.get(pk=sid)
            ProductSupplier.objects.create(product_id=product, supplier_id=supplier)
        except Supplier.DoesNotExist:
            continue

    return Response({"success": True, "message": "Product updated"})

# ---------- CREATE SUPPLIERS ----------
@api_view(["POST"])
@permission_classes([AllowAny])
def create_supplier(request):
    name = request.data.get("name")
    email = request.data.get("email")

    if not name or not email:
        return Response({"success": False, "message": "Name and email are required"}, status=400)

    supplier = Supplier.objects.create(name=name, contact=email)
    return Response({"success": True, "supplier_id": supplier.supplier_id, "name": supplier.name}, status=201)

# ---------- LIST SUPPLIERS ----------
@api_view(["GET"])
@permission_classes([AllowAny])
@authentication_classes([])
def list_suppliers(request):
    suppliers = Supplier.objects.prefetch_related('productsupplier_set__product_id').all()
    data = [
        {
            "supplier_id": s.supplier_id,
            "name": s.name,
            "contact": s.contact,
            "products": [ps.product_id.name for ps in s.productsupplier_set.all()]
        }
        for s in suppliers
    ]
    return JsonResponse(data, safe=False)

@api_view(["PATCH"])
@permission_classes([AllowAny])
def patch_supplier(request, pk):
    try:
        supplier = Supplier.objects.get(pk=pk)
    except Supplier.DoesNotExist:
        return Response({"success": False, "message": "Supplier not found"}, status=404)

    name = request.data.get("name")
    email = request.data.get("email")

    if name:
        supplier.name = name
    if email:
        supplier.contact = email
    supplier.save()

    return Response({"success": True, "message": "Supplier updated"})


@api_view(["DELETE"])
@permission_classes([AllowAny])
def delete_supplier(request, pk):
    try:
        supplier = Supplier.objects.get(pk=pk)
        supplier.delete()
        return Response({"success": True, "message": "Supplier deleted"})
    except Supplier.DoesNotExist:
        return Response({"success": False, "message": "Supplier not found"}, status=404)


# ---------- LIST PAYMENTS ----------
@api_view(["GET"])
@permission_classes([AllowAny])
@authentication_classes([])
def list_payments(request):
    payments = Payment.objects.select_related('order_id', 'order_id__customer_id').all()
    data = [
        {
            "payment_id": p.payment_id,
            "order_number": f"O-{p.order_id.order_id:04d}",
            "customer_name": p.order_id.customer_id.name,
            "amount": float(p.amount),
            "mode": p.payment_mode,
            "date": p.order_id.order_date.strftime("%Y-%m-%d"),
        }
        for p in payments
    ]
    return JsonResponse(data, safe=False)


class CreateOrderView(APIView):
    def post(self, request):
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class AddItemToOrderView(APIView):
    def post(self, request, order_id):
        order = Order.objects.get(order_id=order_id)
        serializer = OrderItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(order_id=order)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class CompleteSaleView(APIView):
    def post(self, request, order_id):
        try:
            order = Order.objects.get(order_id=order_id)
        except Order.DoesNotExist:
            return Response({"success": False, "message": "Order not found"}, status=404)

        payment_data = request.data.get('payment')
        payment_serializer = PaymentSerializer(data=payment_data)
        if payment_serializer.is_valid():
            payment = payment_serializer.save(order_id=order)
            order.status = 'completed'
            order.save()
            return Response({
                "success": True,
                "message": "Sale completed successfully",
                "payment": payment_serializer.data
            })
        return Response(payment_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Users
from .serializers import UserSerializer

@api_view(["GET"])
@permission_classes([AllowAny])
@authentication_classes([])
def list_users(request):
    users = Users.objects.all().order_by("pk")
    serializer = UserSerializer(users, many=True)
    # Serializer outputs id, username, email, role
    return Response(serializer.data)
@api_view(["GET", "PATCH", "DELETE"])
@permission_classes([AllowAny])
@authentication_classes([])  # adapt to your auth scheme in production
def user_detail(request, pk):
    try:
        user = Users.objects.get(pk=pk)
    except Users.DoesNotExist:
        return Response({"success": False, "message": "User not found"}, status=404)

    if request.method == "GET":
        serializer = UserSerializer(user)
        return Response(serializer.data)

    if request.method == "PATCH":
        data = request.data
        username = data.get("username")
        email = data.get("email")
        role = data.get("role")
        password = data.get("password", None)

        if username is not None:
            user.username = username
        if email is not None:
            user.email = email
        if role is not None:
            user.role = role
        if password is not None and password != "":
            # For production, hash passwords instead of storing plaintext.
            user.password = password

        try:
            user.save()
        except Exception as e:
            return Response({"success": False, "message": str(e)}, status=400)

        serializer = UserSerializer(user)
        return Response({"success": True, "user": serializer.data})

    if request.method == "DELETE":
        user.delete()
        return Response({"success": True, "message": "User deleted"})
    
@api_view(["POST"])
@permission_classes([AllowAny])
@authentication_classes([])
def create_user(request):
    data = request.data
    username = data.get("username")
    email = data.get("email")
    role = data.get("role")
    password = data.get("password")

    if not username or not email or not role or not password:
        return Response({"success": False, "message": "username, email, role and password are required"}, status=400)

    # Prevent duplicates
    if Users.objects.filter(username=username).exists():
        return Response({"success": False, "message": "Username already exists"}, status=400)
    if Users.objects.filter(email=email).exists():
        return Response({"success": False, "message": "Email already exists"}, status=400)

    user = Users.objects.create(username=username, email=email, password=password, role=role)
    serializer = UserSerializer(user)
    return Response({"success": True, "user": serializer.data}, status=201)
