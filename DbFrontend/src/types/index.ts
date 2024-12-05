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
  dietary_restrictions?: string[];
  section: string;
}

export interface MenuData {
  Id: string;
  menu_items: MenuItem[];
  version: number;
  last_updated: string;
}
