import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Отримуємо токен з заголовків
    const authorization = req.headers.authorization;
    
    console.log('🔍 Debugging authorization:', {
      hasAuth: !!authorization,
      authLength: authorization?.length,
      authFormat: authorization?.substring(0, 20) + '...',
    });

    if (!authorization) {
      return res.status(401).json({ 
        status: 'error',
        message: 'Authorization header is required',
        status_code: 401
      });
    }

    // Формуємо URL з query параметрами
    const queryParams = new URLSearchParams();
    Object.entries(req.query).forEach(([key, value]) => {
      if (value && typeof value === 'string') {
        queryParams.append(key, value);
      }
    });

    const apiUrl = `https://apimindex.online/parsed-listings/${queryParams.toString() ? `?${queryParams}` : ''}`;
    
    console.log('🌐 Proxy request to:', apiUrl);
    console.log('🔑 Authorization:', authorization);

    // Виконуємо запит до API з авторизацією
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('📥 API Response status:', response.status);

    const data = await response.json();
    console.log('📄 API Response data:', data);

    // Повертаємо відповідь з тим же статусом
    res.status(response.status).json(data);

  } catch (error) {
    console.error('❌ Proxy request failed:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      status_code: 500
    });
  }
} 