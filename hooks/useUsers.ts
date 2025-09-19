import { useState, useEffect, useCallback } from 'react';
import { apiClient, User, CreateUserRequest, UpdateUserRequest } from '@/lib/api-client';

export interface UseUsersResult {
  users: User[];
  loading: boolean;
  error: string | null;
  totalUsers: number;
  totalPages: number;
  currentPage: number;
  fetchUsers: (params?: { page?: number; limit?: number; search?: string }) => Promise<void>;
  createUser: (userData: CreateUserRequest) => Promise<User | null>;
  updateUser: (userId: string, updateData: UpdateUserRequest) => Promise<User | null>;
  deleteUser: (userId: string) => Promise<boolean>;
  getUserById: (userId: string) => Promise<User | null>;
  refreshUsers: () => Promise<void>;
}

export function useUsers(): UseUsersResult {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchUsers = useCallback(async (params?: { page?: number; limit?: number; search?: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.getUsers(params);
      
      if (response.status === 'success' && response.data) {
        setUsers(response.data.users);
        setTotalUsers(response.data.pagination?.total || 0);
        setTotalPages(response.data.pagination?.pages || 0);
        setCurrentPage(params?.page || 1);
      } else {
        throw new Error(response.message || 'Не вдалося завантажити користувачів');
      }
    } catch (err: any) {
      console.error('Помилка завантаження користувачів:', err);
      setError(err.message || 'Помилка завантаження користувачів');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (userData: CreateUserRequest): Promise<User | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.createUser(userData);
      
      if (response.status === 'success' && response.data) {
        // Додаємо нового користувача в локальний стан
        setUsers(prev => [response.data!.user, ...prev]);
        setTotalUsers(prev => prev + 1);
        return response.data!.user;
      } else {
        throw new Error(response.message || 'Не вдалося створити користувача');
      }
    } catch (err: any) {
      console.error('Помилка створення користувача:', err);
      setError(err.message || 'Помилка створення користувача');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (userId: string, updateData: UpdateUserRequest): Promise<User | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.updateUser(userId, updateData);
      
      if (response.status === 'success' && response.data) {
        // Оновлюємо користувача в локальному стані
        setUsers(prev => prev.map(user => 
          user.id === userId ? response.data!.user : user
        ));
        return response.data!.user;
      } else {
        throw new Error(response.message || 'Не вдалося оновити користувача');
      }
    } catch (err: any) {
      console.error('Помилка оновлення користувача:', err);
      setError(err.message || 'Помилка оновлення користувача');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (userId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.deleteUser(userId);
      
      if (response.status === 'success') {
        // Видаляємо користувача з локального стану
        setUsers(prev => prev.filter(user => user.id !== userId));
        setTotalUsers(prev => prev - 1);
        return true;
      } else {
        throw new Error(response.message || 'Не вдалося видалити користувача');
      }
    } catch (err: any) {
      console.error('Помилка видалення користувача:', err);
      setError(err.message || 'Помилка видалення користувача');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserById = useCallback(async (userId: string): Promise<User | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.getUserById(userId);
      
      if (response.status === 'success' && response.data) {
        return response.data!.user;
      } else {
        throw new Error(response.message || 'Не вдалося знайти користувача');
      }
    } catch (err: any) {
      console.error('Помилка отримання користувача:', err);
      setError(err.message || 'Помилка отримання користувача');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUsers = useCallback(async () => {
    await fetchUsers({ page: currentPage });
  }, [fetchUsers, currentPage]);

  // Завантажуємо користувачів при монтуванні компонента
  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    totalUsers,
    totalPages,
    currentPage,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    refreshUsers,
  };
} 