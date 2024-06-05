from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework import status
from rest_framework.decorators import action, api_view
from django.http import HttpResponse, Http404
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.urls import reverse
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView
from .models import Pub, User, Sucursal, TradeProposal, Photo, Venta
from .serializers import PubSerializer, UserSerializer, SucursalSerializer, TradeProposalSerializer, VentaSerializer
from .serializers import CurrentUserSerializer, CustomAuthTokenSerializer, UpdatePasswordSerializer
from django.core.mail import send_mail
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import requests
import os
from django.conf import settings

# ViewSets

class SendResetPasswordEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        email = data.get('email')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User with this email does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        token = default_token_generator.make_token(user)
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))

        frontend_base_url = 'http://localhost:4200/cambiar-contra'
        reset_link = f'{frontend_base_url}?uidb64={uidb64}&token={token}'

        body = {
            'subject': 'Password Reset',
            'message': f'Click the link to reset your password: {reset_link}',
            'recipient_list': [email]
        }

        # Make a POST request to the send_email endpoint
        send_email_url = request.build_absolute_uri(reverse('send_email'))
        response = requests.post(send_email_url, json=body)

        if response.status_code != 200:
            return Response({'error': 'Failed to send email'}, status=response.status_code)

        return Response({'message': 'Password reset link sent.'}, status=status.HTTP_200_OK)

class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            data = request.data
            new_password = data.get('password')
            user.set_password(new_password)
            user.save()
            return Response({'message': 'Password has been reset successfully.'}, status=status.HTTP_200_OK)

        return Response({'error': 'Invalid reset link.'}, status=status.HTTP_400_BAD_REQUEST)

class TradeProposalViewSet(viewsets.ModelViewSet):
    queryset = TradeProposal.objects.all()
    serializer_class = TradeProposalSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save()

    def update(self, request, *args, **kwargs):
        proposal = self.get_object()
        status = request.data.get('status')
        # TODO handle more statuses
        if status in ['accepted', 'rejected']:
            proposal.status = status
            proposal.save()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], url_path='by-sucursal')
    def get_by_sucursal(self, request):
        sucursal = request.query_params.get('sucursal')
        if sucursal is not None:
            trade_proposals = self.queryset.filter(suc=sucursal)
            serializer = self.get_serializer(trade_proposals, many=True)
            return Response(serializer.data)
        else:
            return Response({"error": "Sucursal not provided"}, status=status.HTTP_400_BAD_REQUEST)
        
    @api_view(['GET'])
    def get_trade_proposal_by_id(request, id):
        try:
            trade_proposal = TradeProposal.objects.get(id=id)
        except TradeProposal.DoesNotExist:
            return Response(status=404)
        
        serializer = TradeProposalSerializer(trade_proposal)
        return Response(serializer.data)
    


class SucursalViewSet(viewsets.ModelViewSet):
  queryset = Sucursal.objects.all()
  serializer_class = SucursalSerializer
  permission_classes = [IsAuthenticatedOrReadOnly]

  def create_sucursal(address, photos, phone):
    if not address or not photos or not phone:
      raise ValueError("Missing required fields. Please provide address, phone, and photos.")
    # Create the sucursal object
    suc = Sucursal(
        address=address,
        photos=photos,
        phone=phone,
        )
    # Save the sucursal to the database
    suc.save()
    return suc

  @api_view(['GET'])
  def get_all_sucursales(request):
    sucursales = Sucursal.objects.all()
    serializer = SucursalSerializer(sucursales, many=True)
    return Response(serializer.data)

class CurrentUserView(APIView):
  permission_classes = [IsAuthenticatedOrReadOnly]

  def get(self, request):
    serializer = CurrentUserSerializer(request.user)
    return Response(serializer.data)

  def put(self, request):
    serializer = CurrentUserSerializer(request.user, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)

