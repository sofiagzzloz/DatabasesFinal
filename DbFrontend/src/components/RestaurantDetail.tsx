import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Building2, Eye } from 'lucide-react';
import type { Restaurant } from '@/types';
import { Button } from './ui/Button';

export function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = React.useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://127.0.0.1:8000/restaurant/${id}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch restaurant details');
        }
        const data = await response.json();
        setRestaurant(data.restaurant);
      } catch (err) {
        console.error('Error:', err);
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

      {/* Menu Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Menu</h2>
        <div className="flex justify-center">
          <Button
            onClick={() => navigate(`/restaurant/${id}/menu/1`)} // Assuming menu version 1
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            View Menu
          </Button>
        </div>
      </div>
    </div>
  );
}