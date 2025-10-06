from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework import serializers
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




class OrderListSerializer(serializers.ModelSerializer):
    order_number = serializers.IntegerField(source="order_id")
    customer_name = serializers.CharField(source="customer_id.name")
    total = serializers.DecimalField(source="amount", max_digits=10, decimal_places=2)
    created_at = serializers.DateField(source="order_date")  # matches model

    class Meta:
        model = Order
        fields = ["order_number", "customer_name", "total", "created_at"]