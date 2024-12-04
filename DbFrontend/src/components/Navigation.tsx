import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UtensilsCrossed, PlusCircle } from 'lucide-react';

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <UtensilsCrossed className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Restaurant Manager
              </span>
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                location.pathname === '/'
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              View Restaurants
            </Link>
            <Link
              to="/add-restaurant"
              className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                location.pathname === '/add-restaurant'
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <PlusCircle className="h-5 w-5 mr-1" />
              Add Restaurant
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}