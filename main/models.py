from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

class User(AbstractUser):
  name = models.CharField(max_length=100, default='0')
  date = models.DateField(blank=True, default='2000-01-01')
  mailing = models.BooleanField(default=False)
  rating = models.FloatField(default=0.00, blank=True)
  suc = models.ForeignKey('Sucursal', on_delete=models.SET_NULL, null=True)
  email = models.EmailField(unique=True)

class Pub(models.Model):
  title = models.CharField(max_length=100)
  desc = models.CharField(max_length=1000)
  user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
  is_paused = models.BooleanField()
  price = models.FloatField()
  category = models.CharField(max_length=100)
  desired = models.CharField(max_length=100, blank=True)

class TradeProposal(models.Model):
  proposer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='proposals_made')
  recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='proposals_received')
  publication = models.ForeignKey(Pub, on_delete=models.CASCADE)
  proposed_items = models.ManyToManyField(Pub, related_name='trade_proposals')
  suc = models.ForeignKey('Sucursal', on_delete=models.SET_NULL, null=True)
  status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected')], default='pending')
  created_at = models.DateTimeField(auto_now_add=True)
  date = models.DateField(blank=True, default='')

class Sucursal(models.Model):
  address = models.CharField(max_length=100)
  photos = models.ImageField(upload_to='photos/suc')
  phone = models.CharField(max_length=20)

class Photo(models.Model):
  pub = models.ForeignKey(Pub, related_name='photos', on_delete=models.CASCADE)
  image = models.ImageField(upload_to='photos/pub')
