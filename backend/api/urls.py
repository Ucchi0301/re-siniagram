from django.urls import path
from api.controllers.post_controller import PostListView, PostDetailView, RandomPostView
from api.controllers.group_controller import (
    GroupListView,
    JoinGroupView,
    GroupUserListView,
    GroupCreateView,
)

urlpatterns = [
    path("posts/", PostListView.as_view(), name="home"),
    path("posts/<uuid:pk>/", PostDetailView.as_view(), name="detail"),
    path("posts/random/", RandomPostView.as_view(), name="random"),
    path("groups/", GroupListView.as_view(), name="group"),
    path("groups/create/", GroupCreateView.as_view(), name="group_create"),
    path("groups/join/", JoinGroupView.as_view()),
    path("groups/users/", GroupUserListView.as_view(), name="group_users"),
]
