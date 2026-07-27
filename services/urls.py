from django.urls import path
from . import views

urlpatterns = [
    path("api/services/", views.ServiceListCreate.as_view(), name="service-list"),
    path("api/services/<int:pk>/", views.ServiceDetail.as_view(), name="service-detail"),
]
