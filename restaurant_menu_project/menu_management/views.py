from django.shortcuts import render, get_object_or_404
from django.views.generic import ListView, DetailView, CreateView
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import (
    Restaurant, Menu, MenuSection, MenuItem,
    DietaryRestriction, MenuItemDietaryRestriction,
    ProcessingLog
)
from etl_scripts.extract_pdf import extract_text_from_pdf
from etl_scripts.extract_ai import process_text_with_ai
import json
from django.utils import timezone
import os
from django.conf import settings
import logging
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import RestaurantSerializer

# Initialize logger
logger = logging.getLogger(__name__)

# Serve the React frontend
def frontend(request):
    return render(request, "index.html")

@csrf_exempt
@api_view(['POST'])
def etl_pipeline(request):
    if request.method == 'POST':
        try:
            # Log incoming request body
            logger.info("Incoming request body: %s", request.body)

            # Handle JSON input for restaurant data
            if request.content_type == 'application/json':
                data = json.loads(request.body)

                # Log parsed data for debugging
                logger.info("Parsed data: %s", data)

                # Validate required fields
                required_fields = ['restaurant_name', 'address', 'city', 'country', 'website_link', 'contact_number']
                missing_fields = [field for field in required_fields if not data.get(field)]
                if missing_fields:
                    logger.warning("Missing required fields: %s", ", ".join(missing_fields))
                    return JsonResponse({'error': f'Missing required fields: {", ".join(missing_fields)}'}, status=400)

                # Use serializer to validate and save restaurant data
                serializer = RestaurantSerializer(data=data)

                if serializer.is_valid():
                    # Save the data if it's valid
                    restaurant = serializer.save()
                    logger.info(f"Restaurant created: {restaurant.restaurant_name}")
                    return JsonResponse({'message': 'Restaurant data saved successfully', 'id': restaurant.id})               
                else:
                    logger.warning("Invalid data: %s", serializer.errors)
                    return JsonResponse({'error': 'Invalid data', 'details': serializer.errors}, status=400)

            # Handle PDF file upload
            elif request.FILES.get('menu_pdf'):
                uploaded_pdf = request.FILES['menu_pdf']
                restaurant_id = request.POST.get('restaurant_id')

                if not restaurant_id:
                    logger.warning("Missing restaurant_id for menu processing")
                    return JsonResponse({'error': 'Restaurant ID is required for menu processing'}, status=400)

                restaurant = get_object_or_404(Restaurant,id=restaurant_id)

                # Define custom temporary directory
                temp_dir = os.path.join(settings.BASE_DIR, 'temp')
                os.makedirs(temp_dir, exist_ok=True)

                # Save the PDF temporarily
                pdf_path = os.path.join(temp_dir, uploaded_pdf.name)
                try:
                    with open(pdf_path, 'wb') as f:
                        for chunk in uploaded_pdf.chunks():
                            f.write(chunk)

                    # Step 2: Extract text from the PDF
                    extracted_text = extract_text_from_pdf(pdf_path)
                    if not extracted_text:
                        logger.error("Failed to extract text from PDF")
                        return JsonResponse({'error': 'Failed to extract text from PDF'}, status=500)

                    # Step 3: Process text with AI
                    structured_data = process_text_with_ai(extracted_text)
                    if not structured_data:
                        logger.error("AI processing failed")
                        return JsonResponse({'error': 'AI processing failed'}, status=500)

                    # Step 4: Store extracted data in the database
                    menu = Menu.objects.create(
                        restaurant=restaurant,
                        title="Menu Title",
                        created_at=timezone.now(),
                        last_updated=timezone.now(),
                        version=1,
                    )
                    logger.info(f"Menu created for restaurant: {restaurant.restaurant_name}")

                    # Save menu sections and items
                    for section_data in structured_data.get('sections', []):
                        section = MenuSection.objects.create(
                            menu=menu,
                            section=section_data['name'],
                            section_description=section_data.get('description', ''),
                        )

                        for item_data in section_data.get('menu_items', []):
                            item = MenuItem.objects.create(
                                section=section,
                                item=item_data['name'],
                                item_description=item_data.get('description', ''),
                                price=item_data['price'],
                                created_at=timezone.now(),
                                updated_at=timezone.now(),
                            )

                            # Save dietary restrictions
                            for restriction_name in item_data.get('dietary_restrictions', []):
                                restriction, _ = DietaryRestriction.objects.get_or_create(
                                    restriction=restriction_name
                                )
                                MenuItemDietaryRestriction.objects.create(
                                    item_id=item.id,
                                    restriction_id=restriction.id,
                                )
                    logger.info("Menu items and dietary restrictions saved successfully")

                    # Clean up the temporary file
                    os.remove(pdf_path)

                    # Return a simple success response without menu items
                    return JsonResponse({
                        'message': 'Menu processed successfully',
                        'menu_items': [
                            {
                                'section': section_data['name'],
                                'name': item_data['name'],
                                'price': float(item_data['price']) if item_data['price'] is not None else 0.00,
                                'description': item_data.get('description', ''),
                                'dietaryNotes': item_data.get('dietary_restrictions', [])
                            }
                            for section_data in structured_data.get('sections', [])
                            for item_data in section_data.get('menu_items', [])
                        ]
                    })

                finally:
                    # Remove the temp directory if it is empty
                    if os.path.exists(pdf_path):
                        os.remove(pdf_path)
                    if not os.listdir(temp_dir):  # If the temp directory is empty
                        os.rmdir(temp_dir)

        except Exception as e:
            logger.error(f"Error in ETL pipeline: {str(e)}")
            return JsonResponse({'error': f'Error occurred during ETL pipeline: {e}'}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=400)



