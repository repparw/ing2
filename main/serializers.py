from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import Pub, User, Sucursal, TradeProposal, Sales

class PubSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pub
        fields = '__all__'

class UpdatePasswordSerializer(serializers.Serializer):
  Model = User
  old_password = serializers.CharField(required=True)
  new_password = serializers.CharField(required=True)
  new_password2 = serializers.CharField(required=True)

class CurrentUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'username', 'email', 'date', 'rating', 'suc', 'mailing', 'is_staff')  # Add more fields as needed

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)  # Hash the password
        user.save()
        return user

    def update_password(self, instance, validated_data):
      password = validated_data.pop('password')
      instance.set_password(password)
      instance.save()
      return instance

    def update(self, instance, validated_data):
      instance.name = validated_data.get('name', instance.name)
      instance.suc = validated_data.get('suc', instance.suc)
      instance.mailing = validated_data.get('mailing', instance.mailing)
      instance.save()
      return instance


class SucursalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sucursal
        fields = '__all__'

class TradeProposalSerializer(serializers.ModelSerializer):
    proposer = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), write_only=True)
    proposer_details = UserSerializer(source='proposer', read_only=True)
    recipient = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), write_only=True)
    recipient_details = UserSerializer(source='recipient', read_only=True)
    publication = serializers.PrimaryKeyRelatedField(queryset=Pub.objects.all(), write_only=True)
    publication_details = PubSerializer(source='publication', read_only=True)
    proposed_items = serializers.PrimaryKeyRelatedField(queryset=Pub.objects.all(), many=True, write_only=True)
    proposed_items_details = PubSerializer(source='proposed_items', many=True, read_only=True)
    suc = serializers.PrimaryKeyRelatedField(queryset=Sucursal.objects.all(), required=False, allow_null=True, write_only=True)
    suc_details = SucursalSerializer(source='suc', read_only=True)

    class Meta:
        model = TradeProposal
        fields = ['id', 'proposer', 'proposer_details', 'recipient', 'recipient_details', 'publication', 'publication_details', 'proposed_items', 'proposed_items_details', 'suc', 'suc_details', 'status', 'code', 'created_at', 'date']

class CustomAuthTokenSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            # Try to authenticate by username or email
            user = authenticate(username=username, password=password)

            if not user:
                try:
                    user_instance = User.objects.get(email=username)
                    user = authenticate(username=user_instance.username, password=password)
                except User.DoesNotExist:
                    raise serializers.ValidationError('Invalid username or password.')

            if not user:
                raise serializers.ValidationError('Invalid username or password.')

            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include "username" and "password".')

        return attrs

class SalesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sales
        fields = '__all__'
