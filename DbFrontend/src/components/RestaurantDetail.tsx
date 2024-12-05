import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building2, Phone, MapPin, FileText } from 'lucide-react';
import type { Restaurant, MenuData } from '@/types';

export function RestaurantDetail() {
  const { id } = useParams();
  
  // Mock data - replace with actual data fetching
  const [restaurant] = React.useState<Restaurant>({
    id: '1',
    name: 'The Italian Place',
    address: '123 Main St',
    city: 'New York',
    phone: '(555) 123-4567',
    country: 'USA',
    website: 'http://italianplace.com',
  });

  const [menuVersions] = React.useState<MenuData[]>([
    {
      restaurantId: '1',
      version: 1,
      lastUpdated: new Date('2024-03-01'),
      items: [
        {
          name: 'Margherita Pizza',
          price: 14.99,
          description: 'Fresh tomatoes, mozzarella, and basil',
          section: 'Pizza',
          dietaryNotes: ['Vegetarian'],
        },
      ],
    },
  ]);

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {restaurant.name}
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
                <p className="text-sm text-gray-600">{restaurant.phone}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Building2 className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">Website</p>
                <p className="text-sm text-gray-600">{restaurant.website}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Menu Versions</h2>
        <div className="space-y-4">
          {menuVersions.map((menu) => (
            <div
              key={menu.version}
              className="border rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Version {menu.version}
                    </p>
                    <p className="text-sm text-gray-600">
                      Last updated: {menu.lastUpdated.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Link
                  to={`/restaurant/${id}/menu/${menu.version}`}
                  className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                >
                  View Menu
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}