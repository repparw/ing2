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
  total_ratings = models.IntegerField(default=0, blank=True)

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
  # TODO add status finished and not realized
  status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('accepted', 'Accepted'),
            ('rejected', 'Rejected'),
            ('confirmed', 'Confirmed'),
            ('cancelled', 'Cancelled'),
            ('concreted', 'Concreted'),
            ('not_finished', 'Not Finished')
        ],
        default='pending'
    )
  code = models.CharField(max_length=100, blank=True, default='')
  created_at = models.DateTimeField(auto_now_add=True)
  date = models.DateField(null=True, blank=True)
  recipient_rated = models.BooleanField(default=False)
  proposer_rated = models.BooleanField(default=False)
  recipient_rated_sucursal = models.BooleanField(default=False)
  proposer_rated_sucursal = models.BooleanField(default=False)

class Sucursal(models.Model):
  address = models.CharField(max_length=100)
  photos = models.ImageField(upload_to='photos/suc')
  phone = models.CharField(max_length=20)

class Photo(models.Model):
  pub = models.ForeignKey(Pub, related_name='photos', on_delete=models.CASCADE)
  image = models.ImageField(upload_to='photos/pub')

class Sales(models.Model):
    product = models.CharField(max_length=100)
    price = models.FloatField()
    quantity = models.IntegerField()
    trade = models.ForeignKey(TradeProposal, on_delete=models.CASCADE, related_name='sales')


class Banner(models.Model):
    LEFT = 'left'
    RIGHT = 'right'
    POSITION_CHOICES = [
        (LEFT, 'Left'),
        (RIGHT, 'Right')
    ]

    position = models.CharField(max_length=10, choices=POSITION_CHOICES, unique=True)
    image = models.BinaryField()
    
class Comment(models.Model):
    pub = models.ForeignKey(Pub, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField()
    respuesta = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f'Comment by {self.user.username} on {self.pub.title}'
    
class Rating(models.Model):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ratings_received')
    rating_score = models.IntegerField()

    def __str__(self):
        return f'Rating: {self.rating_score} for {self.recipient.username}'
    
class SucursalRating(models.Model):
    sucursal = models.ForeignKey(Sucursal, on_delete=models.SET_NULL, null=True, related_name='ratings')
    rating_score = models.IntegerField()
    comment = models.CharField(max_length=1000)
