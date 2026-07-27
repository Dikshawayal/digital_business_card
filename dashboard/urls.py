from django.urls import path
from .views import DashboardStats, ActivityList

urlpatterns = [
    path("stats/", DashboardStats.as_view()),
    path("activities/", ActivityList.as_view()),
]