from rest_framework import serializers
from .models import SocialLink

class SocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLink
        fields = ["id", "platform", "label", "url", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]
