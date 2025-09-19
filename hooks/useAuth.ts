import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { apiClient, TokenManager, Admin, AdminLoginRequest, TelegramAuthRequest } from '@/lib/api-client';

interface AuthState {
  isAuthenticated: boolean;
  admin: Admin | null;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    admin: null,
    isLoading: true,
    error: null,
  });

  // Перевірка аутентифікації при завантаженні компонента
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = TokenManager.isAuthenticated();
      const adminData = TokenManager.getAdminData();
      
      setAuthState({
        isAuthenticated: isAuth,
        admin: adminData,
        isLoading: false,
        error: null,
      });
    };

    checkAuth();
  }, []);

  // Вхід адміністратора
  const login = useCallback(async (credentials: AdminLoginRequest): Promise<boolean> => {
    console.log('🔐 useAuth.login викликано з:', { email: credentials.email, password: '***' });
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      console.log('📡 Викликаємо apiClient.adminLogin...');
      const response = await apiClient.adminLogin(credentials);
      console.log('📥 Отримано відповідь від API:', response);
      
      if (response.status === 'success' && response.data) {
        console.log('✅ Успішна аутентифікація:', response.data.admin);
        setAuthState({
          isAuthenticated: true,
          admin: response.data.admin,
          isLoading: false,
          error: null,
        });
        return true;
      } else {
        console.log('❌ Помилка аутентифікації:', response.message);
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: response.message || 'Помилка входу',
        }));
        return false;
      }
    } catch (error: any) {
      console.error('❌ Помилка в useAuth.login:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Помилка мережі',
      }));
      return false;
    }
  }, []);

  // Вхід через Telegram
  const telegramLogin = useCallback(async (authData: TelegramAuthRequest): Promise<boolean> => {
    console.log('🤖 useAuth.telegramLogin викликано з:', authData);
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await apiClient.telegramLogin(authData);
      console.log('📥 Telegram відповідь від API:', response);
      
      if (response.status === 'success') {
        // Перевіряємо чи є токени (зареєстрований адмін)
        if (response.data?.access_token && response.data?.admin) {
          console.log('✅ Успішна Telegram аутентифікація:', response.data.admin);
          setAuthState({
            isAuthenticated: true,
            admin: response.data.admin,
            isLoading: false,
            error: null,
          });
          return true;
        } 
        // Якщо власник не зареєстрований
        else if (response.data?.is_registered === false) {
          console.log('ℹ️ Власник не зареєстрований:', response.data.telegram_data);
          setAuthState(prev => ({
            ...prev,
            isLoading: false,
            error: 'Власник не зареєстрований. Потрібна реєстрація через бот або Web App.',
          }));
          return false;
        }
      } 
      
      // Інші випадки помилок
      console.log('❌ Помилка Telegram аутентифікації:', response.message);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: response.message || 'Помилка входу через Telegram',
      }));
      return false;
    } catch (error: any) {
      console.error('❌ Помилка в useAuth.telegramLogin:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Помилка мережі',
      }));
      return false;
    }
  }, []);

  // Вихід з системи
  const logout = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }

    setAuthState({
      isAuthenticated: false,
      admin: null,
      isLoading: false,
      error: null,
    });

    // Перенаправляємо на сторінку входу
    router.push('/admin');
  }, [router]);

  // Оновлення токена
  const refreshAuth = useCallback(async (): Promise<boolean> => {
    try {
      await apiClient.refreshToken();
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  }, [logout]);

  // Перевірка доступу до захищених сторінок
  const requireAuth = useCallback((redirectTo = '/admin') => {
    if (!authState.isLoading && !authState.isAuthenticated) {
      router.push(redirectTo);
      return false;
    }
    return authState.isAuthenticated;
  }, [authState.isAuthenticated, authState.isLoading, router]);

  return {
    ...authState,
    login,
    telegramLogin,
    logout,
    refreshAuth,
    requireAuth,
  };
}; 