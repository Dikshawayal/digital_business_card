from django.db import models
from django.conf import settings

class SocialLink(models.Model):
    PLATFORM_CHOICES = [
        ("facebook", "Facebook"),
        ("instagram", "Instagram"),
        ("twitter", "Twitter / X"),
        ("linkedin", "LinkedIn"),
        ("youtube", "YouTube"),
        ("tiktok", "TikTok"),
        ("whatsapp", "WhatsApp"),
        ("telegram", "Telegram"),
        ("github", "GitHub"),
        ("website", "Website"),
        ("other", "Other"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="social_links"
    )
    platform = models.CharField(max_length=50, choices=PLATFORM_CHOICES, default="other")
    label = models.CharField(max_length=100, blank=True)
    url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.get_platform_display()} - {self.label or self.url}"
