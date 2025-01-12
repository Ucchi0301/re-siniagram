from django.urls import path
from api.controllers.post_controller import PostView

urlpatterns = [
    path("posts/", PostView.as_view(), name="home"),
]