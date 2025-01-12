from django.urls import path
from api.controllers.post_controller import PostListView, PostDetailView, RandomPostView

urlpatterns = [
    path("posts/", PostListView.as_view(), name="home"),
    path("posts/<uuid:pk>/", PostDetailView.as_view(), name="detail"),
    path("posts/random/", RandomPostView.as_view(), name="random"),
]