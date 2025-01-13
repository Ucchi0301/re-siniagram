from django.db import models
from django_boost.models.mixins import UUIDModelMixin, TimeStampModelMixin
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.models import UserManager

from api.utils.image_compression import compress_image_to_webp

class MUser(AbstractBaseUser, PermissionsMixin, UUIDModelMixin, TimeStampModelMixin):
    username = models.CharField(max_length=255)
    avatar = models.ImageField()
    email = models.EmailField(unique=True)

    objects = UserManager()
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
    
    # 画像をwebp形式に変換して保存
    def save(self, *args, **kwargs):
        if self.avatar:
            self.image = compress_image_to_webp(self.image)
        super(PostContent, self).save(*args, **kwargs)

    class Meta:
        db_table = "m_user"


class PostContent(UUIDModelMixin, TimeStampModelMixin, models.Model):
    title = models.CharField(max_length=255)
    image = models.ImageField(blank=True, null=True)
    created_by = models.ForeignKey(
        MUser, related_name="postcontent", on_delete=models.CASCADE
    )
    
    # 画像をwebp形式に変換して保存
    def save(self, *args, **kwargs):
        if self.image:
            self.image = compress_image_to_webp(self.image)
        super(PostContent, self).save(*args, **kwargs)

    class Meta:
        db_table = "post_content"


class Group(UUIDModelMixin, models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    password = models.CharField(max_length=4)

    class Meta:
        db_table = "group"


# 　グループの中間テーブル
class GroupMembership(models.Model):
    user = models.OneToOneField(MUser, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)

    class Meta:
        db_table = "group_membership"
