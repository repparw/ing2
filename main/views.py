from rest_framework import viewsets
from django.shortcuts import render
from .models import Pub, User
from .serializers import PubSerializer, UserSerializer

# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
  queryset = User.objects.all()
  serializer_class = UserSerializer

class PubViewSet(viewsets.ModelViewSet):
  queryset = Pub.objects.all()
  serializer_class = PubSerializer

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
