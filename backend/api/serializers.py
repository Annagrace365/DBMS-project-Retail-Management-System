from rest_framework import serializers
from django.contrib.auth.models import User
# from rest_framework import serializers
from .models import Customer

from .models import Order
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class CustomerSerializer(serializers.ModelSerializer):
    # read-only fields provided by view annotation
    orders_count = serializers.IntegerField(read_only=True)
    last_order_date = serializers.DateField(read_only=True, allow_null=True, format="%Y-%m-%d")

    class Meta:
        model = Customer
        # expose customer_id as "id" for frontend convenience
        fields = ("customer_id", "name", "address", "phone", "orders_count", "last_order_date")
        extra_kwargs = {
            "customer_id": {"read_only": True}
        }

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        # rename customer_id -> id (so your frontend columns match easily)
        rep["id"] = rep.pop("customer_id")
        return rep

from rest_framework import serializers
from .models import Users

class UserSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="pk", read_only=True)
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Users
        fields = ("id", "username", "email", "role", "password")



class OrderListSerializer(serializers.ModelSerializer):
    order_number = serializers.IntegerField(source="order_id")
    customer_name = serializers.CharField(source="customer_id.name")
    cashier_name = serializers.CharField(source="cashier.username", default="-")
    total = serializers.DecimalField(source="amount", max_digits=10, decimal_places=2)
    status = serializers.CharField()
    created_at = serializers.DateField(source="order_date")  # matches model

    class Meta:
        model = Order
        fields = ["order_number", "customer_name", "cashier_name", "total", "status", "created_at"]



from .models import Order, OrderItem, Payment, Users

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product_id', 'name', 'price', 'quantity']

class OrderSerializer(serializers.ModelSerializer):
    customer_id = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all())
    cashier = serializers.PrimaryKeyRelatedField(queryset=Users.objects.all(), required=False)
    order_items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['order_id', 'customer_id', 'cashier', 'order_date', 'amount', 'subtotal', 'tax', 'status', 'order_items']
        read_only_fields = ['order_id', 'order_date']

    def create(self, validated_data):
        order_items_data = validated_data.pop('order_items', [])
        order = Order.objects.create(**validated_data)
        for item_data in order_items_data:
            OrderItem.objects.create(order_id=order, **item_data)
        return order


class PaymentSerializer(serializers.ModelSerializer):
    order_id = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all())

    class Meta:
        model = Payment
        fields = ['payment_id', 'order_id', 'amount', 'payment_mode']
        read_only_fields = ['payment_id']
