import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { Button } from './ui/Button';
import type { MenuData, Restaurant } from '@/types';

export function MenuDetail() {
  const { id, version } = useParams();
  const navigate = useNavigate();

  // Mock data - replace with actual data fetching
  const [menuData] = React.useState<MenuData>({
    restaurantId: '1',
    version: parseInt(version || '1'),
    lastUpdated: new Date('2024-03-01'),
    items: [
      {
        section: 'Appetizers',
        name: 'Bruschetta',
        price: 8.99,
        description: 'Toasted bread with fresh tomatoes and basil',
        dietaryNotes: ['Vegetarian'],
      },
      {
        section: 'Main Course',
        name: 'Grilled Salmon',
        price: 24.99,
        description: 'Fresh Atlantic salmon with seasonal vegetables',
        dietaryNotes: ['Gluten-Free'],
      },
    ],
  });

  const [restaurant] = React.useState<Restaurant>({
    id: '1',
    name: 'The Italian Place',
    address: '123 Main St',
    city: 'New York',
    phone: '(555) 123-4567',
    email: 'info@italianplace.com',
  });

  // Group items by section
  const itemsBySection = React.useMemo(() => {
    const sections: { [key: string]: typeof menuData.items } = {};
    menuData.items.forEach((item) => {
      if (!sections[item.section]) {
        sections[item.section] = [];
      }
      sections[item.section].push(item);
    });
    return sections;
  }, [menuData.items]);

  return (
    <div>
      <div className="mb-8">
        <Button
          variant="outline"
          onClick={() => navigate(`/restaurant/${id}`)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Restaurant
        </Button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{restaurant.name}</h1>
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Version {version}
              </div>
              <div className="flex items-center">
                <Tag className="w-4 h-4 mr-1" />
                Last Updated: {menuData.lastUpdated.toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        {Object.entries(itemsBySection).map(([section, items]) => (
          <div key={section} className="border-b last:border-b-0">
            <div className="px-6 py-4 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-900">{section}</h2>
            </div>
            <div className="divide-y">
              {items.map((item, index) => (
                <div key={index} className="px-6 py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className="mt-1 text-sm text-gray-600">
                          {item.description}
                        </p>
                      )}
                      {item.dietaryNotes && item.dietaryNotes.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {item.dietaryNotes.map((note, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {note}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-lg font-medium text-gray-900">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}