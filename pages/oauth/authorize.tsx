import { useEffect, useState } from 'react';

export default function OAuthAuthorize() {
  const [clientId, setClientId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Отримуємо client ID з environment variable або вводимо вручну
    const envClientId = process.env.NEXT_PUBLIC_OLX_CLIENT_ID;
    if (envClientId) {
      setClientId(envClientId);
    }
  }, []);

  const initiateOAuth = () => {
    if (!clientId) {
      alert('Будь ласка, введіть Client ID');
      return;
    }

    setIsLoading(true);

    // Формуємо URL для авторизації
    const redirectUri = 'https://www.kovcheg.cv.ua/oauth/callback';
    const scope = 'read write'; // або інші scopes, які вам потрібні
    const state = Math.random().toString(36).substring(7); // для безпеки

    const authUrl = `https://www.olx.ua/oauth/authorize?` +
      `client_id=${encodeURIComponent(clientId)}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}&` +
      `state=${state}`;

    // Перенаправляємо користувача на OLX для авторизації
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          OLX OAuth Авторизація
        </h1>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Client ID:
          </label>
          <input
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            placeholder="Введіть ваш OLX Client ID"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          onClick={initiateOAuth}
          disabled={isLoading || !clientId}
          className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded"
        >
          {isLoading ? 'Перенаправлення...' : 'Авторизуватися через OLX'}
        </button>
        
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Ця сторінка ініціює OAuth авторизацію з OLX</p>
          <p>Після авторизації ви будете перенаправлені на callback сторінку</p>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-semibold text-blue-800 mb-2">Інструкція:</h3>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Введіть ваш OLX Client ID</li>
            <li>2. Натисніть "Авторизуватися через OLX"</li>
            <li>3. Відбудеться перенаправлення на OLX</li>
            <li>4. Після авторизації ви повернетеся на callback сторінку</li>
            <li>5. Там ви зможете обміняти код на access token</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 