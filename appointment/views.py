from rest_framework import generics, permissions
from .models import Appointment
from .serializers import AppointmentSerializer
from products.authentication import CsrfExemptSessionAuthentication

class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

class AppointmentListCreate(generics.ListCreateAPIView):
    serializer_class = AppointmentSerializer
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Appointment.objects.filter(user=self.request.user).order_by("-date", "-time")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AppointmentDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AppointmentSerializer
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Appointment.objects.filter(user=self.request.user)
