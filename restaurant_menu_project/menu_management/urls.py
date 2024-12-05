from django.urls import path
from . import views

urlpatterns = [
    path('etl/', views.etl_pipeline, name='etl_pipeline'),
    path('etl/save_menu/', views.save_menu_data, name='save_menu_data'),
    path('restaurants/', views.get_restaurants, name='get_restaurants'),
    path('restaurant/<int:restaurant_id>/', views.get_restaurant_detail, name='restaurant_detail'),
    path('restaurant/<int:restaurant_id>/menus/', views.get_restaurant_menus, name='restaurant_menus'),
    path('restaurant/<str:restaurant_id>/menu/<int:version>/', views.get_menu_detail, name='get_menu_detail'),
]