from django.urls import path
from . import views

urlpatterns = [
    path("signup/", views.signup, name="signup"),
    path("login/", views.user_login, name="login"),
    path("api/signup/", views.api_signup, name="api_signup"),
    path("api/login/", views.api_login, name="api_login"),
]
