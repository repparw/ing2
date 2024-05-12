from rest_framework import serializers
from .models import Pub

class PubSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pub
        fields = '__all__'
