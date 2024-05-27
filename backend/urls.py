"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
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
from django.urls import path
from rest_framework import routers
from main.views import  CurrentUserView, CustomAuthToken, PubViewSet, SucursalViewSet, TradeProposalViewSet, UpdatePasswordView, UserViewSet, serve_publication_image, serve_branch_image, send_email

router = routers.DefaultRouter()
router.register('publications', PubViewSet, basename='publications' )
router.register('users', UserViewSet, basename='users' )
router.register('branches', SucursalViewSet, basename='branches' )
router.register('proposals', TradeProposalViewSet, basename='proposals' )

urlpatterns = [
    path('admin/', admin.site.urls),
    path('publications/<int:pk>/photos/', serve_publication_image, name='publication_image'),
    path('branches/<int:pk>/photos/', serve_branch_image, name='branch_image'),
    path('api-token-auth/', CustomAuthToken.as_view(), name='api_token_auth'),
    path('users/current/', CurrentUserView.as_view(), name='current_user'),
    path('profiles/<str:username>/', UserViewSet.as_view({'get': 'profile_by_username'}), name='profile-by-username'),
    path('publications-by/<int:user>/', PubViewSet.as_view({'get': 'get_user_publications'}), name='publications-by-user'),
    path('users/change-password/', UpdatePasswordView.as_view(), name='change_password'),
    path('send-email/', send_email, name='send_email')
] + router.urls
