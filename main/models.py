from django.db import models

class User(models.Model):
  dni = models.CharField(unique=True, max_length=8)
  email = models.CharField(unique=True, max_length=100)
  password = models.CharField(max_length=100)
  date = models.DateField()
  mailing = models.BooleanField()
  suc = models.ForeignKey('Sucursal', on_delete=models.SET_NULL, null=True)

class Admin(models.Model):
  dni = models.CharField(unique=True, max_length=8)
  email = models.CharField(unique=True, max_length=100)
  password = models.CharField(max_length=100)

class Employee(models.Model):
  dni = models.CharField(unique=True, max_length=8)
  email = models.CharField(unique=True, max_length=100)
  password = models.CharField(max_length=100)
  suc = models.ForeignKey('Sucursal', on_delete=models.CASCADE)

class Pub(models.Model):
  title = models.CharField(max_length=100)
  desc = models.CharField(max_length=1000)
  user = models.ForeignKey('User', on_delete=models.CASCADE)
  photos = models.ImageField(upload_to='photos/pub')
  isPaused = models.BooleanField()
  price = models.FloatField()
  category = models.CharField(max_length=100)
  desired = models.CharField(max_length=100)

class Sucursal(models.Model):
  address = models.CharField(max_length=100)
  photos = models.ImageField(upload_to='photos/suc')
  phone = models.CharField(max_length=20)

