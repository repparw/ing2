from django.contrib.auth import authenticate
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

class CustomAuthTokenSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        username_or_email = attrs.get('username')
        password = attrs.get('password')

        if username_or_email and password:
            # Try to authenticate by username or email
            user = authenticate(username=username_or_email, password=password)
            if not user:
                try:
                    user_instance = User.objects.get(email=username_or_email)
                    user = authenticate(username=user_instance.username, password=password)
                except User.DoesNotExist:
                    raise serializers.ValidationError('Invalid username/email or password.')

            if not user:
                raise serializers.ValidationError('Invalid username/email or password.')

            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include "username_or_email" and "password".')

        return attrs
