from django.urls import path, re_path
from . import views

urlpatterns = [
    path('etl/save_menu/', views.save_menu_data, name='save_menu_data'),
    path('etl/', views.etl_pipeline, name='etl_pipeline'),
    path('', views.frontend, name='frontend'),
    re_path(r'^.*$', views.frontend, name='frontend'),  # Move catch-all to the end
]