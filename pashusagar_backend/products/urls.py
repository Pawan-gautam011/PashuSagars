from django.urls import path
from .views import (
    CategoryListCreateView,
    CategoryRetrieveUpdateDestroyView,
    ProductListView,
    ProductCreateView,
    ProductRetrieveUpdateDestroyView,
    ProductsByCategoryView,
)

urlpatterns = [
    # Category endpoints
    path('categories/', CategoryListCreateView.as_view(), name='category_list_create'),
    path('categories/<int:pk>/', CategoryRetrieveUpdateDestroyView.as_view(), name='category_detail'),

    # Product endpoints
    path('products/', ProductListView.as_view(), name='product_list'), 
    path('products/create/', ProductCreateView.as_view(), name='product_create'),  
    path('products/<int:pk>/', ProductRetrieveUpdateDestroyView.as_view(), name='product_detail'),  
    path('categories/<int:category_id>/products/', ProductsByCategoryView.as_view(), name='products_by_category'),  
]
