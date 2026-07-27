from rest_framework import generics, permissions
from .models import Service
from .serializers import ServiceSerializer
from products.authentication import CsrfExemptSessionAuthentication

class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

class ServiceListCreate(generics.ListCreateAPIView):
    serializer_class = ServiceSerializer
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Service.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ServiceDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ServiceSerializer
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Service.objects.filter(user=self.request.user)
