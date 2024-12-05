export interface Restaurant {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  website_link: string;
  country_number: string; 
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
