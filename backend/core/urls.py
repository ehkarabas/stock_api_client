"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('auth/', include('djoser.social.urls')),
    path('auth/', include('accounts.urls')),
    path('stock/', include('stock.urls')),
]
custom_urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('djoser.urls.jwt')),
    path('auth/', include('djoser.social.urls')),
    path('auth/', include('accounts.urls')),
    path('stock/', include('stock.urls')),
]
from django.conf import settings
from django.conf.urls.static import static
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
from django.urls import re_path
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework.permissions import AllowAny

schema_view = get_schema_view(
   openapi.Info(
      title = "Stock API",
      
      description = "Email-Password authentication endpoints had to be ignored in Swagger and Redoc due to 'djoser.views.UserViewSet' incompatibility with drf-yasg module.",
      default_version = 'v1.0',
      contact = openapi.Contact(email="ehkarabas@gmail.com"),
      license = openapi.License(name="BSD License"),
   ),
   patterns=custom_urlpatterns,
   public = True,
   permission_classes = [AllowAny],
)

urlpatterns += [
   re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
   re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
   re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
   path('__debug__/', include('debug_toolbar.urls')), 
]

from decouple import config
ENVIRONMENT = config('ENV')

if ENVIRONMENT=='backendWithTemplates':
    from django.views.generic import TemplateView
    urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name="index.html"))]

