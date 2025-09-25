// API клієнт для роботи з бекендом (лендінг версія)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002';

// Стандартна структура відповіді API
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  details?: any;
  status_code: number;
}

export interface PropertyListing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  property_type: string;
  listing_type: string;
  address: string;
  city: string;
  rooms?: number;
  area?: number;
  floor?: number;
  total_floors?: number;
  images: string[];
  contact_info?: {
    phone?: string;
    email?: string;
    name?: string;
  };
  original_url?: string;
  created_at: string;
  updated_at: string;
}

// Інтерфейси для спарсених оголошень
export interface ParsedListing {
  _id: string;
  source: string;
  external_id: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
  property_type?: string;
  area?: number;
  rooms?: number;
  location?: {
    city?: string;
    address?: string;
    coordinates?: {
      lat: number;
      lon: number;
    };
  };
  images?: string[];
  contact_info?: {
    phone?: string;
    name?: string;
  };
  features?: string[];
  url?: string;
  status: string;
  confidence_score?: number;
  parsed_at: string;
  created_at: string;
}

export interface ParsedListingsResponse extends ApiResponse {
  data?: {
    listings: ParsedListing[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface ParsedListingResponse extends ApiResponse {
  data?: {
    listing: ParsedListing;
  };
}

export interface LegacyPropertyFilters {
  search?: string;
  property_type?: string;
  listing_type?: string;
  min_price?: number;
  max_price?: number;
  rooms?: number;
  city?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// Імпортуємо типи для нерухомості
import type { 
  Property, 
  PropertyFilters, 
  PropertiesResponse, 
  SellRequest, 
  PropertyType,
  TransactionType 
} from '@/types';

// Утиліти для роботи з токенами (спрощені для лендінгу)
export class TokenManager {
  private static ACCESS_TOKEN_KEY = 'kovcheg_access_token';

  static getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }
    return null;
  }
}

// Базовий клієнт для API запитів
export class ApiClient {
  private baseUrl: string;
  public parsedListings: ParsedListingsApiClient;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.parsedListings = new ParsedListingsApiClient();
  }

  private getToken(): string | null {
    return TokenManager.getAccessToken();
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Видаляємо зайві слеші
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    
    // Використовуємо локальний проксі
    const url = `/api/proxy?path=${encodeURIComponent(cleanEndpoint)}`;
    
    console.log('🌐 API Request:', {
      method: options.method || 'GET',
      url,
      endpoint,
      hasBody: !!options.body
    });
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    // Додаємо токен тільки якщо він є
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log('📥 API Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      const data = await response.json();
      console.log('📄 API Response Data:', data);

      if (!response.ok) {
        const errorMessage = data.message || `API Error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('❌ API request failed:', error);
      throw error;
    }
  }

  // ===================
  // ПУБЛІЧНІ МЕТОДИ ДЛЯ ЛЕНДІНГУ
  // ===================

  // 1. Отримати топові пропозиції (публічний)
  async getTopProperties(limit?: number): Promise<ApiResponse<PropertiesResponse>> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    
    const endpoint = `/properties/top${params.toString() ? `?${params}` : ''}`;
    return this.request<ApiResponse<PropertiesResponse>>(endpoint);
  }

  // 2. Пошук нерухомості для купівлі (публічний)
  async getBuyProperties(filters: PropertyFilters = {}): Promise<ApiResponse<PropertiesResponse>> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const endpoint = `/properties/buy${params.toString() ? `?${params}` : ''}`;
    return this.request<ApiResponse<PropertiesResponse>>(endpoint);
  }

  // 3. Пошук нерухомості для оренди (публічний)
  async getRentProperties(filters: PropertyFilters = {}): Promise<ApiResponse<PropertiesResponse>> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const endpoint = `/properties/rent${params.toString() ? `?${params}` : ''}`;
    return this.request<ApiResponse<PropertiesResponse>>(endpoint);
  }

  // 4. Подати заявку на продаж (публічний)
  async submitSellRequest(sellData: SellRequest): Promise<ApiResponse<{ message: string; request_id: string }>> {
    return this.request<ApiResponse<{ message: string; request_id: string }>>('/properties/sell', {
      method: 'POST',
      body: JSON.stringify(sellData),
    });
  }

  // Комбінований метод для отримання всіх властивостей (купівля + оренда)
  async getAllProperties(filters: PropertyFilters & { transaction_type?: TransactionType } = {}): Promise<ApiResponse<PropertiesResponse>> {
    const { transaction_type, ...otherFilters } = filters;
    
    if (transaction_type === 'sale') {
      return this.getBuyProperties(otherFilters);
    } else if (transaction_type === 'rent') {
      return this.getRentProperties(otherFilters);
    } else {
      // Якщо тип не вказано, отримуємо купівлю за замовчуванням
      return this.getBuyProperties(otherFilters);
    }
  }

  // Отримання списку оголошень (використовуємо новий клієнт)
  async getListings(params: {
    page?: number;
    per_page?: number;
    search?: string;
    property_type?: string;
    listing_type?: string;
    min_price?: number;
    max_price?: number;
    rooms?: number;
    city?: string;
  } = {}): Promise<any> {
    console.log('📋 API: getListings (legacy) викликано з фільтрами:', params);
    
    // Конвертуємо старі параметри в нові
    const convertedParams: any = {
      page: params.page,
      limit: params.per_page,
      search_text: params.search,
      property_type: params.property_type,
      min_price: params.min_price,
      max_price: params.max_price,
      city: params.city,
    };
    
    if (params.rooms) {
      convertedParams.min_rooms = params.rooms;
    }
    
    const parsedClient = new ParsedListingsApiClient();
    const response = await parsedClient.getParsedListings(convertedParams);
    
    // Конвертуємо структуру відповіді в старий формат для сумісності
    return {
      data: {
        listings: response.data?.listings || [],
        pagination: response.data?.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          pages: 1
        }
      }
    };
  }

  // Отримання конкретного оголошення (використовуємо новий клієнт)
  async getListing(id: string): Promise<any> {
    const parsedClient = new ParsedListingsApiClient();
    const response = await parsedClient.getParsedListing(id);
    return response.data?.listing;
  }

  // Публічний метод для внутрішніх запитів
  public async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, options);
  }
}

// Клас для роботи з parsed-listings API
class ParsedListingsApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    
    // Використовуємо локальний проксі
    const url = `/api/proxy?path=${encodeURIComponent(cleanEndpoint)}`;

    console.log('🌐 ParsedListings API Request:', {
      method: options.method || 'GET',
      url,
      endpoint,
      hasBody: !!options.body
    });

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    const token = TokenManager.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log('📥 ParsedListings API Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || `API Error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('❌ ParsedListings API request failed:', error);
      throw error;
    }
  }

  async getParsedListings(params: {
    page?: number;
    limit?: number;
    source?: string;
    status_filter?: string;
    property_type?: string;
    min_price?: number;
    max_price?: number;
    currency?: string;
    min_area?: number;
    max_area?: number;
    min_rooms?: number;
    max_rooms?: number;
    city?: string;
    search_text?: string;
    sort_by?: string;
    sort_order?: string;
  } = {}): Promise<ParsedListingsResponse> {
    console.log('📋 ParsedListings API: getParsedListings викликано з параметрами:', params);
    
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    const endpoint = `/parsed-listings${queryParams.toString() ? `?${queryParams}` : ''}`;
    
    return await this.request<ParsedListingsResponse>(endpoint, {
      method: 'GET',
    });
  }

  async getParsedListing(id: string): Promise<ParsedListingResponse> {
    console.log('📄 ParsedListings API: getParsedListing викликано для ID:', id);
    
    return await this.request<ParsedListingResponse>(`/parsed-listings/${id}`, {
      method: 'GET',
    });
  }
}

// Експорт інстансів клієнтів
export const apiClient = new ApiClient();
export const parsedListingsApiClient = new ParsedListingsApiClient();