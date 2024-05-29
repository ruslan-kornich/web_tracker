from django.urls import path
from .views import UserCreateView, CurrentUserView

urlpatterns = [
    path("register/", UserCreateView.as_view(), name="user-register"),
    path('user/', CurrentUserView.as_view(), name='current_user'),
]
