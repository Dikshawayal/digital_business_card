from rest_framework import serializers
from .models import BusinessCard
from products.models import Product
from services.models import Service
from products.serializers import ProductSerializer
from services.serializers import ServiceSerializer


class BusinessCardSerializer(serializers.ModelSerializer):
    products = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Product.objects.all(),
        required=False
    )

    services = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Service.objects.all(),
        required=False
    )

    class Meta:
        model = BusinessCard
        fields = "__all__"
        read_only_fields = ["user"]

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep["products"] = ProductSerializer(
            instance.products.all(), many=True
        ).data
        rep["services"] = ServiceSerializer(
            instance.services.all(), many=True
        ).data
        return rep