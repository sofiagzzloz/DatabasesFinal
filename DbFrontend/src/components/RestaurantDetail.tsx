import React from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Phone, Building2 } from 'lucide-react';
import type { Restaurant, MenuData } from '@/types';

export function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = React.useState<Restaurant | null>(null);
  const [menuVersions, setMenuVersions] = React.useState<MenuData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        setIsLoading(true); // Set loading to true
        const response = await fetch(`http://127.0.0.1:8000/restaurant/${id}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch restaurant details');
        }
        const data = await response.json();
        setRestaurant(data.restaurant);
        setMenuVersions(data.menu_versions || []); // Handle menu versions if available
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load restaurant details');
      } finally {
        setIsLoading(false); // Always set loading to false
      }
    };

    if (id) {
      fetchRestaurantData();
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
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Menu Versions</h2>
        {menuVersions.length === 0 ? (
          <p className="text-gray-600">No menus available for this restaurant.</p>
        ) : (
          <div className="space-y-4">
            {menuVersions.map((menu, index) => (
              <div 
                key={index}
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Version {menu.version}</p>
                    <p className="text-sm text-gray-600">
                      Last updated: {new Date(menu.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-sm text-gray-600">
                    {menu.items.length} items
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