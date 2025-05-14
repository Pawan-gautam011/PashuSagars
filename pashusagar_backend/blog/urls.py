from django.urls import path
from .views import BlogListCreateView, BlogDetailView

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('blogs/', BlogListCreateView.as_view(), name='blog-list-create'),
    path('blogs/<int:pk>/', BlogDetailView.as_view(), name='blog-detail'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
