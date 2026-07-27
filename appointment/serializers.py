from rest_framework import serializers
from .models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = [
            "id", "title", "description", "date", "time", "duration",
            "status", "client_name", "client_email", "client_phone",
            "created_at", "updated_at"
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
