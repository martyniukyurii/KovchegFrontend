// API клієнт для роботи з бекендом
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002';

// Стандартна структура відповіді API
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  details?: any;
  status_code: number;
}

// Типи для адміністраторів
export interface Admin {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  telegram_id?: number;
  role: string;
  is_verified: boolean;
}

// Типи для користувачів/клієнтів
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone: string;
  type: 'individual' | 'company';
  status: 'active' | 'inactive' | 'potential' | 'former';
  priority: 'high' | 'medium' | 'low';
  is_favorite?: boolean;
  address?: string;
  responsible_agent?: string;
  notes?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  last_contact?: string;
  next_contact?: string;
}

export interface CreateUserRequest {
  first_name: string;
  last_name: string;
  email?: string;
  phone: string;
  type: 'individual' | 'company';
  status?: 'active' | 'inactive' | 'potential' | 'former';
  priority?: 'high' | 'medium' | 'low';
  address?: string;
  responsible_agent?: string;
  notes?: string;
  tags?: string[];
}

export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  type?: 'individual' | 'company';
  status?: 'active' | 'inactive' | 'potential' | 'former';
  priority?: 'high' | 'medium' | 'low';
  address?: string;
  responsible_agent?: string;
  notes?: string;
  tags?: string[];
  is_favorite?: boolean;
  last_contact?: string;
  next_contact?: string;
}


// Типи для угод
export interface Deal {
  id: string;
  title: string;
  description?: string;
  deal_type: 'sale' | 'rent' | 'purchase';
  status: 'active' | 'pending' | 'completed' | 'cancelled' | 'on_hold';
  priority: 'high' | 'medium' | 'low';
  value: number;
  currency: string;
  commission_rate?: number;
  commission_amount?: number;
  client_id?: string;
  property_id?: string;
  responsible_agent?: string;
  start_date: string;
  expected_close_date?: string;
  actual_close_date?: string;
  tags?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface CreateDealRequest {
  title: string;
  description?: string;
  type: 'sale' | 'rent' | 'purchase';
  status?: 'active' | 'pending' | 'completed' | 'cancelled' | 'on_hold';
  priority?: 'high' | 'medium' | 'low';
  price: number;
  currency?: string;
  commission?: number;
  client_id: string;
  property_id: string;
  expected_close_date?: string;
  notes?: string;
}

export interface UpdateDealRequest {
  title?: string;
  description?: string;
  type?: 'sale' | 'rent' | 'purchase';
  status?: 'active' | 'pending' | 'completed' | 'cancelled' | 'on_hold';
  priority?: 'high' | 'medium' | 'low';
  price?: number;
  currency?: string;
  commission?: number;
  client_id?: string;
  property_id?: string;
  expected_close_date?: string;
  actual_close_date?: string;
  notes?: string;
}

// Типи для журналу активності
export interface ActivityJournalEntry {
  id: string;
  _id?: string; // API повертає _id замість id
  deal_id: string;
  activity_code: string;
  activity_type: string;
  description: string;
  details?: any;
  created_by: string;
  created_at: string;
  updated_at: string;
  related_object_id?: string;
  related_object_type?: string;
  user_id?: string;
  event_type?: string;
  notes?: string;
  activity_date?: string;
  metadata?: any;
}

export interface CreateActivityJournalRequest {
  deal_id: string;
  event_type: string;
  description: string;
  notes?: string;
  activity_date?: string;
  metadata?: any;
  related_object_id?: string;
  related_object_type?: string;
}

export interface UpdateActivityJournalRequest {
  activity_code?: string;
  description?: string;
  details?: any;
}

export interface ActivityCode {
  code: string;
  name: string;
  description?: string;
  category: string;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse extends ApiResponse {
  data: {
    admin: Admin;
    access_token: string;
    refresh_token: string;
    token_type: string;
  };
}

export interface TelegramAuthRequest {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export interface TelegramAuthResponse extends ApiResponse {
  data: {
    admin?: Admin;
    access_token?: string;
    refresh_token?: string;
    token_type?: string;
    user_type?: string;
    auth_method?: string;
    is_registered?: boolean;
    telegram_data?: {
      id: number;
      first_name?: string;
      last_name?: string;
      username?: string;
      photo_url?: string;
    };
  };
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
  CreatePropertyRequest, 
  UpdatePropertyRequest,
  PropertyType,
  TransactionType 
} from '@/types';

// Утиліти для роботи з токенами
export class TokenManager {
  private static ACCESS_TOKEN_KEY = 'kovcheg_access_token';
  private static REFRESH_TOKEN_KEY = 'kovcheg_refresh_token';
  private static ADMIN_DATA_KEY = 'kovcheg_admin_data';