class UserViewSet(viewsets.ModelViewSet):
  queryset = User.objects.all()
  serializer_class = UserSerializer

  def get_permissions(self):
    if self.action in ['create']:
      return [AllowAny()]
    return [IsAuthenticatedOrReadOnly()]

  def profile_by_username(self, request, username=None) -> Response:
    try:
        user = get_object_or_404(User, username=username)
        data = UserSerializer(user).data
        return Response(data)
    except User.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=404)

  def create(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    return Response({
      "user": serializer.data,
      "message": "Usuario creado exitosamente",
          }, status=status.HTTP_201_CREATED)

class PubViewSet(viewsets.ModelViewSet):
    queryset = Pub.objects.all()
    serializer_class = PubSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticatedOrReadOnly()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        pub = serializer.save()
        return Response({"id": pub.id, "message": "Publication created successfully"}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post', 'put'], permission_classes=[IsAuthenticated])
    def upload_photos(self, request, pk=None):
        try:
            pub = Pub.objects.get(pk=pk)
        except Pub.DoesNotExist:
            raise Http404('Publication not found')

        for file in request.FILES.getlist('photos'):
            Photo.objects.create(pub=pub, image=file)

        return Response({"message": "Photos updated successfully"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['delete'], permission_classes=[IsAuthenticated])
    def delete_photos(self, request, pk=None):
      try:
          pub = Pub.objects.get(pk=pk)
      except Pub.DoesNotExist:
          raise Http404('Publication not found')

      pub.photos.all().delete()

      return Response({"message": "Photos deleted successfully"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def get_user_publications(self, request, user=None):
        publications = Pub.objects.filter(user=user)
        serializer = self.get_serializer(publications, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def get_all_ids(self, request):
        ids = Pub.objects.values_list('id', flat=True)
        return Response(list(ids))

    @action(detail=True, methods=['put', 'patch'], permission_classes=[IsAuthenticated])
    def update_publication(self, request, pk=None):
        pub = self.get_object()
        partial = request.method == 'PATCH'
        serializer = self.get_serializer(pub, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "pub": serializer.data,
            "message": "Publication updated successfully",
        }, status=status.HTTP_200_OK)

    def perform_update(self, serializer):
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        pub = self.get_object()
        # Check if publication is part of an accepted trade proposal, in publications or proposed items
        if TradeProposal.objects.filter(status='accepted', publication=pub).exists() or pub.trade_proposals.filter(status='accepted').exists():
            return Response({"detail": "Cannot delete publication because it is part of an accepted trade proposal."}, status=status.HTTP_400_BAD_REQUEST)
        pub.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

## APIViews

class UpdatePasswordView(UpdateAPIView):
  """
  An endpoint for changing password.
  """
  serializer_class = UpdatePasswordSerializer
  model = User
  permission_classes = (IsAuthenticated)

  def get_object(self, queryset=None):
      obj = self.request.user
      return obj

  def update(self, request, *args, **kwargs):
      self.object = self.get_object()
      serializer = self.get_serializer(data=request.data)

      if serializer.is_valid():
          # Check old password
          if not self.object.check_password(serializer.data.get("old_password")):
              return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
          # set_password also hashes the password that the user will get
          self.object.set_password(serializer.data.get("new_password"))
          self.object.save()
          response = {
              'status': 'success',
              'code': status.HTTP_200_OK,
              'message': 'Password updated successfully',
              'data': []
          }

          return Response(response)

      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomAuthToken(ObtainAuthToken):
    user = get_user_model()
    serializer_class = CustomAuthTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        # created currently unused, but included for consistency with ObtainAuthToken, can't delete
        token, created = Token.objects.get_or_create(user=user)

        return Response({'token': token.key, 'user_id': user.id, 'username': user.username, 'email': user.email})

## functions

def serve_publication_image(request, pub_id, photo_id):
    try:
        pub = Pub.objects.get(pk=pub_id)
    except Pub.DoesNotExist:
        raise Http404('Publication not found')

    # Get the photos associated with the publication
    photos = Photo.objects.filter(pub=pub)

    # Ensure photos exist and the requested photo_id is within range
    if not photos.exists() or photo_id <= 0 or photo_id > photos.count():
        raise Http404('Photo not found')

    # Fetch the photo based on position (photo_id - 1 because photo_id is 1-based index)
    photo = photos[photo_id - 1]

    # Set appropriate content type (e.g., image/jpeg, image/png)
    content_type = 'image/jpeg, image/png, image/jpg'

    return HttpResponse(photo.image.read(), content_type=content_type)

def return_pub_images_id(request, pub_id):
      try:
          pub = Pub.objects.get(pk=pub_id)
          # Get all photos associated with the publication
          photos = Photo.objects.filter(pub=pub)
          # Return a list of integers representing the positions of the photos
          photo_positions = list(range(1, photos.count() + 1))
          return JsonResponse(photo_positions, safe=False)
      except Pub.DoesNotExist:
          return JsonResponse({'error': 'Publication not found'}, status=404)

def serve_branch_image(request, pk):
      try:
          suc= Sucursal.objects.get(pk=pk)
      except Sucursal.DoesNotExist:
          raise Http404('Sucursal no encontrada')

      # Validate user permissions if applicable (e.g., only authenticated users can access)
      if not suc.photos:
          # Handle case where no image is uploaded
          return Http404('No hay foto disponible')

      # Set appropriate content type (e.g., image/jpeg, image/png)
      content_type = 'image/jpeg, image/png, image/jpg'

      return HttpResponse(suc.photos.read(), content_type=content_type)

def request_reset_link(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data['email']
        user = User.objects.filter(email=email).first()
        if user:
            # Send password reset link to user's email
            user.send_password_reset_email()
            return JsonResponse({'message': 'Password reset link sent successfully'})
        return JsonResponse({'error': 'User not found'}, status=404)
    return JsonResponse({'error': 'Invalid request'}, status=400)

@csrf_exempt
def send_email(request):
        data = json.loads(request.body)
        subject = data['subject']
        message = data['message']
        recipient_list = data['recipient_list']
        send_mail(subject, message, '1francoagostinelli2000@gmail.com', recipient_list)
        return JsonResponse({'message': 'Email sent successfully'})

def get_all_emails(request):
        # Filtrar usuarios que quieren recibir correos
        emails = list(User.objects.filter(mailing=True).values_list('email', flat=True))
        return JsonResponse({'emails': emails})


@csrf_exempt
def save_discount_codes(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            code = data.get('code')
            description = data.get('description')
            new_entry = {"code": code, "description": description}

            # Ruta del archivo JSON
            file_path = settings.CODIGOS_JSON_PATH

            # Leer los datos existentes del archivo JSON si existe
            if os.path.exists(file_path):
                with open(file_path, 'r') as file:
                    try:
                        existing_data = json.load(file)
                    except json.JSONDecodeError:
                        existing_data = []
            else:
                existing_data = []

            # Agregar los nuevos datos a los datos existentes
            existing_data.append(new_entry)

            # Escribir los datos actualizados en el archivo JSON
            with open(file_path, 'w') as file:
                json.dump(existing_data, file, indent=4)

            return JsonResponse({'message': 'Datos guardados correctamente'}, status=201)
        except Exception as e:
            return JsonResponse({'error': f'Error al guardar los datos: {str(e)}'}, status=500)
    return JsonResponse({'error': 'Se requiere una solicitud POST'}, status=400)
@csrf_exempt
def verificar_codigo(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            codigo = data.get('codigo')

            # Ruta del archivo JSON
            file_path = settings.CODIGOS_JSON_PATH

            # Leer los datos existentes del archivo JSON si existe
            if os.path.exists(file_path):
                with open(file_path, 'r') as file:
                    try:
                        existing_data = json.load(file)
                    except json.JSONDecodeError:
                        existing_data = []
            else:
                existing_data = []

            # Buscar el código en los datos existentes
            descripcion = None
            for entry in existing_data:
                if entry.get('code') == codigo:
                    descripcion = entry.get('description')
                    break

            if descripcion:
                return JsonResponse({'descripcion': descripcion}, status=200)
            else:
                return JsonResponse({'error': 'Código de descuento no encontrado'}, status=404)
        except Exception as e:
            return JsonResponse({'error': f'Error al verificar el código de descuento: {str(e)}'}, status=500)
    return JsonResponse({'error': 'Se requiere una solicitud POST'}, status=400)

@api_view(['PUT'])
def update_trade_proposal(request, pk):
    try:
        trade_proposal = TradeProposal.objects.get(pk=pk)
    except TradeProposal.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = TradeProposalSerializer(trade_proposal, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
def borrar_codigo(request, codigo):
    if request.method == 'DELETE':
        try:
            # Ruta del archivo JSON
            file_path = settings.CODIGOS_JSON_PATH

            # Leer los datos existentes del archivo JSON si existe
            if os.path.exists(file_path):
                with open(file_path, 'r') as file:
                    try:
                        existing_data = json.load(file)
                    except json.JSONDecodeError:
                        existing_data = []
            else:
                existing_data = []

            # Eliminar la entrada correspondiente al código especificado
            updated_data = [entry for entry in existing_data if entry.get('code') != codigo]

            # Escribir los datos actualizados en el archivo JSON
            with open(file_path, 'w') as file:
                json.dump(updated_data, file, indent=4)

            return JsonResponse({'message': 'Código de descuento eliminado correctamente'}, status=200)
        except Exception as e:
            return JsonResponse({'error': f'Error al borrar el código de descuento: {str(e)}'}, status=500)
    return JsonResponse({'error': 'Se requiere una solicitud DELETE'}, status=400)


class VentaViewSet(viewsets.ModelViewSet):
    queryset = Venta.objects.all()
    serializer_class = VentaSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        venta = serializer.save()
        return Response({"id": venta.id, "message": "Venta created successfully"}, status=status.HTTP_201_CREATED)
