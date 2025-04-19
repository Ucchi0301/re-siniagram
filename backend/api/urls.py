from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,  # ログイン
    TokenRefreshView,     # リフレッシュ
)
from api.controllers.post_controller import (
    PostListView,
    PostCreateView,
    PostDetailView,
    RandomPostView,
)
from api.controllers.group_controller import (
    IsUserInGroup,
    UserJoiningGroupView,
    JoinGroupView,
    GroupUserListView,
    GroupCreateView,
    GroupUserDeleteView,
)
from api.controllers.user_controller import (
    UserDetailView,
    UserListView,
    UserSelfView,
)
from api.controllers.auth_controller import (
    SignUpView,
)

urlpatterns = [
    path("posts/", PostListView.as_view(), name="home"),
    path("post/create/", PostCreateView.as_view(), name="create"),
    path("post/<uuid:pk>/", PostDetailView.as_view(), name="detail"),
    path("post/random/", RandomPostView.as_view(), name="random"),
    path("is_in_group/", IsUserInGroup.as_view(), name="group"),
    path("group/", UserJoiningGroupView.as_view(), name="group"),
    path("group/create/", GroupCreateView.as_view(), name="group_create"),
    path("group/join/", JoinGroupView.as_view()),
    path("group/delete/", GroupUserDeleteView.as_view(), name="group_user_delete"),
    path("group/users/", GroupUserListView.as_view(), name="group_users"),
    path("user/me/", UserSelfView.as_view(), name="user_me"),
    path("user/<uuid:pk>/", UserDetailView.as_view(), name="user_detail"),
    path("user/<uuid:pk>/posts/", UserListView.as_view(), name="user_posts"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("signup/", SignUpView.as_view(), name="signup")
]
