# urls.py
from django.urls import path
from .views import ConsultationView
from .views import assign_veterinarian_to_message

# urls.py
from django.urls import path
from .views import assign_veterinarian_to_message
urlpatterns = [
    path("consultation/", ConsultationView.as_view(), name="consultation"),
    path('api/messages/<int:message_id>/', assign_veterinarian_to_message, name='assign-veterinarian'),

]


