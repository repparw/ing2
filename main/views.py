from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework import status
from rest_framework.decorators import action, api_view
from django.http import HttpResponse, Http404
from django.contrib.auth import get_user_model
from .models import Pub, User, Sucursal
from .serializers import CurrentUserSerializer, CustomAuthTokenSerializer, PubSerializer, UpdatePasswordSerializer, UserSerializer, SucursalSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView
from django.core.mail import send_mail
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# Create your views here.

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

def serve_publication_image(request, pk):
      try:
          pub= Pub.objects.get(pk=pk)
      except Pub.DoesNotExist:
          raise Http404('Publicacion no encontrada')

      # Validate user permissions if applicable (e.g., only authenticated users can access)
      if not pub.photos:
          # Handle case where no image is uploaded
          return HttpResponse('No hay foto disponible', status=404)

      # Set appropriate content type (e.g., image/jpeg, image/png)
      content_type = 'image/jpeg, image/png, image/jpg'

      return HttpResponse(pub.photos.read(), content_type=content_type)

def serve_branch_image(request, pk):
      try:
          suc= Sucursal.objects.get(pk=pk)
      except Sucursal.DoesNotExist:
          raise Http404('Sucursal no encontrada')

      # Validate user permissions if applicable (e.g., only authenticated users can access)
      if not suc.photos:
          # Handle case where no image is uploaded
          return HttpResponse('No hay foto disponible', status=404)

      # Set appropriate content type (e.g., image/jpeg, image/png)
      content_type = 'image/jpeg, image/png, image/jpg'

      return HttpResponse(suc.photos.read(), content_type=content_type)

class CustomAuthToken(ObtainAuthToken):
    user = get_user_model()
    serializer_class = CustomAuthTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'user_id': user.id, 'username': user.username, 'email': user.email})

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

  def get_user_publications(self, request, user=None):
    publications = Pub.objects.filter(user=user)
    serializer = self.get_serializer(publications, many=True)
    return Response(serializer.data)

  def get_all_ids():
    return Pub.objects.values_list('id', flat=True)


  @action(methods=['put', 'patch'], detail=True, permission_classes=[IsAuthenticated])
  def put(self, request, pk=None):
      pub = self.get_object()
      partial = request.method == 'PATCH'
      serializer = self.get_serializer(pub, data=request.data, partial=partial)
      serializer.is_valid(raise_exception=True)
      return Response({
        "pub": serializer.data,
        "message": "usuario creado exitosamente",
            }, status=status.http_201_created)

  def perform_update(self, serializer):
          serializer.save()

  def update_publication(pub_id, title, desc, user, photos, is_paused, price, category, desired):
    """
    This function updates an existing publication object and saves it to the database.
    Args:
        pub_id (int): The ID of the publication to update.
        title (str): The new title of the publication.
        desc (str): The new description of the publication.
        user (User object): The new user who created the publication.
        photos (File object): The new image file for the publication (optional).
        is_paused (bool): Whether the publication is paused (not visible).
        price (float): The new price of the publication (optional).
        category (str): The new category of the publication.
        desired (str): The new desired outcome of the publication (optional).
    Returns:
        Pub object: The updated publication object.
    Raises:
        ValueError: If the publication with the given ID does not exist.
    """
    # Get the publication object with the given ID
    try:
      pub = Pub.objects.get(id=pub_id)
    except Pub.DoesNotExist:
      raise ValueError(f"Publication with ID {pub_id} does not exist.")
    # Update the publication object
    pub.title = title
    pub.desc = desc
    pub.photos = photos
    pub.is_paused = is_paused
    pub.category = category
    # Save the updated publication to the database
    pub.save(update_fields=['title', 'desc', 'photos', 'is_paused', 'desired'])

    return pub

  def create_publication(title, desc, user, photos, is_paused, price, category, desired):
    """
    This function creates a new publication object and saves it to the database.

    Args:
        title (str): The title of the publication.
        desc (str): The description of the publication (up to 1000 characters).
        user (User object): The user who created the publication.
        photos (File object): The image file for the publication (optional).
        is_paused (bool): Whether the publication is paused (not visible).
        price (float): The price of the publication (optional).
        category (str): The category of the publication.
        desired (str): The desired outcome of the publication (optional).

    Returns:
        Pub object: The newly created publication object.

    Raises:
        ValueError: If any of the required fields (title, desc, user, category) are missing.
    """

    if not title or not desc or not user or not category:
      raise ValueError("Missing required fields. Please provide title, description, user, and category.")

    # Create the publication object
    pub = Pub(
        title=title,
        desc=desc,
        user=user,
        photos=photos,
        is_paused=is_paused,
        price=price,
        category=category,
        desired=desired
    )

    # Save the publication to the database
    pub.save()

    return pub

@csrf_exempt
def send_email(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        subject = data['subject']
        message = data['message']
        recipient_list = data['recipient_list']

        send_mail(subject, message, 'tu_correo@gmail.com', recipient_list)
        return JsonResponse({'message': 'Email sent successfully'})
    return JsonResponse({'error': 'Invalid request'}, status=400)