import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function OAuthCallback() {
  const router = useRouter();
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [olxData, setOlxData] = useState<any>(null);
  const [isFetchingData, setIsFetchingData] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      const { code: authCode, error: authError } = router.query;
      
      if (authError) {
        setError(`Помилка авторизації: ${authError}`);
        return;
      }
      
      if (authCode && typeof authCode === 'string') {
        setCode(authCode);
        console.log('Authorization code отримано:', authCode);
      }
    }
  }, [router.isReady, router.query]);

  const exchangeCodeForToken = async () => {
    if (!code) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/oauth/exchange-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setAccessToken(data.access_token);
        console.log('Access token отримано:', data.access_token);
      } else {
        setError(data.error || 'Помилка обміну коду на токен');
      }
    } catch (err) {
      setError('Помилка мережі при обміні коду на токен');
      console.error('Помилка:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Скопійовано в буфер обміну!');
  };

  const fetchOlxData = async (endpoint: string = 'me') => {
    if (!accessToken) return;
    
    setIsFetchingData(true);
    setError(null);
    
    try {
      const response = await fetch('/api/oauth/fetch-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          access_token: accessToken,
          endpoint 
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setOlxData(data);
        console.log('OLX data отримано:', data);
      } else {
        setError(data.error || 'Помилка отримання даних з OLX');
      }
    } catch (err) {
      setError('Помилка мережі при отриманні даних з OLX');
      console.error('Помилка:', err);
    } finally {
      setIsFetchingData(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          OLX OAuth Callback
        </h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {code && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Authorization Code:</h2>
            <div className="bg-gray-100 p-3 rounded border">
              <code className="text-sm break-all">{code}</code>
            </div>
            <button 
              onClick={() => copyToClipboard(code)}
              className="mt-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded border"
            >
              Копіювати код
            </button>
          </div>
        )}
        
        {code && !accessToken && (
          <div className="mb-4">
            <button 
              onClick={exchangeCodeForToken}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded"
            >
              {isLoading ? 'Обробка...' : 'Обміняти код на токен'}
            </button>
          </div>
        )}
        
        {accessToken && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Access Token:</h2>
            <div className="bg-green-100 p-3 rounded border">
              <code className="text-sm break-all">{accessToken}</code>
            </div>
            <button 
              onClick={() => copyToClipboard(accessToken)}
              className="mt-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded border"
            >
              Копіювати токен
            </button>
            
            <div className="mt-4">
              <h3 className="text-md font-semibold mb-2">Отримати дані з OLX:</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => fetchOlxData('me')}
                  disabled={isFetchingData}
                  className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded text-sm"
                >
                  {isFetchingData ? 'Отримання...' : 'Мій профіль'}
                </button>
                <button 
                  onClick={() => fetchOlxData('listings')}
                  disabled={isFetchingData}
                  className="w-full px-3 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded text-sm"
                >
                  {isFetchingData ? 'Отримання...' : 'Мої оголошення'}
                </button>
                <button 
                  onClick={() => fetchOlxData('favorites')}
                  disabled={isFetchingData}
                  className="w-full px-3 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white rounded text-sm"
                >
                  {isFetchingData ? 'Отримання...' : 'Улюблені'}
                </button>
                <button 
                  onClick={() => fetchOlxData('messages')}
                  disabled={isFetchingData}
                  className="w-full px-3 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white rounded text-sm"
                >
                  {isFetchingData ? 'Отримання...' : 'Повідомлення'}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {olxData && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Дані з OLX ({olxData.endpoint}):</h2>
            <div className="bg-gray-100 p-3 rounded border max-h-60 overflow-y-auto">
              <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(olxData.data, null, 2)}</pre>
            </div>
          </div>
        )}
        
        <div className="text-center text-sm text-gray-600">
          <p>Ця сторінка обробляє OAuth callback від OLX</p>
          <p>Authorization code буде автоматично отримано з URL</p>
        </div>
      </div>
    </div>
  );
} 