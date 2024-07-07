from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
<<<<<<< HEAD
from main.views import (
    PubViewSet, SucursalViewSet, TradeProposalViewSet, UserViewSet, SalesViewSet, CommentViewSet, BannerViewSet, RatingViewSet,
    CurrentUserView, CustomAuthToken, UpdatePasswordView, SendResetPasswordEmailView, PasswordResetConfirmView,
    StatisticsView, ProcessPaymentAPIView, return_pub_images_id, serve_publication_image, serve_branch_image,
    send_email, get_all_emails, save_discount_codes, verificar_codigo, borrar_codigo
)
=======
from main.views import PubViewSet, SucursalViewSet, TradeProposalViewSet, UserViewSet, SalesViewSet, CommentViewSet, BannerViewSet, RatingViewSet
from main.views import CurrentUserView, CustomAuthToken, UpdatePasswordView, SendResetPasswordEmailView, PasswordResetConfirmView, StatisticsView
from main.views import return_pub_images_id, serve_publication_image, serve_branch_image, send_email, get_all_emails, save_discount_codes, verificar_codigo, borrar_codigo
>>>>>>> f57fa45aa73ecb28caaeef8b92f270d6374a1c03

router = routers.DefaultRouter()
router.register('publications', PubViewSet, basename='publications')
router.register('users', UserViewSet, basename='users')
router.register('branches', SucursalViewSet, basename='branches')
router.register('proposals', TradeProposalViewSet, basename='proposals')
router.register('ventas', SalesViewSet, basename='ventas')
router.register('ads', BannerViewSet, basename='ads')
router.register('comments', CommentViewSet, basename='comments')
router.register('ratings', RatingViewSet)


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
    path('checkout/', ProcessPaymentAPIView.as_view(), name='checkout'),
    path('', include(router.urls)),
]
