from django.urls import path
from api.controllers.post_controller import PostListView, PostDetailView, RandomPostView
from api.controllers.group_controller import (
    UserJoiningGroupView,
    JoinGroupView,
    GroupUserListView,
    GroupCreateView,
    GroupUserDeleteView,
)

urlpatterns = [
    path("posts/", PostListView.as_view(), name="home"),
    path("posts/<uuid:pk>/", PostDetailView.as_view(), name="detail"),
    path("posts/random/", RandomPostView.as_view(), name="random"),
    path("groups/", UserJoiningGroupView.as_view(), name="group"),
    path("groups/create/", GroupCreateView.as_view(), name="group_create"),
    path("groups/join/", JoinGroupView.as_view()),
    path("groups/delete/", GroupUserDeleteView.as_view(), name="group_user_delete"),
    path("groups/users/", GroupUserListView.as_view(), name="group_users"),
]
