from rest_framework import serializers
from .models import Pub, User, Sucursal

class PubSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pub
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class SucursalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sucursal
        fields = '__all__'
