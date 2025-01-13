from rest_framework.views import APIView
from rest_framework.response import Response
from api.serializers.post_serializer import PostSerializer
from rest_framework import status

from common.models import PostContent, GroupMembership, Group

from ..permissions import IsInGroup


# ユーザーが所属しているグループのユーザー一覧取得
def get_group_users(user) -> list:
    group_membership = GroupMembership.objects.filter(user=user).first()
    group_id = group_membership.group.id
    group_users = GroupMembership.objects.filter(group_id=group_id).values_list(
        "user", flat=True
    )
    return group_users


# 投稿一覧取得
class PostListView(APIView):

    permission_classes = [IsInGroup]

    def get(self, request):
        group_users = get_group_users(request.user)
        queryset = PostContent.objects.filter(created_by__in=group_users)
        serializer = PostSerializer(queryset, many=True)
        return Response(status=status.HTTP_200_OK, data=serializer.data)


# 投稿作成
class PostCreateView(APIView):

    permission_classes = [IsInGroup]

    def post(self, request):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(status=status.HTTP_201_CREATED, data=serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 投稿詳細取得、更新、削除
class PostDetailView(APIView):

    permission_classes = [IsInGroup]

    def get(self, request, pk):
        queryset = PostContent.objects.get(pk=pk)
        serializer = PostSerializer(queryset)
        return Response(status=status.HTTP_200_OK, data=serializer.data)

    def put(self, request, pk):
        queryset = PostContent.objects.get(pk=pk, created_by=request.user)
        serializer = PostSerializer(queryset, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK, data=serializer.data)
        return Response(serializer.errors)

    def delete(self, request, pk):
        queryset = PostContent.objects.get(pk=pk, created_by=request.user)
        queryset.delete()
        return Response(status=status.HTTP_200_OK)


# ランダムな投稿取得
class RandomPostView(APIView):

    permission_classes = [IsInGroup]

    def get(self, request):
        group_users = get_group_users(request.user)
        queryset = PostContent.objects.filter(created_by__in=group_users).order_by("?").first()
        serializer = PostSerializer(queryset)
        return Response(status=status.HTTP_200_OK, data=serializer.data)
