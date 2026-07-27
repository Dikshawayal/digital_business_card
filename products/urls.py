from django.urls import path
from . import views

urlpatterns = [
    path("api/products/", views.ProductListCreate.as_view(), name="product-list"),
    path("api/products/<int:pk>/", views.ProductDetail.as_view(), name="product-detail"),
]
