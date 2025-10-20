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
# ---------- LOGIN ----------
@method_decorator(csrf_exempt, name="dispatch")
@permission_classes([AllowAny])
class LoginView(APIView):
    """
    POST JSON payload:
    {
      "identifier": "username_or_email",
      "password": "plain_password",
      "role": "admin" | "cashier" | "manager"
    }

    Response on success:
    { "success": True, "token": "<hex>", "role": "admin" }

    Response on failure: 401 with message
    """
    def post(self, request):
        identifier = request.data.get("identifier")
        password = request.data.get("password")
        role = request.data.get("role")

        if not identifier or not password or not role:
            return Response({"success": False, "message": "identifier, password and role are required"}, status=400)

        # Find user by username or email
        user = None
        try:
            user = Users.objects.get(username=identifier)
        except Users.DoesNotExist:
            try:
                user = Users.objects.get(email=identifier)
            except Users.DoesNotExist:
                return Response({"success": False, "message": "Invalid username/email or password"}, status=401)

        # Check role (adjust field name if your column differs)
        stored_role = getattr(user, "role", None) or getattr(user, "user_type", None)
        if stored_role and str(stored_role).lower() != str(role).lower():
            return Response({"success": False, "message": "Role mismatch"}, status=401)

        # Password verification: try Django check_password first (for hashed),
        # fallback to plain-text compare if needed.
        stored_password = getattr(user, "password", "")
        password_ok = False
        try:
            if stored_password and check_password(password, stored_password):
                password_ok = True
        except Exception:
            password_ok = False

        if not password_ok:
            # fallback plain-text (only if your DB stores plain text)
            if stored_password == password:
                password_ok = True

        if not password_ok:
            return Response({"success": False, "message": "Invalid username/email or password"}, status=401)

        # Generate a simple token (not persisted). Frontend stores in localStorage.
        token = secrets.token_hex(24)

        return Response({
            "success": True,
            "token": token,
            "role": str(role).lower()
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
@api_view(["GET"])
@permission_classes([AllowAny])
@authentication_classes([])
def list_orders(request):
    orders = Order.objects.select_related("customer_id").all().order_by("-order_date")
    serializer = OrderListSerializer(orders, many=True)
    return Response(serializer.data)


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


# ---------- LIST SUPPLIERS ----------
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
