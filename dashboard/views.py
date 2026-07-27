from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from businesscards.models import BusinessCard
from services.models import Service
from products.models import Product
from appointment.models import Appointment

from .models import Activity
from .serializers import ActivitySerializer


class DashboardStats(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "business_cards": BusinessCard.objects.filter(user=request.user).count(),
            "services": Service.objects.filter(user=request.user).count(),
            "products": Product.objects.filter(user=request.user).count(),
            "appointments": Appointment.objects.filter(user=request.user).count(),
        })


class ActivityList(ListAPIView):
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Activity.objects.filter(
            user=self.request.user
        ).order_by("-created_at")[:10]