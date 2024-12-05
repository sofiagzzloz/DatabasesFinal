import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Building2, Eye } from 'lucide-react';
import type { Restaurant, MenuData } from '@/types';
import { Button } from './ui/Button';

export function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = React.useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [menus, setMenus] = React.useState<MenuData[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantRes, menusRes] = await Promise.all([
          fetch(`http://127.0.0.1:8000/restaurant/${id}/`),
          fetch(`http://127.0.0.1:8000/restaurant/${id}/menus/`)
        ]);

        const restaurantData = await restaurantRes.json();
        const menusData = await menusRes.json();
        
        setRestaurant(restaurantData.restaurant);
        setMenus(menusData.menus || []);
      } catch (error) {
        console.error('Error:', error);
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
    <div className="max-w-6xl mx-auto px-4 py-8">
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
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Menu Versions</h2>
        <div className="space-y-4">
          {menus.map((menu) => (
            <div key={menu.id} className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="font-medium">Version {menu.version}</h3>
                <p className="text-sm text-gray-500">
                  Last Updated: {new Date(menu.last_updated).toLocaleDateString()}
                </p>
              </div>
              <Button
                onClick={() => navigate(`/restaurant/${id}/menu/${menu.version}`)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                View Menu
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}