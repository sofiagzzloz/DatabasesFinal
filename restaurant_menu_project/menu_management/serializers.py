from rest_framework import serializers
from .models import Restaurant

class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ['id', 'restaurant_name', 'address', 'city', 'country', 'website_link', 'contact_number']
        read_only_fields = ['id']