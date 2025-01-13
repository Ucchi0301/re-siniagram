from django.http import HttpRequest
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from common.models import GroupMembership


class IsInGroup(IsAuthenticated):
    def has_permission(self, request: HttpRequest, view: APIView) -> bool:

        if not super().has_permission(request, view):
            return False

        # グループに所属しているか確認
        if GroupMembership.objects.filter(user=request.user).first():
            return True

        else:
            return False
