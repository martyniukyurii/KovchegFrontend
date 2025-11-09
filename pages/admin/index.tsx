import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import DefaultLayout from '@/layouts/default';

// Telegram Login Widget типи
declare global {
  interface Window {
    onTelegramAuth?: (user: any) => void;
  }
}

export default function AdminLogin() {
  const router = useRouter();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'form' | 'telegram'>('form');
  const isProcessingRef = useRef(false);

  useEffect(() => {
    // Перевірка чи користувач вже авторизований
    const isAuthenticated = localStorage.getItem('admin_authenticated');
    if (isAuthenticated === 'true') {
      router.push('/admin/dashboard');
    }

    // Callback для Telegram Login Widget
    window.onTelegramAuth = async (user) => {
      console.log('Telegram auth:', user);
      
      // Захист від множинних викликів
      if (isProcessingRef.current) {
        console.log('⏳ Already processing, skipping...');
        return;
      }
      
      isProcessingRef.current = true;
      setLoading(true);
      setError('');

      try {
        const response = await fetch('/api/admin/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ telegram_id: user.id }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('admin_authenticated', 'true');
          localStorage.setItem('admin_token', data.token);
          localStorage.setItem('admin_info', JSON.stringify(data.admin));
          router.push('/admin/dashboard');
        } else {
          setError(data.message || 'Помилка авторизації через Telegram');
          isProcessingRef.current = false;
        }
      } catch (err) {
        console.error('Auth error:', err);
        setError('Помилка з\'єднання з сервером');
        isProcessingRef.current = false;
      } finally {
        setLoading(false);
      }
    };

    return () => {
      delete window.onTelegramAuth;
      isProcessingRef.current = false;
    };
  }, [router]);

  // Окремий useEffect для завантаження Telegram Widget
  useEffect(() => {
    if (loginMethod === 'telegram') {
      const container = document.getElementById('telegram-login-container');
      if (container) {
        // Очищаємо контейнер перед додаванням нового скрипта
        container.innerHTML = '';

        // Створюємо script елемент динамічно
        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?22';
        script.async = true;
        script.setAttribute('data-telegram-login', 'novobudchatbot');
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-onauth', 'onTelegramAuth(user)');
        script.setAttribute('data-request-access', 'write');

        container.appendChild(script);
      }
    }
  }, [loginMethod]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('admin_authenticated', 'true');
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_info', JSON.stringify(data.admin));
        router.push('/admin/dashboard');
      } else {
        setError(data.message || 'Невірний логін або пароль');
      }
    } catch (err) {
      setError('Помилка з\'єднання з сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Адміністративна панель
              </h1>
              <p className="text-gray-400">Увійдіть для управління нерухомістю</p>
            </div>

            {/* Перемикач методу входу */}
            <div className="flex gap-2 mb-6 bg-gray-700 p-1 rounded-lg">
              <button
                onClick={() => setLoginMethod('form')}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition ${
                  loginMethod === 'form'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Логін і пароль
              </button>
              <button
                onClick={() => setLoginMethod('telegram')}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition ${
                  loginMethod === 'telegram'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Telegram
              </button>
            </div>

            {/* Форма логін/пароль */}
            {loginMethod === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="login" className="block text-sm font-medium text-gray-300 mb-2">
                    Логін (Email)
                  </label>
                  <input
                    id="login"
                    type="text"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Введіть email"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Пароль
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Введіть пароль"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Вхід...' : 'Увійти'}
                </button>
              </form>
            )}

            {/* Telegram Login */}
            {loginMethod === 'telegram' && (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-gray-400 mb-6">
                    Натисніть кнопку нижче, щоб увійти через Telegram
                  </p>
                  
                  {/* Контейнер для Telegram Widget */}
                  <div 
                    id="telegram-login-container"
                    className="flex justify-center"
                  />
                </div>

                <div className="text-center text-sm text-gray-500">
                  <p>Переконайтеся, що ваш Telegram акаунт</p>
                  <p>зареєстрований в системі</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-6 bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {loading && loginMethod === 'telegram' && (
              <div className="mt-6 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="text-gray-400 mt-2">Авторизація...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
