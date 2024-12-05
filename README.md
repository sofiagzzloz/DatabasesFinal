# DB_project

Steps to Connect .env to settings.py

1. Install python-decouple:

```bash
pip install python-decouple
```

2. Create a .env File:

```py
DB_ENGINE=django.db.backends.mysql
DB_NAME=restaurant_menu_database
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_PORT=3306
```

Make sure to include the .env file in your .gitignore file to keep it private:

```py
.env
```
3. Update settings.py:

```py
from decouple import config

DATABASES = {
    'default': {
        'ENGINE': config('DB_ENGINE', default='django.db.backends.mysql'),
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST', default='localhost'),
        'PORT': config('DB_PORT', default='3306'),
    }
}
```

Steps to Connect Frontend and Backend:
1. Run Both Servers:
Start the Django server:
```py
python manage.py runserver
```
This should run your Django backend at http://127.0.0.1:8000/.

Start the React frontend:
```py
npm run dev
```
This should run your frontend at http://localhost:5173/.

Note: For communication between these two, React will make API calls to Django (e.g., the http://127.0.0.1:8000/etl/ endpoint).

2. Ensure Cross-Origin Resource Sharing (CORS):
Since your frontend (React) and backend (Django) are running on different ports, Django needs to allow requests from the React frontend.
Install django-cors-headers:
```py
pip install django-cors-headers
```


Add it to INSTALLED_APPS in settings.py:
```py
INSTALLED_APPS = [
    ...
    'corsheaders',
    ...
]
```

Add the middleware to MIDDLEWARE in settings.py:
```py
MIDDLEWARE = [
    ...
    'corsheaders.middleware.CorsMiddleware',
    ...
]
```

Allow your React frontend in settings.py:
```py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # React frontend
]
```

Install Django Rest Framework (if not installed): If you haven't already, install Django Rest Framework to handle API requests and responses:
```py
pip install djangorestframework
```

Create a Serializer: In your Django project, you’ll need to create a serializer to match the data you're sending from the frontend. Create a new file serializers.py inside your app (for example, in menu_management/ if that's your app):
```py
from rest_framework import serializers
from .models import Restaurant

class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ['id', 'restaurant_name', 'address', 'city', 'country', 'website_link', 'contact_number']
        read_only_fields = ['id']
```

