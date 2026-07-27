from django.urls import path
from . import views

urlpatterns = [
    path("api/appointments/", views.AppointmentListCreate.as_view(), name="appointment-list"),
    path("api/appointments/<int:pk>/", views.AppointmentDetail.as_view(), name="appointment-detail"),
]
