from django.contrib import admin
from .models import BusinessCard

@admin.register(BusinessCard)
class BusinessCardAdmin(admin.ModelAdmin):
    list_display = ["user", "company_name", "designation", "phone", "created_at"]
