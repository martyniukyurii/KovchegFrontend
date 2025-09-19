import { useState, useEffect, useCallback } from 'react';
import { apiClient, Deal, CreateDealRequest, UpdateDealRequest, ActivityJournalEntry, CreateActivityJournalRequest, UpdateActivityJournalRequest, ActivityCode } from '@/lib/api-client';

export interface UseDealsResult {
  deals: Deal[];
  loading: boolean;
  error: string | null;
  totalDeals: number;
  totalPages: number;
  currentPage: number;
  fetchDeals: (params?: { page?: number; limit?: number; search?: string; status?: string; deal_type?: string }) => Promise<void>;
  createDeal: (dealData: CreateDealRequest) => Promise<Deal | null>;
  updateDeal: (dealId: string, updateData: UpdateDealRequest) => Promise<Deal | null>;
  deleteDeal: (dealId: string) => Promise<boolean>;
  getDealById: (dealId: string) => Promise<Deal | null>;
  refreshDeals: () => Promise<void>;
}

export function useDeals(): UseDealsResult {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalDeals, setTotalDeals] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchDeals = useCallback(async (params?: { page?: number; limit?: number; search?: string; status?: string; deal_type?: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.getDeals(params);
      
      if (response.status === 'success' && response.data) {
        setDeals(response.data.deals);
        setTotalDeals(response.data.pagination?.total || 0);
        setTotalPages(response.data.pagination?.pages || 0);
        setCurrentPage(params?.page || 1);
      } else {
        throw new Error(response.message || 'Не вдалося завантажити угоди');
      }
    } catch (err: any) {
      console.error('Помилка завантаження угод:', err);
      setError(err.message || 'Помилка завантаження угод');
      setDeals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createDeal = useCallback(async (dealData: CreateDealRequest): Promise<Deal | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.createDeal(dealData);
      
      if (response.status === 'success' && response.data) {
        // Додаємо нову угоду в локальний стан
        setDeals(prev => [response.data!.deal, ...prev]);
        setTotalDeals(prev => prev + 1);
        return response.data!.deal;
      } else {
        throw new Error(response.message || 'Не вдалося створити угоду');
      }
    } catch (err: any) {
      console.error('Помилка створення угоди:', err);
      setError(err.message || 'Помилка створення угоди');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDeal = useCallback(async (dealId: string, updateData: UpdateDealRequest): Promise<Deal | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.updateDeal(dealId, updateData);
      
      if (response.status === 'success' && response.data) {
        // Оновлюємо угоду в локальному стані
        setDeals(prev => prev.map(deal => 
          deal.id === dealId ? response.data!.deal : deal
        ));
        return response.data!.deal;
      } else {
        throw new Error(response.message || 'Не вдалося оновити угоду');
      }
    } catch (err: any) {
      console.error('Помилка оновлення угоди:', err);
      setError(err.message || 'Помилка оновлення угоди');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDeal = useCallback(async (dealId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.deleteDeal(dealId);
      
      if (response.status === 'success') {
        // Видаляємо угоду з локального стану
        setDeals(prev => prev.filter(deal => deal.id !== dealId));
        setTotalDeals(prev => prev - 1);
        return true;
      } else {
        throw new Error(response.message || 'Не вдалося видалити угоду');
      }
    } catch (err: any) {
      console.error('Помилка видалення угоди:', err);
      setError(err.message || 'Помилка видалення угоди');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDealById = useCallback(async (dealId: string): Promise<Deal | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.getDealById(dealId);
      
      if (response.status === 'success' && response.data) {
        return response.data!.deal;
      } else {
        throw new Error(response.message || 'Не вдалося знайти угоду');
      }
    } catch (err: any) {
      console.error('Помилка отримання угоди:', err);
      setError(err.message || 'Помилка отримання угоди');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshDeals = useCallback(async () => {
    await fetchDeals({ page: currentPage });
  }, [fetchDeals, currentPage]);

  // Завантажуємо угоди при монтуванні компонента
  useEffect(() => {
    fetchDeals();
  }, []);

  return {
    deals,
    loading,
    error,
    totalDeals,
    totalPages,
    currentPage,
    fetchDeals,
    createDeal,
    updateDeal,
    deleteDeal,
    getDealById,
    refreshDeals,
  };
}

// Хук для роботи з журналом активності
export interface UseActivityJournalResult {
  entries: ActivityJournalEntry[];
  activityCodes: ActivityCode[];
  loading: boolean;
  error: string | null;
  totalEntries: number;
  totalPages: number;
  currentPage: number;
  fetchActivityJournal: (params?: { deal_id?: string; page?: number; limit?: number }) => Promise<void>;
  fetchActivityCodes: () => Promise<void>;
  createActivityEntry: (entryData: CreateActivityJournalRequest) => Promise<ActivityJournalEntry | null>;
  updateActivityEntry: (entryId: string, updateData: UpdateActivityJournalRequest) => Promise<ActivityJournalEntry | null>;
  deleteActivityEntry: (entryId: string) => Promise<boolean>;
  getActivityEntryById: (entryId: string) => Promise<ActivityJournalEntry | null>;
  clearEntries: () => void;
}

export function useActivityJournal(): UseActivityJournalResult {
  const [entries, setEntries] = useState<ActivityJournalEntry[]>([]);
  const [activityCodes, setActivityCodes] = useState<ActivityCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchActivityCodes = useCallback(async () => {
    try {
      const response = await apiClient.getActivityCodes();
      
      if (response.status === 'success' && response.data) {
        setActivityCodes(response.data.codes);
      }
    } catch (err: any) {
      console.error('Помилка завантаження кодів активності:', err);
    }
  }, []);

  const fetchActivityJournal = useCallback(async (params?: { deal_id?: string; page?: number; limit?: number }) => {
    setLoading(true);
    setError(null);
    console.log('🔄 Завантажуємо журнал активності з параметрами:', params);
    
    try {
      const response = await apiClient.getActivityJournal(params);
      
      if (response.status === 'success' && response.data) {
        console.log('✅ Отримали записи журналу:', response.data.entries.length, 'записів');
        console.log('📄 Записи:', response.data.entries);
        
        // Фільтруємо записи за deal_id на фронтенді (тимчасово, поки бекенд не виправлений)
        let filteredEntries = response.data.entries;
        if (params?.deal_id) {
          console.log('🎯 Фільтруємо для угоди:', params.deal_id);
          console.log('📋 Всі записи з бази:', response.data.entries.map((e: any) => ({
            id: e._id,
            description: e.description,
            related_object_id: e.related_object_id,
            user_id: e.user_id
          })));
          
          filteredEntries = response.data.entries.filter((entry: any) => {
            // Записи можуть мати related_object_id що відповідає deal_id
            const isMatchingDeal = entry.related_object_id === params.deal_id || 
                                   entry.deal_id === params.deal_id;
            
            console.log('🔍 Перевіряємо запис:', {
              entryId: entry._id,
              description: entry.description,
              relatedObjectId: entry.related_object_id,
              dealId: entry.deal_id,
              targetDealId: params.deal_id,
              isMatch: isMatchingDeal
            });
            
            return isMatchingDeal;
          });
          console.log('✅ Відфільтровані записи для угоди', params.deal_id, ':', filteredEntries.length, 'записів');
          console.log('📄 Фінальні записи:', filteredEntries.map((e: any) => ({
            id: e._id,
            description: e.description,
            related_object_id: e.related_object_id
          })));
        }
        
        setEntries(filteredEntries);
        setTotalEntries(filteredEntries.length);
        setTotalPages(Math.ceil(filteredEntries.length / (params?.limit || 10)));
        setCurrentPage(params?.page || 1);
      } else {
        throw new Error(response.message || 'Не вдалося завантажити журнал активності');
      }
    } catch (err: any) {
      console.error('Помилка завантаження журналу активності:', err);
      setError(err.message || 'Помилка завантаження журналу активності');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createActivityEntry = useCallback(async (entryData: CreateActivityJournalRequest): Promise<ActivityJournalEntry | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.createActivityJournalEntry(entryData);
      
      if (response.status === 'success' && response.data) {
        // Додаємо новий запис в локальний стан
        setEntries(prev => [response.data!.entry, ...prev]);
        setTotalEntries(prev => prev + 1);
        return response.data!.entry;
      } else {
        throw new Error(response.message || 'Не вдалося створити запис');
      }
    } catch (err: any) {
      console.error('Помилка створення запису:', err);
      setError(err.message || 'Помилка створення запису');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateActivityEntry = useCallback(async (entryId: string, updateData: UpdateActivityJournalRequest): Promise<ActivityJournalEntry | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.updateActivityJournalEntry(entryId, updateData);
      
      if (response.status === 'success' && response.data) {
        // Оновлюємо запис в локальному стані
        setEntries(prev => prev.map(entry => 
          entry.id === entryId ? response.data!.entry : entry
        ));
        return response.data!.entry;
      } else {
        throw new Error(response.message || 'Не вдалося оновити запис');
      }
    } catch (err: any) {
      console.error('Помилка оновлення запису:', err);
      setError(err.message || 'Помилка оновлення запису');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteActivityEntry = useCallback(async (entryId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.deleteActivityJournalEntry(entryId);
      
      if (response.status === 'success') {
        // Видаляємо запис з локального стану
        setEntries(prev => prev.filter(entry => entry.id !== entryId));
        setTotalEntries(prev => prev - 1);
        return true;
      } else {
        throw new Error(response.message || 'Не вдалося видалити запис');
      }
    } catch (err: any) {
      console.error('Помилка видалення запису:', err);
      setError(err.message || 'Помилка видалення запису');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getActivityEntryById = useCallback(async (entryId: string): Promise<ActivityJournalEntry | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.getActivityJournalEntry(entryId);
      
      if (response.status === 'success' && response.data) {
        return response.data!.entry;
      } else {
        throw new Error(response.message || 'Не вдалося знайти запис');
      }
    } catch (err: any) {
      console.error('Помилка отримання запису:', err);
      setError(err.message || 'Помилка отримання запису');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Завантажуємо коди активності при монтуванні
  useEffect(() => {
    fetchActivityCodes();
  }, [fetchActivityCodes]);

  const clearEntries = useCallback(() => {
    setEntries([]);
    setTotalEntries(0);
    setTotalPages(0);
    setCurrentPage(1);
    setError(null);
  }, []);

  return {
    entries,
    activityCodes,
    loading,
    error,
    totalEntries,
    totalPages,
    currentPage,
    fetchActivityJournal,
    fetchActivityCodes,
    createActivityEntry,
    updateActivityEntry,
    deleteActivityEntry,
    getActivityEntryById,
    clearEntries,
  };
}