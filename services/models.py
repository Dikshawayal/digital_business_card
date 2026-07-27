from django.db import models
from django.conf import settings

class Service(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="services/", blank=True, null=True)
    icon = models.CharField(max_length=100, default="Box")
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name