  static setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  static getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }
    return null;
  }

  static getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
    return null;
  }

  static setAdminData(admin: Admin): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.ADMIN_DATA_KEY, JSON.stringify(admin));
    }
  }

  static getAdminData(): Admin | null {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(this.ADMIN_DATA_KEY);
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  static clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.ADMIN_DATA_KEY);
    }
  }

  static isAuthenticated(): boolean {
    return !!this.getAccessToken();
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
    console.log('🔗 Full URL:', url);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    // Додаємо токен тільки якщо він є
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('🔑 API: додано Authorization header з токеном:', token.substring(0, 20) + '...');
    } else {
      console.log('🔓 API: токен відсутній, перевірте чи авторизовані ви');
      console.log('🔍 TokenManager.isAuthenticated():', TokenManager.isAuthenticated());
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
        // Якщо токен недійсний, очищуємо його
        if (response.status === 401) {
          console.log('🚫 API: 401 помилка, очищуємо токени');
          TokenManager.clearTokens();
        }
        
        // Використовуємо повідомлення з API відповіді
        const errorMessage = data.message || `API Error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('❌ API request failed:', error);
      throw error;
    }
  }

  // Адміністраторські методи
  
  // Вхід адміністратора
  async adminLogin(credentials: AdminLoginRequest): Promise<AdminLoginResponse> {
    console.log('🌐 API: adminLogin викликано з endpoint:', '/admin/auth/login');
    console.log('📤 API: відправляємо дані:', { email: credentials.email, password: '***' });
    
    const response = await this.request<AdminLoginResponse>('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    console.log('📥 API: отримано відповідь adminLogin:', response);

    // Зберігаємо токени та дані адміна
    if (response.status === 'success' && response.data) {
      console.log('✅ API: зберігаємо токени в localStorage');
      TokenManager.setTokens(
        response.data.access_token,
        response.data.refresh_token
      );
      TokenManager.setAdminData(response.data.admin);
    }

    return response;
  }

  // Вхід через Telegram Widget
  async telegramLogin(authData: TelegramAuthRequest): Promise<TelegramAuthResponse> {
    console.log('🤖 API: telegramLogin викликано з endpoint:', '/telegram/widget/authenticate');
    console.log('📤 API: відправляємо Telegram дані:', authData);
    
    const response = await this.request<TelegramAuthResponse>('/telegram/widget/authenticate', {
      method: 'POST',
      body: JSON.stringify(authData),
    });

    console.log('📥 API: отримано відповідь telegramLogin:', response);

    // Зберігаємо токени та дані адміна якщо успішно
    if (response.status === 'success' && response.data?.access_token) {
      console.log('✅ API: зберігаємо токени Telegram входу в localStorage');
      TokenManager.setTokens(
        response.data.access_token,
        response.data.refresh_token!
      );
      if (response.data.admin) {
        TokenManager.setAdminData(response.data.admin);
      }
    }

    return response;
  }

  // Відновлення пароля з fallback ендпойнтами
  async resetPassword(email: string, language: string = 'uk'): Promise<ApiResponse> {
    console.log('🔄 API: resetPassword викликано з email:', email);
    
    // Список можливих ендпойнтів в порядку пріоритету
    const endpoints = [
      '/admin/auth/reset-password',
      '/auth/reset-password', 
      '/admin/reset-password',
      '/reset-password'
    ];

    let lastError: Error | null = null;

    for (const endpoint of endpoints) {
      try {
        console.log(`🔄 API: спробуємо endpoint: ${endpoint}`);
        
        const response = await this.request<ApiResponse>(endpoint, {
          method: 'POST',
          body: JSON.stringify({ email, language }),
        });

        console.log(`✅ API: успішна відповідь з ${endpoint}:`, response);
        return response;
        
      } catch (error: any) {
        console.log(`❌ API: помилка з ${endpoint}:`, error.message);
        lastError = error;
        
        // Якщо це не 404, то не пробуємо інші ендпойнти
        if (!error.message.includes('404')) {
          throw error;
        }
      }
    }

    // Якщо всі ендпойнти повернули 404
    console.error('❌ API: всі ендпойнти resetPassword повернули 404');
    throw new Error('Функція відновлення пароля поки не реалізована на сервері. Зверніться до адміністратора.');
  }

  // Підтвердження відновлення пароля
  async confirmPasswordReset(code: string, newPassword: string): Promise<ApiResponse> {
    console.log('🔄 API: confirmPasswordReset викликано з endpoint:', '/admin/auth/reset-password/confirm');
    
    return this.request<ApiResponse>('/admin/auth/reset-password/confirm', {
      method: 'POST',
      body: JSON.stringify({ code, new_password: newPassword }),
    });
  }

  // Верифікація email
  async verifyEmail(code: string): Promise<ApiResponse> {
    console.log('✉️ API: verifyEmail викликано з endpoint:', '/admin/auth/verify-email');
    
    return this.request<ApiResponse>('/admin/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  // Оновлення токена (через загальний ендпойнт)
  async refreshToken(): Promise<{ access_token: string; refresh_token: string }> {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.request<ApiResponse<{ access_token: string; refresh_token: string }>>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (response.status === 'success' && response.data) {
      TokenManager.setTokens(
        response.data.access_token,
        response.data.refresh_token
      );
    }

    return response.data!;
  }

  // Вихід з системи
  async logout(): Promise<void> {
    try {
      await this.request('/admin/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      TokenManager.clearTokens();
    }
  }

  // Отримати список адміністраторів
  async getAdmins(params: { page?: number; limit?: number } = {}): Promise<ApiResponse<{ admins: Admin[]; pagination: any }>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/admins${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  // Подати заявку на роботу адміном
  async applyForAdmin(applicationData: {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    experience: string;
    motivation: string;
  }): Promise<ApiResponse<any>> {
    return this.request('/admins/apply', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
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

  // Отримання статистики по оголошеннях
  async getListingsStats(): Promise<{
    total: number;
    by_type: Record<string, number>;
    by_city: Record<string, number>;
    avg_price: number;
  }> {
    return this.request('/parsed-listings/stats');
  }

  // Отримання унікальних значень для фільтрів
  async getFilterOptions(): Promise<{
    property_types: string[];
    listing_types: string[];
    cities: string[];
    districts: string[];
  }> {
    return this.request('/parsed-listings/filter-options');
  }

  // Методи для parsed-listings - проксі до окремого клієнта
  async createParsedListing(data: any): Promise<ApiResponse> {
    const parsedClient = new ParsedListingsApiClient();
    return parsedClient.createParsedListing(data);
  }

  async deleteParsedListing(id: string): Promise<ApiResponse> {
    const parsedClient = new ParsedListingsApiClient();
    return parsedClient.deleteParsedListing(id);
  }

  async convertParsedListing(id: string): Promise<ApiResponse> {
    const parsedClient = new ParsedListingsApiClient();
    return parsedClient.convertParsedListing(id);
  }

  async updateParsedListingStatus(id: string, status: string): Promise<ApiResponse> {
    const parsedClient = new ParsedListingsApiClient();
    return parsedClient.updateParsedListingStatus(id, status);
  }

  // ===================
  // PROPERTIES METHODS
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

  // 5. Мої об'єкти нерухомості (потребує токен адміна)
  async getMyProperties(page: number = 1, limit: number = 10): Promise<ApiResponse<PropertiesResponse>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    const endpoint = `/properties/my${params.toString() ? `?${params}` : ''}`;
    return this.request<ApiResponse<PropertiesResponse>>(endpoint);
  }

  // 6. Створити об'єкт нерухомості (потребує токен адміна)
  async createProperty(propertyData: CreatePropertyRequest): Promise<ApiResponse<{ message: string; property_id: string }>> {
    return this.request<ApiResponse<{ message: string; property_id: string }>>('/properties/', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  }

  // 7. Отримати обрані об'єкти (потребує токен користувача)
  async getFavoriteProperties(): Promise<ApiResponse<{ favorites: Property[] }>> {
    return this.request<ApiResponse<{ favorites: Property[] }>>('/properties/favorites');
  }

  // 8. Додати до обраних (потребує токен користувача)
  async addToFavorites(propertyId: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<ApiResponse<{ message: string }>>(`/properties/favorites/${propertyId}`, {
      method: 'POST',
    });
  }

  // 9. Видалити з обраних (потребує токен користувача)
  async removeFromFavorites(propertyId: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<ApiResponse<{ message: string }>>(`/properties/favorites/${propertyId}`, {
      method: 'DELETE',
    });
  }

  // 10. Отримати об'єкт за ID (потребує токен адміна)
  async getPropertyById(propertyId: string): Promise<ApiResponse<{ property: Property }>> {
    return this.request<ApiResponse<{ property: Property }>>(`/properties/${propertyId}`);
  }

  // 11. Оновити об'єкт нерухомості (потребує токен адміна)
  async updateProperty(propertyId: string, updateData: UpdatePropertyRequest): Promise<ApiResponse<{ message: string }>> {
    return this.request<ApiResponse<{ message: string }>>(`/properties/${propertyId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  // 12. Видалити об'єкт нерухомості (потребує токен адміна)
  async deleteProperty(propertyId: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<ApiResponse<{ message: string }>>(`/properties/${propertyId}`, {
      method: 'DELETE',
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

  // Метод для отримання всіх об'єктів з бази (для адмінів)
  async getAllPropertiesAdmin(page: number = 1, limit: number = 10): Promise<ApiResponse<PropertiesResponse>> {
    console.log('🔍 getAllPropertiesAdmin викликано з параметрами:', { page, limit });
    
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    params.append('status', 'active');
    
    const endpoint = `/properties/all${params.toString() ? `?${params}` : ''}`;
    console.log('🔗 getAllPropertiesAdmin endpoint:', endpoint);
    
    return this.request<ApiResponse<PropertiesResponse>>(endpoint);
  }

  // Публічний метод для внутрішніх запитів
  public async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, options);
  }

  // API методи для користувачів

  // Отримати список користувачів
  async getUsers(params: { page?: number; limit?: number; search?: string } = {}): Promise<ApiResponse<{ users: User[]; pagination: any }>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/users/${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  // Створити користувача
  async createUser(userData: CreateUserRequest): Promise<ApiResponse<{ user: User; message: string }>> {
    return this.request<ApiResponse<{ user: User; message: string }>>('/users/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Отримати користувача за ID
  async getUserById(userId: string): Promise<ApiResponse<{ user: User }>> {
    return this.request<ApiResponse<{ user: User }>>(`/users/${userId}/`);
  }

  // Оновити користувача
  async updateUser(userId: string, updateData: UpdateUserRequest): Promise<ApiResponse<{ user: User; message: string }>> {
    return this.request<ApiResponse<{ user: User; message: string }>>(`/users/${userId}/`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  // Видалити користувача
  async deleteUser(userId: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<ApiResponse<{ message: string }>>(`/users/${userId}/`, {
      method: 'DELETE',
    });
  }

  // API методи для угод

  // Отримати список угод
  async getDeals(params: { page?: number; limit?: number; search?: string; status?: string; deal_type?: string } = {}): Promise<ApiResponse<{ deals: Deal[]; pagination: any }>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/deals/${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  // Створити угоду
  async createDeal(dealData: CreateDealRequest): Promise<ApiResponse<{ deal: Deal; message: string }>> {
    return this.request<ApiResponse<{ deal: Deal; message: string }>>('/deals/', {
      method: 'POST',
      body: JSON.stringify(dealData),
    });
  }

  // Отримати угоду за ID
  async getDealById(dealId: string): Promise<ApiResponse<{ deal: Deal }>> {
    return this.request<ApiResponse<{ deal: Deal }>>(`/deals/${dealId}/`);
  }

  // Оновити угоду
  async updateDeal(dealId: string, updateData: UpdateDealRequest): Promise<ApiResponse<{ deal: Deal; message: string }>> {
    return this.request<ApiResponse<{ deal: Deal; message: string }>>(`/deals/${dealId}/`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  // Видалити угоду
  async deleteDeal(dealId: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<ApiResponse<{ message: string }>>(`/deals/${dealId}/`, {
      method: 'DELETE',
    });
  }

  // API методи для журналу активності

  // Отримати коди активності
  async getActivityCodes(): Promise<ApiResponse<{ codes: ActivityCode[] }>> {
    return this.request<ApiResponse<{ codes: ActivityCode[] }>>('/deals/activity-codes');
  }

  // Отримати журнал активності
  async getActivityJournal(params: { deal_id?: string; page?: number; limit?: number } = {}): Promise<ApiResponse<{ entries: ActivityJournalEntry[]; pagination: any }>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/deals/activity-journal${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  // Створити запис в журналі активності
  async createActivityJournalEntry(entryData: CreateActivityJournalRequest): Promise<ApiResponse<{ entry: ActivityJournalEntry; message: string }>> {
    return this.request<ApiResponse<{ entry: ActivityJournalEntry; message: string }>>('/deals/activity-journal', {
      method: 'POST',
      body: JSON.stringify(entryData),
    });
  }

  // Отримати запис журналу за ID
  async getActivityJournalEntry(entryId: string): Promise<ApiResponse<{ entry: ActivityJournalEntry }>> {
    return this.request<ApiResponse<{ entry: ActivityJournalEntry }>>(`/deals/activity-journal/${entryId}`);
  }

  // Оновити запис журналу
  async updateActivityJournalEntry(entryId: string, updateData: UpdateActivityJournalRequest): Promise<ApiResponse<{ entry: ActivityJournalEntry; message: string }>> {
    return this.request<ApiResponse<{ entry: ActivityJournalEntry; message: string }>>(`/deals/activity-journal/${entryId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  // Видалити запис журналу
  async deleteActivityJournalEntry(entryId: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<ApiResponse<{ message: string }>>(`/deals/activity-journal/${entryId}`, {
      method: 'DELETE',
    });
  }



}

// Клас для роботи з parsed-listings API (інший базовий URL)
class ParsedListingsApiClient {
  private baseUrl = 'https://apimindex.online';
  private tokenManager = TokenManager;

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

    const token = this.tokenManager.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('🔑 ParsedListings API: додано Authorization header');
    } else {
      console.log('🔓 ParsedListings API: токен відсутній');
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
      console.log('📄 ParsedListings API Response Data:', data);

      if (!response.ok) {
        if (response.status === 401) {
          console.log('🚫 ParsedListings API: 401 помилка, очищуємо токени');
          TokenManager.clearTokens();
        }
        
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

  async createParsedListing(data: {
    source: string;
    external_id: string;
    title: string;
    price: number;
    description?: string;
    currency?: string;
    property_type?: string;
    area?: number;
    rooms?: number;
    city?: string;
    address?: string;
    coordinates?: { lat: number; lon: number };
    images?: string[];
    contact_info?: { phone?: string; name?: string };
    features?: string[];
    url?: string;
    status?: string;
    confidence_score?: number;
  }): Promise<ApiResponse> {
    console.log('➕ ParsedListings API: createParsedListing викликано з даними:', data);
    
    return await this.request<ApiResponse>('/parsed-listings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getParsedListing(id: string): Promise<ParsedListingResponse> {
    console.log('📄 ParsedListings API: getParsedListing викликано для ID:', id);
    
    return await this.request<ParsedListingResponse>(`/parsed-listings/${id}`, {
      method: 'GET',
    });
  }

  async deleteParsedListing(id: string): Promise<ApiResponse> {
    console.log('🗑️ ParsedListings API: deleteParsedListing викликано для ID:', id);
    
    return await this.request<ApiResponse>(`/parsed-listings/${id}`, {
      method: 'DELETE',
    });
  }

  async convertParsedListing(id: string): Promise<ApiResponse> {
    console.log('🔄 ParsedListings API: convertParsedListing викликано для ID:', id);
    
    return await this.request<ApiResponse>(`/parsed-listings/${id}/convert`, {
      method: 'POST',
    });
  }

  async updateParsedListingStatus(id: string, status: string): Promise<ApiResponse> {
    console.log('🔄 ParsedListings API: updateParsedListingStatus викликано для ID:', id, 'статус:', status);
    
    return await this.request<ApiResponse>(`/parsed-listings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }
}

// Експорт інстансів клієнтів
export const apiClient = new ApiClient();
export const parsedListingsApiClient = new ParsedListingsApiClient(); 