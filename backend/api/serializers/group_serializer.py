from rest_framework import serializers
from common.models import Group, GroupMembership
from .user_serializer import UserSerializer

class GroupSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Group
        fields = "__all__"
        
class GroupMembershipSerializer(serializers.ModelSerializer):
    
    id = serializers.UUIDField()
    user = UserSerializer()
    
    class Meta:
        model = GroupMembership
        fields = ["id", "user", "group"]