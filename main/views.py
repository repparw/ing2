from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.views import APIView
from rest_framework import status
from django.http import HttpResponse, Http404
from .models import Pub, User, Sucursal
from .serializers import PubSerializer, UserSerializer, SucursalSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated

# Create your views here.

class SucursalViewSet(viewsets.ModelViewSet):
  queryset = Sucursal.objects.all()
  serializer_class = SucursalSerializer

def create_sucursal(address, phone, email, city):
  if not address or not phone or not email or not city:
    raise ValueError("Missing required fields. Please provide name, address, phone, email, and city.")
  # Create the sucursal object
  suc = Sucursal(
      address=address,
      phone=phone,
      email=email,
      city=city)
  # Save the sucursal to the database
  suc.save()
  return suc

class UserViewSet(viewsets.ModelViewSet):
  queryset = User.objects.all()
  serializer_class = UserSerializer

  def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

def create_user(name,dni, email, password, date, mailing, rating, suc, is_employee):
  if not name or not dni or not email or not password or not date or not suc:
    raise ValueError("Missing required fields. Please provide dni, email, and password.")
  # Create the user object
  user = User(
      name=name,
      dni=dni,
      email=email,
      password=password,
      date=date,
      mailing=mailing,
      rating=rating,
      suc=suc,
      is_employee=is_employee)
  # Save the user to the database
  user.save()

  return user

class PubViewSet(viewsets.ModelViewSet):
  queryset = Pub.objects.all()
  serializer_class = PubSerializer

  def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

def get_all_ids():
  return Pub.objects.values_list('id', flat=True)

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

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'user_id': user.id, 'email': user.email})