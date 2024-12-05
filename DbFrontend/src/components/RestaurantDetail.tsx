import React from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import { MapPin, Phone, Building2, ChevronRight } from 'lucide-react';
import type { Restaurant, MenuData } from '@/types';


export function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = React.useState<Restaurant | null>(null);
  const [menuVersions, setMenuVersions] = React.useState<MenuData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch restaurant details
        const restaurantResponse = await fetch(`http://127.0.0.1:8000/restaurant/${id}/`);
        if (!restaurantResponse.ok) {
          throw new Error('Failed to fetch restaurant details');
        }
        const restaurantData = await restaurantResponse.json();
        setRestaurant(restaurantData.restaurant);

        // Fetch menu versions
        const menuResponse = await fetch(`http://127.0.0.1:8000/restaurant/${id}/menus/`);
        if (menuResponse.ok) {
          const menuData = await menuResponse.json();
          setMenuVersions(menuData.menus);
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load restaurant details');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (isLoading) {
    return <div className="text-center py-8">Loading restaurant details...</div>;
  }

  if (error || !restaurant) {
    return <div className="text-center py-8 text-red-600">{error || 'Restaurant not found'}</div>;
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {restaurant.restaurant_name}
        </h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-400 mt-1 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">Address</p>
                <p className="text-sm text-gray-600">{restaurant.address}</p>
                <p className="text-sm text-gray-600">{restaurant.city}</p>
                <p className="text-sm text-gray-600">{restaurant.country}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">Phone</p>
                <p className="text-sm text-gray-600">{restaurant.contact_number}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Building2 className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">Website</p>
                <a 
                  href={restaurant.website_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {restaurant.website_link}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Versions Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Menu Versions</h2>
        </div>

        {menuVersions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No menus available. Add one to get started!
          </div>
        ) : (
          <div className="space-y-4">
            {menuVersions.map((menu) => (
              <div 
                key={menu.version}
                onClick={() => navigate(`/restaurant/${id}/menu/${menu.version}`)}
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Menu Version {menu.version}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Last updated: {new Date(menu.last_updated).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {menu.menu_items?.length || 0} items
                    </span>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}