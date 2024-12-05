import React, { useState } from 'react';
import { RestaurantForm } from './RestaurantForm';
import { FileUpload } from './FileUpload';
import { MenuReview } from './MenuReview';
import { Restaurant, MenuItem } from '@/types';
import { ChevronRight } from 'lucide-react';

export function AddRestaurant() {
  const [step, setStep] = useState(1);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleRestaurantSubmit = async (data: Restaurant) => {
    setIsLoading(true);
    try {
      const backendData = {
        restaurant_name: data.name,
        address: data.address,
        city: data.city,
        country: data.country,
        website_link: data.website,
        contact_number: data.phone,
      };
  
      const response = await fetch('http://127.0.0.1:8000/etl/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backendData)
      });
  
      if (!response.ok) {
        const errorDetails = await response.text();
        console.error('Error Response from Server:', errorDetails);
        throw new Error('Failed to save restaurant information.');
      }
  
      const result = await response.json();
      setRestaurant({ ...data, id: result.id });  // Change this line
      setStep(2);
    } catch (error) {
      console.error(error);
      alert('Error saving restaurant information');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFileUpload = async (file: File) => {
    if (!restaurant) {
      alert('Please complete step 1 before uploading a menu.');
      return;
    }
  
    setIsLoading(true);
    const formData = new FormData();
    formData.append('menu_pdf', file);
    formData.append('restaurant_id', restaurant.id.toString());
  
    try {
      const response = await fetch('http://127.0.0.1:8000/etl/', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server Error:', errorText);
        throw new Error('Failed to process menu PDF.');
      }
  
      const result = await response.json();
      if (result.menu_items && Array.isArray(result.menu_items)) {
        setMenuItems(result.menu_items);
        setStep(3);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error processing menu PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMenuSave = async (items: MenuItem[]) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/etl/save_menu/', {  // New endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurant_id: restaurant?.id,
          menu_items: items,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save menu data.');
      }
  
      setMenuItems(items);
      setStep(4);
    } catch (error) {
      console.error(error);
      alert('Error saving menu data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="bg-white shadow rounded-lg p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((number) => (
            <React.Fragment key={number}>
              <div className="flex items-center">
                <div
                  className={`rounded-full h-8 w-8 flex items-center justify-center ${
                    step >= number
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {number}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {number === 1 && 'Restaurant Info'}
                  {number === 2 && 'Upload Menu'}
                  {number === 3 && 'Review Data'}
                  {number === 4 && 'Finalize'}
                </span>
              </div>
              {number < 4 && (
                <ChevronRight className="h-5 w-5 text-gray-400" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      {step === 1 && (
        <>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Add Restaurant Information
          </h2>
          <RestaurantForm
            onSubmit={handleRestaurantSubmit}
            isLoading={isLoading}
          />
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Upload Menu PDF
          </h2>
          <FileUpload onFileSelect={handleFileUpload} isLoading={isLoading} />
        </>
      )}

      {step === 3 && (
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Review Extracted Menu Data
          </h2>
          {isLoading ? (
            <div className="text-center py-8">
              <p>Processing menu data...</p>
            </div>
          ) : menuItems.length > 0 ? (
            <MenuReview
              items={menuItems}
              onSave={handleMenuSave}
              onReprocess={() => setStep(2)}
              isLoading={isLoading}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-red-600">No menu items were extracted. Please try again.</p>
              <Button onClick={() => setStep(2)} variant="outline" className="mt-4">
                Upload Again
              </Button>
            </div>
          )}
        </div>
      )}

      {step === 4 && (
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Menu Successfully Processed!
          </h2>
          <p className="text-gray-600 mb-8">
            Your menu has been successfully processed and saved to the database.
          </p>
        </div>
      )}
    </div>
  );
}
