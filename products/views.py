from rest_framework import generics, permissions
from .models import Product
from .serializers import ProductSerializer
from .authentication import CsrfExemptSessionAuthentication

class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

class ProductListCreate(generics.ListCreateAPIView):
    serializer_class = ProductSerializer
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ProductDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProductSerializer
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Product.objects.filter(user=self.request.user)
