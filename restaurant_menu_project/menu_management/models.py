from django.db import models
from django.utils import timezone

class Restaurant(models.Model):
    id = models.AutoField(primary_key=True, db_column='restaurant_id')  # Change this line
    restaurant_name = models.CharField(max_length=100)
    address = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=50, blank=True, null=True)
    country = models.CharField(max_length=50, blank=True, null=True)
    website_link = models.URLField(max_length=200, blank=True, null=True)
    contact_number = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'restaurant'  # Explicitly map to the 'restaurant' table in the DB


    def __str__(self):
        return self.restaurant_name

class Menu(models.Model):
    menu_id = models.AutoField(primary_key=True)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    created_at = models.DateTimeField(default=timezone.now)
    last_updated = models.DateTimeField(default=timezone.now)
    version = models.IntegerField(default=1)

    class Meta:
        db_table = 'menu'

    def __str__(self):
        return f"{self.restaurant.restaurant_name} - {self.title} (v{self.version})"

class MenuSection(models.Model):
    section_id = models.AutoField(primary_key=True)
    menu = models.ForeignKey(Menu, on_delete=models.CASCADE)
    section = models.CharField(max_length=100)
    section_description = models.CharField(max_length=200, blank=True, null=True)

    class Meta:
        db_table = 'menu_section'  # Explicitly map to the 'menu_section' table

    def __str__(self):
        return f"{self.menu.title} - {self.section}"

class MenuItem(models.Model):
    item_id = models.AutoField(primary_key=True)
    section = models.ForeignKey(MenuSection, on_delete=models.CASCADE)
    item = models.CharField(max_length=100)
    item_description = models.CharField(max_length=200, blank=True, null=True)
    price = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'menu_item'  # Explicitly map to the 'menu_item' table

    def __str__(self):
        return self.item

class DietaryRestriction(models.Model):
    restriction_id = models.AutoField(primary_key=True)
    restriction = models.CharField(max_length=50, default='Default Restriction')

    class Meta:
        db_table = 'dietary_restriction'  # Explicitly map to the 'dietary_restriction' table

    def __str__(self):
        return self.restriction

class MenuItemDietaryRestriction(models.Model):
    item = models.ForeignKey(
        MenuItem, on_delete=models.CASCADE, related_name='dietary_restrictions')
    restriction = models.ForeignKey(
        DietaryRestriction, on_delete=models.CASCADE, related_name='menu_items', default=1)

    class Meta:
        db_table = 'menu_item_dietary_restriction'  # Explicitly map to the 'menu_item_dietary_restriction' table
        unique_together = ('item', 'restriction')

    def __str__(self):
        return f"{self.item.item} - {self.restriction.restriction}"

class ProcessingLog(models.Model):
    log_id = models.AutoField(primary_key=True)
    menu = models.ForeignKey(Menu, on_delete=models.CASCADE)
    operation_type = models.CharField(max_length=20)
    file_name = models.CharField(max_length=255, blank=True, null=True)
    operation_status = models.CharField(max_length=10)
    operation_time_stamp = models.DateTimeField(auto_now_add=True)
    error_description = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'processing_log'  # Explicitly map to the 'processing_log' table
        

    def __str__(self):
        return f"{self.operation_type} - {self.operation_status}"
