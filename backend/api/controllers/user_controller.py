from rest_framework.views import APIView
from rest_framework.response import Response
from api.serializers.user_serializer import UserPublicSerializer, UserSerializer
from api.serializers.post_serializer import PostSerializer
from rest_framework import status

from common.models import MUser, PostContent

from ..permissions import IsInGroup


# ユーザー詳細取得
class UserDetailView(APIView):

    permission_classes = [IsInGroup]

    def get(self, request, pk):
        user = MUser.objects.get(pk=pk)

        # ユーザーが自分自身の場合詳細情報を返す
        if user == request.user:
            serializer = UserSerializer(user)
            return Response(status=status.HTTP_200_OK, data=serializer.data)

        serializer = UserPublicSerializer(user)
        return Response(status=status.HTTP_200_OK, data=serializer.data)
    
    def put(self, request, pk):
        user = MUser.objects.get(pk=pk)
        if user != request.user:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK, data=serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ユーザーの投稿一覧取得
class UserListView(APIView):

    permission_classes = [IsInGroup]

    def get(self, request, pk):
        user = MUser.objects.get(pk=pk)
        queryset = PostContent.objects.filter(created_by=user)
        serializer = PostSerializer(queryset, many=True)
        return Response(status=status.HTTP_200_OK, data=serializer.data)
