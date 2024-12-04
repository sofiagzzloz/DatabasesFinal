from django.urls import path, re_path
from . import views

urlpatterns = [
    # Serve the React frontend at the root URL
    path('', views.frontend, name='frontend'),

    # API endpoint for the ETL pipeline
    path('etl/', views.etl_pipeline, name='etl_pipeline'),

    # Catch-all route for the React frontend
    re_path(r'^.*$', views.frontend, name='frontend'),
]
