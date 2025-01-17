from rest_framework import serializers
from common.models import MUser


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = MUser
        fields = ["id", "username", "avatar", "email", "click_count"]


class UserPublicSerializer(serializers.ModelSerializer):

    class Meta:
        model = MUser
        fields = ["username", "avatar", "click_count"]
