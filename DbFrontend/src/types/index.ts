export interface Restaurant {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  website_link: string;
  country_number: string; 
}

export interface MenuData {
  id: string;
  version: number;
  last_updated: string;
  menu_items: MenuItem[];
}

export interface MenuItem {
  name: string;
  price: number;
  description?: string;
  section: string;
  dietary_restrictions?: string[];
}