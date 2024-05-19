from django.db import models
from django.db.models import signals
from django.contrib.auth.models import AbstractUser
from django.conf import settings

class User(AbstractUser):
  name = models.CharField(max_length=100, default='0')
  dni = models.CharField(unique=True, max_length=8)
  email = models.EmailField(unique=True, max_length=100)
  date = models.DateField(blank=True, null=True)
  mailing = models.BooleanField(default=False, blank=True, null=True)
  rating = models.FloatField(default=0.00, blank=True, null=True)
  suc = models.ForeignKey('Sucursal', on_delete=models.SET_NULL, null=True)
  is_employee = models.BooleanField(default=False, blank=True, null=True)
  USERNAME_FIELD = 'dni'
  EMAIL_FIELD = "email"

class Admin(models.Model):
  dni = models.CharField(unique=True, max_length=8)
  email = models.EmailField(unique=True, max_length=100)
  password = models.CharField(max_length=100)

class Pub(models.Model):
  title = models.CharField(max_length=100)
  desc = models.CharField(max_length=1000)
  user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
  is_paused = models.BooleanField()
  photos = models.ImageField(upload_to='photos/pub')
  price = models.FloatField()
  category = models.CharField(max_length=100)
  desired = models.CharField(max_length=100)

class Sucursal(models.Model):
  address = models.CharField(max_length=100)
  photos = models.ImageField(upload_to='photos/suc')
  phone = models.CharField(max_length=20)

class Image(models.Model):
  #pub = models.ForeignKey('Pub', on_delete=models.CASCADE)
  photos = models.ImageField(upload_to='photos/pub')
