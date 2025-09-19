import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import type { Property } from '@/types';
import type { ApiResponse } from '@/lib/api-client';

interface PropertiesResponse {
  properties: Property[];
  pagination: {
    pages: number;
    total: number;
    page: number;
    limit: number;
  };
}

export function useAllProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchProperties = async (page = 1, limit = 20) => {
    try {
      setIsLoading(true);
      const response = await apiClient.getAllPropertiesAdmin(page, limit);
      console.log('useAllProperties response:', response);
      
      if (response.status === 'success' && response.data) {
        console.log('useAllProperties data:', response.data);
        setProperties(response.data.properties);
        setTotalPages(response.data.pagination?.pages || 1);
        setTotal(response.data.pagination?.total || response.data.properties.length);
        setCurrentPage(page);
        setError(null);
      } else {
        setError(response.message || 'Помилка при завантаженні об\'єктів нерухомості');
      }
    } catch (err: any) {
      console.error('useAllProperties error:', err);
      setError(err.message || 'Помилка при завантаженні об\'єктів нерухомості');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchProperties(page);
    }
  };

  const deleteProperty = async (id: string): Promise<boolean> => {
    try {
      await apiClient.deleteProperty(id);
      await fetchProperties(currentPage);
      return true;
    } catch (err) {
      setError('Помилка при видаленні об\'єкту нерухомості');
      return false;
    }
  };

  const refresh = () => {
    fetchProperties(currentPage);
  };

  return {
    properties,
    isLoading,
    error,
    totalPages,
    currentPage,
    total,
    goToPage,
    deleteProperty,
    refresh
  };
}