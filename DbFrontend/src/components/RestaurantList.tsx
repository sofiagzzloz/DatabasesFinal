import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { Restaurant } from '@/types';

export function RestaurantList() {
  // Mock data - replace with actual data fetching
  const [restaurants] = React.useState<Restaurant[]>([
    {
      id: '1',
      name: 'The Italian Place',
      address: '123 Main St',
      city: 'New York',
      phone: '(555) 123-4567',
    },
    {
      id: '2',
      name: 'Sushi Express',
      address: '456 Oak Ave',
      city: 'Los Angeles',
      phone: '(555) 987-6543',
    },
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Restaurants</h1>
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
                  {restaurant.name}
                </h2>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              <p className="mt-2 text-sm text-gray-600">{restaurant.city}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}