# Additional views for browsing restaurants and menus
class RestaurantListView(ListView):
    model = Restaurant
    template_name = 'menu_management/restaurant_list.html'
    context_object_name = 'restaurants'
    ordering = ['-id']


class RestaurantDetailView(DetailView):
    model = Restaurant
    template_name = 'menu_management/restaurant_detail.html'
    context_object_name = 'restaurant'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['menus'] = Menu.objects.filter(restaurant=self.object).order_by('-version')
        context['latest_menu'] = context['menus'].first()
        return context


class MenuDetailView(DetailView):
    model = Menu
    template_name = 'menu_management/menu_detail.html'
    context_object_name = 'menu'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sections'] = MenuSection.objects.filter(menu=self.object)
        context['processing_logs'] = ProcessingLog.objects.filter(menu=self.object).order_by('-operation_time_stamp')
        return context

def processing_log_list(request, menu_id):
    menu = get_object_or_404(Menu, pk=menu_id)
    logs = ProcessingLog.objects.filter(menu=menu).order_by('-operation_time_stamp')

    context = {
        'menu': menu,
        'logs': logs,
    }
    return render(request, 'menu_management/processing_log_list.html', context)


@csrf_exempt
@api_view(['POST'])
def save_menu_data(request):
    logger.info("Received save_menu request")
    logger.info(f"Request body: {request.body}")
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            logger.info(f"Parsed data: {data}")
            data = json.loads(request.body)
            restaurant_id = data.get('restaurant_id')
            menu_items = data.get('menu_items', [])

            if not restaurant_id:
                return JsonResponse({'error': 'Restaurant ID is required'}, status=400)

            restaurant = get_object_or_404(Restaurant, id=restaurant_id)

            # Create new menu version
            menu = Menu.objects.create(
                restaurant=restaurant,
                title="Menu Title",
                version=1,
            )

            # Group items by section
            sections = {}
            for item in menu_items:
                section_name = item.get('section')
                if section_name not in sections:
                    sections[section_name] = MenuSection.objects.create(
                        menu=menu,
                        section=section_name,
                        section_description='',
                    )

                # Create menu item
                menu_item = MenuItem.objects.create(
                    section=sections[section_name],
                    item=item.get('name'),
                    item_description=item.get('description', ''),
                    price=item.get('price', 0.00),
                )

                # Handle dietary restrictions
                for restriction in item.get('dietaryNotes', []):
                    restriction_obj, _ = DietaryRestriction.objects.get_or_create(
                        restriction=restriction
                    )
                    MenuItemDietaryRestriction.objects.create(
                        item=menu_item,
                        restriction=restriction_obj,
                    )
            return JsonResponse({'message': 'Menu saved successfully'})

        except Exception as e:
            logger.error(f"Error saving menu data: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=400)

@api_view(['GET'])
def get_restaurants(request):
    try:
        restaurants = Restaurant.objects.all()
        serializer = RestaurantSerializer(restaurants, many=True)
        return JsonResponse({'restaurants': serializer.data})
    except Exception as e:
        logger.error(f"Error fetching restaurants: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['GET'])
def get_restaurant_detail(request, restaurant_id):
    try:
        restaurant = get_object_or_404(Restaurant, id=restaurant_id)
        serializer = RestaurantSerializer(restaurant)
        return JsonResponse({'restaurant': serializer.data})
    except Exception as e:
        logger.error(f"Error fetching restaurant details: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['GET'])
def get_restaurant_menus(request, restaurant_id):
    try:
        menus = Menu.objects.filter(restaurant_id=restaurant_id).order_by('-version')
        menu_data = []
        
        for menu in menus:
            sections = MenuSection.objects.filter(menu=menu)
            menu_items = []
            
            for section in sections:
                items = MenuItem.objects.filter(section=section)
                for item in items:
                    menu_items.append({
                        'name': item.item,
                        'price': float(item.price),
                        'description': item.item_description,
                        'section': section.section,
                        'dietary_restrictions': [
                            r.restriction.restriction 
                            for r in item.menuitemdietaryrestriction_set.all()
                        ]
                    })
            
            menu_data.append({
                'id': str(menu.id),
                'version': menu.version,
                'last_updated': menu.last_updated.isoformat(),
                'menu_items': menu_items
            })
        
        return JsonResponse({'menus': menu_data})
    except Exception as e:
        logger.error(f"Error fetching restaurant menus: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)