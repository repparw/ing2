from django.db import models

class User(models.Model):
  name = models.CharField(max_length=100, default='0')
  dni = models.CharField(unique=True, max_length=8)
  email = models.CharField(unique=True, max_length=100)
  password = models.CharField(max_length=100)
  date = models.DateField()
  mailing = models.BooleanField()
  rating = models.DecimalField(max_digits=2, decimal_places=2, default=0)
  suc = models.ForeignKey('Sucursal', on_delete=models.SET_NULL, null=True)

class Admin(models.Model):
  dni = models.CharField(unique=True, max_length=8)
  email = models.CharField(unique=True, max_length=100)
  password = models.CharField(max_length=100)

class Employee(models.Model):
  name = models.CharField(max_length=100, default='0')
  dni = models.CharField(unique=True, max_length=8)
  email = models.CharField(unique=True, max_length=100)
  password = models.CharField(max_length=100)
  suc = models.ForeignKey('Sucursal', on_delete=models.CASCADE)

class Pub(models.Model):
  title = models.CharField(max_length=100)
  desc = models.CharField(max_length=1000)
  user = models.ForeignKey('User', on_delete=models.CASCADE)
  photos = models.ImageField(upload_to='photos/pub')
  is_paused = models.BooleanField()
  price = models.FloatField()
  category = models.CharField(max_length=100)
  desired = models.CharField(max_length=100)

class Sucursal(models.Model):
  address = models.CharField(max_length=100)
  photos = models.ImageField(upload_to='photos/suc')
  phone = models.CharField(max_length=20)

class Images(models.Model):
  image = models.ImageField(upload_to='photos/pub')
