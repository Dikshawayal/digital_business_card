from django.db import models
from django.conf import settings
from products.models import Product
from services.models import Service

class BusinessCard(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    company_name = models.CharField(max_length=200, blank=True)
    designation = models.CharField(max_length=200, blank=True)
    phone = models.CharField(max_length=50, blank=True)
    email = models.CharField(max_length=200, blank=True)
    website = models.CharField(max_length=200, blank=True)
    address = models.TextField(blank=True)
    about = models.TextField(blank=True)
    products = models.ManyToManyField(
        Product,
        blank=True
    )

    services = models.ManyToManyField(
        Service,
        blank=True
    )
    profile_photo = models.ImageField(upload_to="business_cards/", blank=True, null=True)
    cover_photo = models.ImageField(upload_to="business_cards/", blank=True, null=True)
    qr_code = models.ImageField(upload_to="business_cards/", blank=True, null=True)
    primary_color = models.CharField(max_length=7, default="#2563eb")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.company_name or self.user.username}'s Card"
