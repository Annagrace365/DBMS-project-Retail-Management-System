# backend/api/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import permission_classes, authentication_classes
from datetime import date, timedelta
from django.db.models import Sum, F
from rest_framework.decorators import api_view, permission_classes
from rest_framework import generics, permissions, status
from django.db.models import Count, Max
from rest_framework.response import Response
from .models import Customer, Order
from .serializers import CustomerSerializer # adjust if needed
from .models import Order
from .serializers import OrderListSerializer
from .models import Order, OrderItem, Product, Customer, Payment
from django.http import JsonResponse
from .models import Product, ProductSupplier
from .models import Supplier, Payment


@permission_classes([AllowAny])
class LoginView(APIView):
    """
    Login API: Authenticate a user and return a token.
    """
    @csrf_exempt
    def post(self, request):
        username = request.data.get("username")  # or 'email' if you prefer
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        if user:
            # Create or get token
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"success": True, "token": token.key})
        else:
            return Response({"success": False, "message": "Invalid credentials"}, status=401)

@api_view(['GET'])
@permission_classes([AllowAny])
@authentication_classes([])
def admin_kpis(request):
    today = date.today()
    
    # 1) Today's sales
    today_sales_agg = Order.objects.filter(order_date=today).aggregate(total=Sum('amount'))
    today_sales = float(today_sales_agg['total'] or 0)

    # 2) Total orders today
    total_orders_today = Order.objects.filter(order_date=today).count()

    # 3) Low stock count
    LOW_STOCK_THRESHOLD = 5
    low_stock_count = Product.objects.filter(stock__lt=LOW_STOCK_THRESHOLD).count()

    # 4) Active customers (orders in last 30 days)
    thirty_days_ago = today - timedelta(days=30)
    active_customers = Customer.objects.filter(order__order_date__gte=thirty_days_ago).distinct().count()

    # 5) Top products by quantity sold
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

    # 6) Recent orders
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


@authentication_classes([])
class AdminCustomerListCreate(generics.ListCreateAPIView):
    """
    GET  /api/admin/customers/  -> list customers with orders_count & last_order_date
    POST /api/admin/customers/  -> create a new customer (name, address, phone)
    """
    permission_classes = [permissions.AllowAny]  # change to IsAuthenticated or IsAdminUser in prod
    serializer_class = CustomerSerializer

    def get_queryset(self):
        # annotate orders_count and last_order_date from related Order model
        qs = Customer.objects.annotate(
            orders_count=Count("order"),
            last_order_date=Max("order__order_date")
        ).order_by("-last_order_date", "-customer_id")
        return qs

    def create(self, request, *args, **kwargs):
        # standard create behavior but return serialized annotated representation
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        # re-fetch the created instance with annotations for consistent response
        instance = Customer.objects.filter(pk=serializer.instance.pk).annotate(
            orders_count=Count("order"),
            last_order_date=Max("order__order_date")
        ).first()
        out = CustomerSerializer(instance).data
        return Response(out, status=status.HTTP_201_CREATED)

@api_view(["GET"])
@permission_classes([AllowAny])  # allow access without auth
@authentication_classes([])
def list_orders(request):
    orders = Order.objects.select_related("customer_id").all().order_by("-order_date")
    serializer = OrderListSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([AllowAny])  # allow access without auth
@authentication_classes([])
def list_products(request):
    """
    Return all products with stock, price, and supplier names.
    """
    # Prefetch suppliers to avoid N+1 queries
    products = Product.objects.prefetch_related('productsupplier_set__supplier_id').all()
    data = []

    for product in products:
        suppliers = [ps.supplier_id.name for ps in product.productsupplier_set.all()]
        data.append({
            "product_id": product.product_id,
            "sku": f"P-{product.product_id:04d}",   # optional SKU
            "name": product.name,
            "price": float(product.price),
            "stock": product.stock,
            "supplier_name": ", ".join(suppliers) if suppliers else "-",
        })

    return JsonResponse(data, safe=False)


def list_suppliers(request):
    """
    Return all suppliers with contact info.
    """
    suppliers = Supplier.objects.all()
    data = []

    for supplier in suppliers:
        data.append({
            "supplier_id": supplier.supplier_id,
            "name": supplier.name,
            "contact": supplier.contact,
            "phone": getattr(supplier, "phone", ""),  # optional field if you add later
            "email": getattr(supplier, "email", ""),  # optional field if you add later
        })

    return JsonResponse(data, safe=False)

def list_payments(request):
    """
    Return all payments with related order and customer info.
    """
    payments = Payment.objects.select_related('order_id', 'order_id__customer_id').all()
    data = []

    for p in payments:
        data.append({
            "payment_id": p.payment_id,
            "order_number": f"O-{p.order_id.order_id:04d}",  # optional order formatting
            "customer_name": p.order_id.customer_id.name,
            "amount": float(p.amount),
            "mode": p.payment_mode,
            "date": p.order_id.order_date.strftime("%Y-%m-%d"),
        })

    return JsonResponse(data, safe=False)