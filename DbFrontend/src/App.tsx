import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { RestaurantList } from './components/RestaurantList';
import { RestaurantDetail } from './components/RestaurantDetail';
import { AddRestaurant } from './components/AddRestaurant';
import { MenuDetail } from './components/MenuDetail';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<RestaurantList />} />
            <Route path="/add-restaurant" element={<AddRestaurant />} />
            <Route path="/restaurant/:id" element={<RestaurantDetail />} />
            <Route path="/restaurant/:id/menu/:version" element={<MenuDetail />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;