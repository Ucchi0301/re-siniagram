from rest_framework.views import APIView
from rest_framework.response import Response
from common.models import Group, GroupMembership
from rest_framework.permissions import IsAuthenticated
from ..serializers.group_serializer import GroupSerializer, GroupMembershipSerializer
from api.exceptions import (
    GroupAlreadyJoinedException,
    GroupNotFoundException,
    PasswordOrIdException,
)
from ..permissions import IsInGroup


# グループを取得 管理者のみに設定する必要ありか不必要
class GroupListView(APIView):
    permission_classes = [IsInGroup]

    def get(self, request):
        queryset = Group.objects.all()
        serializer = GroupSerializer(queryset, many=True)
        return Response(data=serializer.data)


# グループを作成
class GroupCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = GroupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data)
        return Response(serializer.errors)


# グループに参加
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
class GroupUserListView(APIView):
    permission_classes = [IsInGroup]

    def get(self, request):
        group_membership = GroupMembership.objects.filter(user=request.user).first()
        group_id = group_membership.group.id
        memberships = GroupMembership.objects.filter(group_id=group_id)
        serializer = GroupMembershipSerializer(memberships, many=True)
        return Response(serializer.data)
