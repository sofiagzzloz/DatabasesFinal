from menu_management.models import Restaurant

def save_restaurant_data(data, pdf_file=None):
    """
    Save restaurant data into the database.
    :param data: Dictionary containing restaurant details.
    :param pdf_file: Uploaded PDF file object.
    :return: Restaurant instance.
    """
    try:
        restaurant = Restaurant.objects.create(
            restaurant_name=data['restaurant_name'],
            address=data['address'],
            city=data['city'],
            country=data['country'],
            website_link=data['website_link'],
            contact_number=data['contact_number'],
            menu_pdf=pdf_file  # Save the uploaded PDF file, if provided
        )
        return restaurant
    except Exception as e:
        raise ValueError(f"Error saving restaurant data: {e}")
