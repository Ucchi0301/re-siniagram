from rest_framework import serializers
from common.models import PostContent
from .user_serializer import UserSerializer


class PostSerializer(serializers.ModelSerializer):

    created_by = UserSerializer(read_only=True)

    class Meta:
        model = PostContent
        fields = ["id", "image", "created_by", "created_at"]
