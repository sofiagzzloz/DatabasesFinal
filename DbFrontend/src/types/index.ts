export interface Restaurant {
  id?: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  website: string;
  country: string; 
}

export interface MenuItem {
  name: string;
  price: number;
  description?: string;
  dietaryNotes?: string[];
  section: string;
}

export interface MenuData {
  restaurantId: string;
  items: MenuItem[];
  version: number;
  lastUpdated: Date;
}
