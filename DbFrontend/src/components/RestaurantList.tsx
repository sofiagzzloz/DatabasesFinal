import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { Restaurant } from '@/types';
import { Button } from './ui/Button';
import { PlusCircle } from 'lucide-react';

export function RestaurantList() {
  const [restaurants, setRestaurants] = React.useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/restaurants/');
        if (!response.ok) {
          throw new Error('Failed to fetch restaurants');
        }
        const data = await response.json();
        setRestaurants(data.restaurants);
      } catch (error) {
        setError('Error loading restaurants');
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (isLoading) {
    return <div className="text-center py-8">Loading restaurants...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Restaurants</h1>
        <Link to="/add-restaurant">
          <Button variant="outline" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Restaurant
          </Button>
        </Link>
      </div>

      {restaurants.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No restaurants found. Add one to get started!
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((restaurant) => (
            <Link
              key={restaurant.id}
              to={`/restaurant/${restaurant.id}`}
              className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {restaurant.restaurant_name}
                  </h2>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">{restaurant.city}</p>
                  <p className="text-sm text-gray-600">{restaurant.address}</p>
                  <p className="text-sm text-gray-600">{restaurant.phone_number}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}