# backend/api/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import permission_classes

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
