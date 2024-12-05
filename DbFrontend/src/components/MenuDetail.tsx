import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye} from 'lucide-react';
import { Button } from './ui/Button';
import type { MenuData, Restaurant } from '@/types';

export function MenuDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menuData, setMenuData] = React.useState<MenuData | null>(null);
  const [restaurant, setRestaurant] = React.useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // First get restaurant details
        const restaurantRes = await fetch(`http://127.0.0.1:8000/restaurant/${id}/`);
        if (!restaurantRes.ok) {
          throw new Error('Failed to fetch restaurant data');
        }
        const restaurantData = await restaurantRes.json();
        setRestaurant(restaurantData.restaurant);

        // Then get the menu data - using the menus endpoint instead
        const menuRes = await fetch(`http://127.0.0.1:8000/restaurant/${id}/menus/`);
        if (!menuRes.ok) {
          throw new Error('Failed to fetch menu data');
        }

        const menuData = await menuRes.json();
        console.log('Menu Data:', menuData); // Debug log
        
        if (menuData.menus && menuData.menus.length > 0) {
          setMenuData(menuData.menus[0]); // Get the first menu
        } else {
          throw new Error('No menu found');
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (isLoading) {
    return <div className="text-center py-8">Loading menu...</div>;
  }

  if (!menuData || !restaurant) {
    return <div className="text-center py-8">No menu data available</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => navigate(`/restaurant/${id}`)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Restaurant
        </Button>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h1 className="text-2xl font-bold text-gray-900">
            {restaurant.restaurant_name} - Menu
          </h1>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Section
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dietary Notes
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {menuData.menu_items.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{item.section}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {item.price ? `$${item.price.toFixed(2)}` : '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{item.description || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {item.dietary_restrictions?.join(', ') || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}