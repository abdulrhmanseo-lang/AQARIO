from rest_framework import serializers
from .models import Property

class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = '__all__'
        read_only_fields = ['tenant']

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['tenant'] = request.tenant
        return super().create(validated_data)
