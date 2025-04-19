from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from drf_yasg.utils import swagger_auto_schema
from rest_framework_simplejwt.tokens import RefreshToken
from ..serializers.auth_serializer import SignUpSerializer
from ..serializers.user_serializer import UserSerializer
from common.models import MUser 


class SignUpView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(request_body=SignUpSerializer, responses={201: UserSerializer})
    def post(self, request):
        serializer = SignUpSerializer(data=request.data)
        if serializer.is_valid():
            # 🔥 明示的にデータベースへ保存（create_userでハッシュ）
            user = MUser.objects.create_user(
                email=serializer.validated_data["email"],
                username=serializer.validated_data["username"],
                password=serializer.validated_data["password"]
            )

            refresh = RefreshToken.for_user(user)

            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
