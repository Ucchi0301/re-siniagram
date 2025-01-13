from django.urls import path
from api.controllers.post_controller import (
    PostListView, 
    PostCreateView,
    PostDetailView, 
    RandomPostView,
    )
from api.controllers.group_controller import (
    UserJoiningGroupView,
    JoinGroupView,
    GroupUserListView,
    GroupCreateView,
    GroupUserDeleteView,
)
from api.controllers.user_controller import (
    UserDetailView,
    UserListView,
)

urlpatterns = [
    path("posts/", PostListView.as_view(), name="home"),
    path("post/create/", PostCreateView.as_view(), name="create"),
    path("post/<uuid:pk>/", PostDetailView.as_view(), name="detail"),
    path("post/random/", RandomPostView.as_view(), name="random"),
    path("group/", UserJoiningGroupView.as_view(), name="group"),
    path("group/create/", GroupCreateView.as_view(), name="group_create"),
    path("group/join/", JoinGroupView.as_view()),
    path("group/delete/", GroupUserDeleteView.as_view(), name="group_user_delete"),
    path("group/users/", GroupUserListView.as_view(), name="group_users"),
    path("user/<uuid:pk>/", UserDetailView.as_view(), name="user_detail"),
    path("user/<uuid:pk>/posts/", UserListView.as_view(), name="user_posts"),
]
