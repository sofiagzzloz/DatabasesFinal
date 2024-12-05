from django.urls import path, re_path
from . import views

urlpatterns = [
    path('etl/save_menu/', views.save_menu_data, name='save_menu_data'),
    path('etl/', views.etl_pipeline, name='etl_pipeline'),
    path('restaurants/', views.get_restaurants, name='get_restaurants'),
    path('', views.frontend, name='frontend'),
    path('restaurant/<int:restaurant_id>/', views.get_restaurant_detail, name='restaurant_detail'),
path('restaurant/<int:restaurant_id>/menus/', views.get_restaurant_menus, name='restaurant_menus'),
    re_path(r'^.*$', views.frontend, name='frontend'),  # Move catch-all to the end
]