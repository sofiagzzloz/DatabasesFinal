from django.contrib import admin
from .models import (
    Restaurant, Menu, MenuSection, MenuItem,
    DietaryRestriction, MenuItemDietaryRestriction,
    ProcessingLog
)

admin.site.register(Restaurant)
admin.site.register(Menu)
admin.site.register(MenuSection)
admin.site.register(MenuItem)
admin.site.register(DietaryRestriction)
admin.site.register(MenuItemDietaryRestriction)
admin.site.register(ProcessingLog) 