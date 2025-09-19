import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import type { Property, CreatePropertyRequest, UpdatePropertyRequest } from '@/types';

export interface UsePropertiesResult {
  properties: Property[];
  loading: boolean;
  error: string | null;
  totalProperties: number;
  totalPages: number;
  currentPage: number;
  fetchProperties: (params?: any) => Promise<void>;
  createProperty: (propertyData: CreatePropertyRequest) => Promise<boolean>;
  updateProperty: (propertyId: string, propertyData: UpdatePropertyRequest) => Promise<boolean>;
  deleteProperty: (propertyId: string) => Promise<boolean>;
  getPropertyById: (propertyId: string) => Promise<Property | null>;
  refreshProperties: () => Promise<void>;
}

export function useProperties(): UsePropertiesResult {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalProperties, setTotalProperties] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProperties = useCallback(async (params: any = {}) => {
    setLoading(true);
    setError(null);

    try {
             const response = await apiClient.getMyProperties(params.page, params.limit);
      
      if (response.status === 'success' && response.data) {
        setProperties(response.data.properties || []);
        setTotalProperties(response.data.pagination?.total || 0);
        setTotalPages(response.data.pagination?.pages || 1);
        setCurrentPage(response.data.pagination?.page || 1);
      } else {
        throw new Error(response.message || 'Помилка отримання даних');
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err instanceof Error ? err.message : 'Невідома помилка');
      setProperties([]);
      setTotalProperties(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProperty = useCallback(async (propertyData: CreatePropertyRequest): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await apiClient.createProperty(propertyData);
      
      if (response.status === 'success') {
        await refreshProperties();
        return true;
      } else {
        setError(response.message || 'Помилка створення нерухомості');
        return false;
      }
    } catch (err) {
      console.error('Error creating property:', err);
      setError(err instanceof Error ? err.message : 'Помилка створення нерухомості');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProperty = useCallback(async (propertyId: string, propertyData: UpdatePropertyRequest): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await apiClient.updateProperty(propertyId, propertyData);
      
      if (response.status === 'success') {
        await refreshProperties();
        return true;
      } else {
        setError(response.message || 'Помилка оновлення нерухомості');
        return false;
      }
    } catch (err) {
      console.error('Error updating property:', err);
      setError(err instanceof Error ? err.message : 'Помилка оновлення нерухомості');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProperty = useCallback(async (propertyId: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await apiClient.deleteProperty(propertyId);
      
      if (response.status === 'success') {
        await refreshProperties();
        return true;
      } else {
        setError(response.message || 'Помилка видалення нерухомості');
        return false;
      }
    } catch (err) {
      console.error('Error deleting property:', err);
      setError(err instanceof Error ? err.message : 'Помилка видалення нерухомості');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPropertyById = useCallback(async (propertyId: string): Promise<Property | null> => {
    try {
      setLoading(true);
      const response = await apiClient.getPropertyById(propertyId);

      if (response.status === 'success' && response.data) {
        return response.data.property;
      } else {
        setError(response.message || 'Помилка отримання нерухомості');
        return null;
      }
    } catch (err) {
      console.error('Error getting property by ID:', err);
      setError(err instanceof Error ? err.message : 'Помилка отримання нерухомості');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshProperties = useCallback(async () => {
    await fetchProperties({ page: 1, limit: 20 });
  }, [fetchProperties]);

  // Початкове завантаження
  useEffect(() => {
    fetchProperties({ page: 1, limit: 20 });
  }, []);

  return {
    properties,
    loading,
    error,
    totalProperties,
    totalPages,
    currentPage,
    fetchProperties,
    createProperty,
    updateProperty,
    deleteProperty,
    getPropertyById,
    refreshProperties,
  };
}

// Хук для роботи з одним об'єктом нерухомості
export const useProperty = (propertyId?: string) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProperty = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.getPropertyById(id);

      if (response.status === 'success' && response.data) {
        setProperty(response.data.property);
      } else {
        setError(response.message || 'Помилка завантаження властивості');
      }
    } catch (error: any) {
      setError(error.message || 'Помилка мережі');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Оновлення властивості
  const updateProperty = useCallback(async (id: string, updateData: UpdatePropertyRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.updateProperty(id, updateData);

      if (response.status === 'success') {
        // Перезавантажуємо властивість після оновлення
        await loadProperty(id);
        return true;
      } else {
        setError(response.message || 'Помилка оновлення властивості');
        return false;
      }
    } catch (error: any) {
      setError(error.message || 'Помилка мережі');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [loadProperty]);

  // Видалення властивості
  const deleteProperty = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.deleteProperty(id);

      if (response.status === 'success') {
        setProperty(null);
        return true;
      } else {
        setError(response.message || 'Помилка видалення властивості');
        return false;
      }
    } catch (error: any) {
      setError(error.message || 'Помилка мережі');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Завантаження при зміні ID
  useEffect(() => {
    if (propertyId) {
      loadProperty(propertyId);
    }
  }, [propertyId, loadProperty]);

  return {
    property,
    isLoading,
    error,
    loadProperty,
    updateProperty,
    deleteProperty,
  };
};

// Хук для роботи з моїми властивостями (для адмінів)
export const useMyProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const loadMyProperties = useCallback(async (page: number = 1, limit: number = 10) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.getMyProperties(page, limit);

      if (response.status === 'success' && response.data) {
        setProperties(response.data.properties || []);
        setTotalPages(response.data.pagination?.pages || 1);
        setCurrentPage(response.data.pagination?.page || 1);
        setTotal(response.data.pagination?.total || 0);
      } else {
        setError(response.message || 'Помилка завантаження моїх властивостей');
      }
    } catch (error: any) {
      setError(error.message || 'Помилка мережі');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Створення нової властивості
  const createProperty = useCallback(async (propertyData: CreatePropertyRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.createProperty(propertyData);

      if (response.status === 'success') {
        // Перезавантажуємо список після створення
        await loadMyProperties();
        return response.data?.property_id || true;
      } else {
        setError(response.message || 'Помилка створення властивості');
        return false;
      }
    } catch (error: any) {
      setError(error.message || 'Помилка мережі');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [loadMyProperties]);

  // Початкове завантаження
  useEffect(() => {
    loadMyProperties();
  }, []); // Видаляємо loadMyProperties з залежностей

  // Оновлення властивості
  const updateProperty = useCallback(async (id: string, updateData: UpdatePropertyRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.updateProperty(id, updateData);

      if (response.status === 'success') {
        // Перезавантажуємо список після оновлення
        await loadMyProperties();
        return true;
      } else {
        setError(response.message || 'Помилка оновлення властивості');
        return false;
      }
    } catch (error: any) {
      setError(error.message || 'Помилка мережі');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [loadMyProperties]);

  // Видалення властивості
  const deleteProperty = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.deleteProperty(id);

      if (response.status === 'success') {
        // Перезавантажуємо список після видалення
        await loadMyProperties(currentPage);
        return true;
      } else {
        setError(response.message || 'Помилка видалення властивості');
        return false;
      }
    } catch (error: any) {
      setError(error.message || 'Помилка мережі');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [loadMyProperties, currentPage]);

  // Перехід на сторінку
  const goToPage = useCallback((page: number) => {
    loadMyProperties(page);
  }, [loadMyProperties]);

  return {
    properties,
    isLoading,
    error,
    totalPages,
    currentPage,
    total,
    loadMyProperties,
    createProperty,
    updateProperty,
    deleteProperty,
    goToPage,
    refresh: () => loadMyProperties(currentPage),
  };
};

// Хук для роботи з улюбленими властивостями
export const useFavoriteProperties = () => {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFavorites = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.getFavoriteProperties();

      if (response.status === 'success' && response.data) {
        setFavorites(response.data.favorites || []);
      } else {
        setError(response.message || 'Помилка завантаження улюблених');
      }
    } catch (error: any) {
      setError(error.message || 'Помилка мережі');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Додавання до улюблених
  const addToFavorites = useCallback(async (propertyId: string) => {
    try {
      const response = await apiClient.addToFavorites(propertyId);

      if (response.status === 'success') {
        await loadFavorites();
        return true;
      } else {
        setError(response.message || 'Помилка додавання до улюблених');
        return false;
      }
    } catch (error: any) {
      setError(error.message || 'Помилка мережі');
      return false;
    }
  }, [loadFavorites]);

  // Видалення з улюблених
  const removeFromFavorites = useCallback(async (propertyId: string) => {
    try {
      const response = await apiClient.removeFromFavorites(propertyId);

      if (response.status === 'success') {
        await loadFavorites();
        return true;
      } else {
        setError(response.message || 'Помилка видалення з улюблених');
        return false;
      }
    } catch (error: any) {
      setError(error.message || 'Помилка мережі');
      return false;
    }
  }, [loadFavorites]);

  // Перевірка чи є властивість в улюблених
  const isFavorite = useCallback((propertyId: string) => {
    return favorites.some(fav => fav._id === propertyId);
  }, [favorites]);

  // Початкове завантаження
  useEffect(() => {
    loadFavorites();
  }, []); // Видаляємо loadFavorites з залежностей

  return {
    favorites,
    isLoading,
    error,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    refresh: loadFavorites,
  };
};

// Хук для подання заявки на продаж
export const useSellRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const submitSellRequest = useCallback(async (sellData: any) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await apiClient.submitSellRequest(sellData);

      if (response.status === 'success') {
        setSuccess(response.data?.message || 'Заявка успішно подана');
        return response.data?.request_id || true;
      } else {
        setError(response.message || 'Помилка подання заявки');
        return false;
      }
    } catch (error: any) {
      setError(error.message || 'Помилка мережі');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  return {
    isLoading,
    error,
    success,
    submitSellRequest,
    clearMessages,
  };
}; 