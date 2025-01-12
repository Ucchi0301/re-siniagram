from django.db import models
from django_boost.models.mixins import UUIDModelMixin, TimeStampModelMixin
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.models import UserManager


class MUser(AbstractBaseUser, PermissionsMixin, UUIDModelMixin, TimeStampModelMixin):
    username = models.CharField(max_length=255)
    avatar = models.ImageField()
    email = models.EmailField(unique=True)
    
    objects = UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    class Meta:
        db_table = "m_user"
    
    
class PostContent(UUIDModelMixin, TimeStampModelMixin, models.Model):
    title = models.CharField(max_length=255)
    image = models.ImageField(blank=True, null=True)
    created_by = models.ForeignKey(MUser, related_name="postcontent", on_delete=models.CASCADE)
    
    class Meta:
        db_table = "post_content"
        

class Group(UUIDModelMixin, models.Model):
    name = models.CharField(max_length=100)
    class Meta:
        db_table = "group" 
        
        
class GroupMembership(models.Model):
    user = models.OneToOneField(MUser, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    class Meta:
        db_table = "group_membership"