from django.urls import path
from . import views

urlpatterns = [
    path("api/business-cards/", views.BusinessCardListCreate.as_view(), name="business-card-list"),
    path("api/business-cards/<int:pk>/", views.BusinessCardDetail.as_view(), name="business-card-detail"),
    path("public-business-cards/<int:pk>/",views.PublicBusinessCard.as_view(),
),
]
