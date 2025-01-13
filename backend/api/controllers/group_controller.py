from rest_framework.views import APIView
from rest_framework.response import Response
from common.models import Group, GroupMembership
from ..serializers.group_serializer import GroupSerializer, GroupMembershipSerializer
from api.exceptions import GroupAlreadyJoinedException, GroupNotFoundException
from ..permissions import IsInGroup


class GroupListView(APIView):
    permission_classes = [IsInGroup]

    def get(self, request):
        queryset = Group.objects.all()
        serializer = GroupSerializer(queryset, many=True)
        return Response(data=serializer.data)

    def post(self, request):
        serializer = GroupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data)
        return Response(serializer.errors)


class JoinGroupView(APIView):
    permission_classes = [IsInGroup]

    def post(self, request):
        group_id = request.data.get("id")
        group = Group.objects.filter(id=group_id).first()
        if GroupMembership.objects.filter(user=request.user).exists():
            raise GroupAlreadyJoinedException
        if group is None:
            raise GroupNotFoundException
        user_group = GroupMembership.objects.create(user=request.user, group=group)
        serializer = GroupMembershipSerializer(user_group)
        return Response(serializer.data)


class GroupUserListView(APIView):
    permission_classes = [IsInGroup]

    def get(self, request):
        group_membership = GroupMembership.objects.filter(user=request.user).first()
        group_id = group_membership.group.id
        memberships = GroupMembership.objects.filter(group_id=group_id)
        serializer = GroupMembershipSerializer(memberships, many=True)
        return Response(serializer.data)
