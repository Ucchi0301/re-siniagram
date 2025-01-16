from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from django.urls.conf import include
from django.views.generic import TemplateView

#swaggerの設定
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
   openapi.Info(
      title="Re-siniagram",
      default_version='v1',
      description="Test description",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@yourapi.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("accounts/", include("allauth.urls")),
    path("api/", include("api.urls")),
    path("", TemplateView.as_view(template_name="sinia_home.html"), name="home"),
    path(
        "post_content/",
        TemplateView.as_view(template_name="post_content.html"),
        name="post",
    ),
    path(
        "group_top/",
        TemplateView.as_view(template_name="group_top.html"),
        name="post",
    ),
    path(
        "group_create/",
        TemplateView.as_view(template_name="group_create.html"),
        name="post",
    ),
    path(
        "group_join/",
        TemplateView.as_view(template_name="group_join.html"),
        name="post",
    ),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0),
         name='schema-swagger-ui'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
