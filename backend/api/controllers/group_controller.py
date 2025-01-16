from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from common.models import Group, GroupMembership
from ..serializers.group_serializer import GroupSerializer, GroupMembershipSerializer
from api.exceptions import (
    GroupAlreadyJoinedException,
    GroupNotFoundException,
    PasswordOrIdException,
    UserNotInGroupException,
)
from ..permissions import IsInGroup



# ユーザーがグループに所属しているかを確認
@swagger_auto_schema(
        responses={status.HTTP_200_OK: openapi.Response("Success")},
    )
class IsUserInGroup(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        # ユーザーがグループに所属しているかを確認
        group_membership = GroupMembership.objects.filter(user=request.user).first()
        
        # ユーザーがグループに所属している場合
        if group_membership:
            return Response({'is_user_in_group': True}, status=status.HTTP_200_OK)
        
        # ユーザーがグループに所属していない場合
        return Response({'is_user_in_group': False}, status=status.HTTP_200_OK)


# ユーザーが所属しているグループ情報を取得
@swagger_auto_schema(
        responses={status.HTTP_200_OK: openapi.Response("Success", GroupSerializer())},
    )
class UserJoiningGroupView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        group_membership = GroupMembership.objects.filter(user=request.user).first()
        # グループに所属していない場合
        if group_membership is None:
            raise UserNotInGroupException
        group = group_membership.group
        serializer = GroupSerializer(group)
        return Response(data=serializer.data)


# グループを作成
@swagger_auto_schema(
    responses={201: GroupSerializer()},
)
class GroupCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = GroupSerializer(data=request.data)
        if serializer.is_valid():
            group = serializer.save()
            # ユーザーを作成したグループに自動で参加させる
            GroupMembership.objects.create(user=request.user, group=group)
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# グループに参加
@swagger_auto_schema(
    responses={200: GroupMembershipSerializer()},
)
class JoinGroupView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        group_id = request.data.get("id")
        group = Group.objects.filter(id=group_id).first()

        # 　グループにすでに所属しているか確認
        if GroupMembership.objects.filter(user=request.user).exists():
            raise GroupAlreadyJoinedException
        # 　グループが存在するか確認
        if group is None:
            raise GroupNotFoundException
        # パスワードが正しいか確認
        if request.data.get("password") != group.password:
            raise PasswordOrIdException

        user_group = GroupMembership.objects.create(user=request.user, group=group)
        serializer = GroupMembershipSerializer(user_group)
        return Response(serializer.data)


# グループに所属しているユーザーを取得
@swagger_auto_schema(
    responses={200: GroupMembershipSerializer(many=True)},
)
class GroupUserListView(APIView):
    permission_classes = [IsInGroup]

    def get(self, request):
        group_membership = GroupMembership.objects.filter(user=request.user).first()
        group_id = group_membership.group.id
        memberships = GroupMembership.objects.filter(group_id=group_id)
        serializer = GroupMembershipSerializer(memberships, many=True)
        return Response(serializer.data)


# テスト用にグループに所属している状態を削除
@swagger_auto_schema(
    responses={200: "OK"},
)
class GroupUserDeleteView(APIView):
    permission_classes = [IsInGroup]

    def delete(self, request):
        group_membership = GroupMembership.objects.filter(user=request.user).first()
        group_membership.delete()
        return Response(status=status.HTTP_200_OK)
