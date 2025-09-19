import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

// Типи для нерухомості
export type PropertyType = "apartment" | "house" | "commercial" | "land";
export type TransactionType = "sale" | "rent";
export type PropertyStatus = "active" | "inactive" | "sold";

// Інтерфейс для координат
export interface Coordinates {
  lat: number;
  lon: number;
}

// Інтерфейс для локації
export interface PropertyLocation {
  city: string;
  address: string;
  coordinates?: Coordinates;
}

// Інтерфейс для об'єкта нерухомості
export interface Property {
  _id: string;
  title: string;
  description?: string;
  property_type: PropertyType;
  transaction_type: TransactionType;
  price: {
    amount: number;
    currency: string;
  };
  area: number;
  rooms?: number;
  location: PropertyLocation;
  features?: string[];
  images?: string[];
  likes_count?: number;
  status: PropertyStatus;
  is_featured?: boolean;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

// Інтерфейс для фільтрів нерухомості
export interface PropertyFilters {
  city?: string;
  property_type?: PropertyType;
  transaction_type?: TransactionType;
  min_price?: number;
  max_price?: number;
  min_area?: number;
  max_area?: number;
  rooms?: number;
  page?: number;
  limit?: number;
}

// Інтерфейс для пагінації
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Інтерфейс для відповіді зі списком нерухомості
export interface PropertiesResponse {
  properties: Property[];
  pagination?: Pagination;
}

// Інтерфейс для заявки на продаж
export interface SellRequest {
  contact_name: string;
  contact_phone: string;
  contact_email?: string;
  property_type: PropertyType;
  city: string;
  address: string;
  description?: string;
  price?: number;
  area?: number;
  rooms?: number;
}

// Інтерфейс для створення об'єкта нерухомості
export interface CreatePropertyRequest {
  title: string;
  description?: string;
  property_type: PropertyType;
  transaction_type: TransactionType;
  price: {
    amount: number;
    currency: string;
  };
  area: number;
  rooms?: number;
  city: string;
  address: string;
  coordinates?: Coordinates;
  features?: string[];
  images?: string[];
}

// Інтерфейс для оновлення об'єкта нерухомості
export interface UpdatePropertyRequest {
  title?: string;
  description?: string;
  price?: {
    amount: number;
    currency: string;
  };
  area?: number;
  rooms?: number;
  features?: string[];
  images?: string[];
  status?: PropertyStatus;
  is_featured?: boolean;
}
