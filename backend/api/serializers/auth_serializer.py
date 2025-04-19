from rest_framework import serializers
from common.models import MUser


class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = MUser
        fields = ("email", "username", "password")
        extra_kwargs = {"password": {"write_only": True}}
