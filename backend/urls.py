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
from django.urls import path, include
from rest_framework import routers
from main.views import PubViewSet, SucursalViewSet, TradeProposalViewSet, UserViewSet, SalesViewSet
from main.views import CurrentUserView, CustomAuthToken, UpdatePasswordView, SendResetPasswordEmailView, PasswordResetConfirmView, StatisticsView
from main.views import return_pub_images_id, serve_publication_image, serve_branch_image, send_email, get_all_emails, save_discount_codes, verificar_codigo, borrar_codigo

router = routers.DefaultRouter()
router.register('publications', PubViewSet, basename='publications' )
router.register('users', UserViewSet, basename='users' )
router.register('branches', SucursalViewSet, basename='branches' )
router.register('proposals', TradeProposalViewSet, basename='proposals' )
router.register('ventas', SalesViewSet, basename='ventas')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('publications/<int:pub_id>/photos/', return_pub_images_id, name='publication_image'),
    path('publications/<int:pub_id>/photos/<int:photo_id>/', serve_publication_image, name='serve_specific_image'),
    path('branches/<int:pk>/photos/', serve_branch_image, name='branch_image'),
    path('statistics/', StatisticsView.as_view(), name='statistics'),
    path('statistics/sucursal/<int:sucursal_id>/', StatisticsView.as_view(), name='sucursal_statistics'),
    path('api-token-auth/', CustomAuthToken.as_view(), name='api_token_auth'),
    path('users/current/', CurrentUserView.as_view(), name='current_user'),
    path('profiles/<str:username>/', UserViewSet.as_view({'get': 'profile_by_username'}), name='profile-by-username'),
    path('publications-by/<int:user>/', PubViewSet.as_view({'get': 'get_user_publications'}), name='publications-by-user'),
    path('users/change-password/', UpdatePasswordView.as_view(), name='change_password'),
    path('send-email/', send_email, name='send_email'),
    path('get-all-emails/', get_all_emails, name='get_all_emails'),
    path('save-discount-codes/', save_discount_codes, name='save_discount_codes'),
    path('reset-password/', SendResetPasswordEmailView.as_view(), name='send_reset_password_email'),
    path('reset-password/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('verificar-codigo/', verificar_codigo, name='verificar_codigo'),
    path('borrar-codigo/<str:codigo>/', borrar_codigo, name='borrar_codigo'),
    path('', include(router.urls)),
] + router.urls
