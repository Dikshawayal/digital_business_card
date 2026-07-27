from rest_framework import generics, permissions
from rest_framework.permissions import AllowAny
from .models import BusinessCard
from .serializers import BusinessCardSerializer
from products.authentication import CsrfExemptSessionAuthentication

class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

class BusinessCardListCreate(generics.ListCreateAPIView):
    serializer_class = BusinessCardSerializer
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BusinessCard.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BusinessCardDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BusinessCardSerializer
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return BusinessCard.objects.filter(user=self.request.user)

class PublicBusinessCard(generics.RetrieveAPIView):
    serializer_class = BusinessCardSerializer
    permission_classes = [AllowAny]
    queryset = BusinessCard.objects.all()
