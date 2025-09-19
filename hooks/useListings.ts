import { useState, useEffect, useCallback } from 'react';
import { apiClient, TokenManager } from '@/lib/api-client';

export interface PropertyListing {
  _id: string;
  id: string;
  title: string;
  description?: string;
  price: {
    amount: number;
    currency: string;
  } | number;
  currency?: string;
  property_type?: string;
  listing_type?: string;
  location?: {
    city?: string;
    district?: string;
    address?: string;
    coordinates?: {
      lat: number;
      lon: number;
    };
  };
  address?: string;
  area?: number;
  rooms?: number;
  floor?: number;
  total_floors?: number;
  images?: string[];
  contact_info?: {
    phone?: string;
    name?: string;
    email?: string;
  };
  phone?: string;
  contact_person?: string;
  source?: {
    platform?: string;
    url?: string;
    original_listing_id?: string;
  } | string;
  external_id?: string;
  url?: string;
  category?: string;
  created_at?: string;
  updated_at?: string;
  parsed_at?: string;
  is_active?: boolean;
  features?: string[] | object;
  owner_type?: string;
  // Додаткові поля для спарсених оголошень
  status?: string;
  confidence_score?: number;
}

export interface PropertyFilters {
  property_type?: string;
  listing_type?: string;
  city?: string;
  district?: string;
  min_price?: number;
  max_price?: number;
  min_area?: number;
  max_area?: number;
  rooms?: number;
  min_floor?: number;
  max_floor?: number;
  search?: string;
  // Додаткові фільтри для спарсених оголошень
  source?: string;
  status_filter?: string;
  currency?: string;
  min_rooms?: number;
  max_rooms?: number;
  search_text?: string;
  sort_by?: string;
  sort_order?: string;
}

export interface ApiResponse {
  data: PropertyListing[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  status_code: number;
}

export const useListings = (
  initialFilters: PropertyFilters = {},
  initialPage: number = 1,
  perPage: number = 12
) => {
  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState<PropertyFilters>(initialFilters);

  const fetchListings = useCallback(async () => {
    console.log('useListings fetchListings called');
    
    setLoading(true);
    setError(null);
    
    try {
      const params: any = {
        page: page,
        limit: perPage,
        // Додаємо сортування за датою парсингу (найновіші спочатку)
        sort_by: 'parsed_at',
        sort_order: 'desc',
      };
      
      if (filters.search) params.search_text = filters.search;
      if (filters.search_text) params.search_text = filters.search_text;
      if (filters.property_type) params.property_type = filters.property_type;
      if (filters.source) params.source = filters.source;
      if (filters.status_filter) params.status_filter = filters.status_filter;
      if (filters.currency) params.currency = filters.currency;
      if (filters.min_price) params.min_price = filters.min_price;
      if (filters.max_price) params.max_price = filters.max_price;
      if (filters.min_area) params.min_area = filters.min_area;
      if (filters.max_area) params.max_area = filters.max_area;
      if (filters.min_rooms) params.min_rooms = filters.min_rooms;
      if (filters.max_rooms) params.max_rooms = filters.max_rooms;
      if (filters.city) params.city = filters.city;
      // Дозволяємо перевизначити сортування через фільтри якщо потрібно
      if (filters.sort_by) params.sort_by = filters.sort_by;
      if (filters.sort_order) params.sort_order = filters.sort_order;
      
      console.log('Fetching parsed listings with params:', params);
      
      // Використовуємо проксі API замість прямого запиту
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const token = TokenManager.getAccessToken();
      
      if (!token) {
        throw new Error('Токен авторизації відсутній');
      }

      const response = await fetch(`/api/parsed-listings?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        try {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        } catch (e) {
          // Якщо не можемо розпарсити JSON відповідь
          throw new Error(`Помилка сервера: ${response.status} ${response.statusText}`);
        }
      }

      const apiResponse = await response.json();
      
      console.log('API Response:', apiResponse);
      console.log('apiResponse.data:', apiResponse.data);
      console.log('apiResponse.data.listings:', apiResponse.data?.listings);
      console.log('apiResponse.data.pagination:', apiResponse.data?.pagination);
      
      // Отримуємо дані з відповіді
      const apiData = apiResponse.data || {};
      const listingsArray = apiData.listings || [];
      const paginationData = apiData.pagination || {};
      
      console.log('apiData:', apiData);
      console.log('listingsArray:', listingsArray);
      console.log('paginationData:', paginationData);
      
      console.log('Setting listings to:', listingsArray);
      console.log('listingsArray length:', listingsArray.length);
      console.log('listingsArray is array:', Array.isArray(listingsArray));
      console.log('Setting total to:', paginationData.total || 0);
      console.log('Setting totalPages to:', paginationData.pages || 1);
      
      setListings(listingsArray);
      setTotal(paginationData.total || 0);
      setTotalPages(paginationData.pages || 1);
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setListings([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, filters]);

  // Стабільна функція для зовнішнього використання
  const stableFetchListings = useCallback(() => {
    fetchListings();
  }, [fetchListings]);

  const updateFilters = useCallback((newFilters: PropertyFilters) => {
    setFilters(newFilters);
    setPage(1); // Скидаємо на першу сторінку при зміні фільтрів
  }, []);

  const updatePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
    setPage(1);
  }, []);

  // Початкове завантаження даних
  useEffect(() => {
    fetchListings();
  }, []); // Завантажуємо дані лише один раз при ініціалізації

  return {
    listings,
    loading,
    error,
    total,
    page,
    totalPages,
    filters,
    updateFilters,
    updatePage,
    resetFilters,
    refetch: stableFetchListings,
  };
};

export const useListing = (id: string) => {
  const [listing, setListing] = useState<PropertyListing | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchListing = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.parsedListings.getParsedListing(id);
      
      if (response.data?.listing) {
        // Адаптуємо ParsedListing до PropertyListing
        const parsedListing = response.data.listing;
        const adaptedListing: PropertyListing = {
          ...parsedListing,
          id: parsedListing._id || parsedListing.external_id || '',
        };
        setListing(adaptedListing);
      } else {
        throw new Error('Listing not found');
      }
    } catch (err) {
      console.error('Error fetching listing:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setListing(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchListing();
  }, [fetchListing]);

  return {
    listing,
    loading,
    error,
    refetch: fetchListing,
  };
}; 