import React from 'react';
import { Button } from './ui/button';
import { RotateCcw, Save } from 'lucide-react';
import { MenuItem } from '../types/MenuItem';

interface MenuReviewProps {
  items: MenuItem[];
  onSave: (items: MenuItem[]) => void;
  onReprocess: () => void;
  isLoading: boolean;
}

export function MenuReview({ items, onSave, onReprocess, isLoading }: MenuReviewProps) {
  const [editedItems, setEditedItems] = React.useState<MenuItem[]>(items);

  const handleItemChange = (index: number, field: keyof MenuItem, value: string | number | string[]) => {
    const newItems = [...editedItems];
    newItems[index] = { 
      ...newItems[index], 
      [field]: field === 'price' ? parseFloat(value as string) || 0 : value 
    };
    setEditedItems(newItems);
  };

  if (!items.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">No menu items were extracted. Please try uploading again.</p>
        <Button onClick={onReprocess} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reprocess Menu
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
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
            {editedItems.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={item.section}
                    onChange={(e) => handleItemChange(index, 'section', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={item.description || ''}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={item.dietaryNotes?.join(', ') || ''}
                    onChange={(e) => handleItemChange(index, 'dietaryNotes', e.target.value.split(', ').filter(Boolean))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={onReprocess}
          disabled={isLoading}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reprocess Menu
        </Button>
        <Button
          onClick={() => onSave(editedItems)}
          disabled={isLoading}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}