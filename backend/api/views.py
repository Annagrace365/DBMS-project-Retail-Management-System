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
 # adjust if needed


from .models import Order, OrderItem, Product, Customer, Payment

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