from django.urls import path
from . import views

urlpatterns = [
    path("api/social-links/", views.SocialLinkListCreate.as_view(), name="social-link-list"),
    path("api/social-links/<int:pk>/", views.SocialLinkDetail.as_view(), name="social-link-detail"),
]
