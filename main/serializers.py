from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import Pub, User, Sucursal, TradeProposal, Sales, Comment, Banner, Rating

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
        fields = ('id', 'name', 'username', 'email', 'date', 'rating', 'suc', 'mailing', 'is_staff', 'is_superuser') # Add more fields as needed

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = '__all__'
        
class UserSerializer(serializers.ModelSerializer):
    ratings_received = RatingSerializer(many=True, read_only=True)
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
    proposer_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), write_only=True)
    proposer = UserSerializer(read_only=True)
    recipient_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), write_only=True)
    recipient = UserSerializer(read_only=True)
    publication_id = serializers.PrimaryKeyRelatedField(queryset=Pub.objects.all(), write_only=True)
    publication = PubSerializer(read_only=True)
    proposed_items_id = serializers.PrimaryKeyRelatedField(queryset=Pub.objects.all(), many=True, write_only=True)
    proposed_items = PubSerializer(many=True, read_only=True)
    suc_id = serializers.PrimaryKeyRelatedField(queryset=Sucursal.objects.all(), required=False, allow_null=True, write_only=True)
    suc = SucursalSerializer(read_only=True)

    class Meta:
        model = TradeProposal
        fields = [
            'id', 'proposer_id', 'proposer', 'recipient_id', 'recipient',
            'publication_id', 'publication', 'proposed_items_id', 'proposed_items',
            'suc_id', 'suc', 'status', 'code', 'created_at', 'date'
        ]

    def create(self, validated_data):
        proposer = validated_data.pop('proposer_id')
        recipient = validated_data.pop('recipient_id')
        publication = validated_data.pop('publication_id')
        proposed_items = validated_data.pop('proposed_items_id')
        suc = validated_data.pop('suc_id', None)

        trade_proposal = TradeProposal.objects.create(
            proposer=proposer,
            recipient=recipient,
            publication=publication,
            suc=suc,
            status=validated_data.get('status', 'pending'),
            code=validated_data.get('code', ''),
            date=validated_data.get('date')
        )

        trade_proposal.proposed_items.set(proposed_items)
        return trade_proposal

    def update(self, instance, validated_data):
        instance.proposer = validated_data.get('proposer_id', instance.proposer)
        instance.recipient = validated_data.get('recipient_id', instance.recipient)
        instance.publication = validated_data.get('publication_id', instance.publication)
        instance.suc = validated_data.get('suc_id', instance.suc)
        instance.status = validated_data.get('status', instance.status)
        instance.code = validated_data.get('code', instance.code)
        instance.date = validated_data.get('date', instance.date)

        proposed_items = validated_data.get('proposed_items_id')
        if proposed_items is not None:
            instance.proposed_items.set(proposed_items)

        instance.save()
        return instance

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






class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = ['position', 'image']

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'
