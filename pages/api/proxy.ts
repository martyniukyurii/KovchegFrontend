import { NextApiRequest, NextApiResponse } from 'next';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apimindex.online';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Отримуємо шлях API з query параметра
    const { path, ...query } = req.query;
    
    if (!path) {
      return res.status(400).json({ message: 'Path parameter is required' });
    }

    // Будуємо URL для API запиту
    const apiPath = Array.isArray(path) ? path.join('/') : path;
    const queryString = new URLSearchParams(query as Record<string, string>).toString();
    const url = `${API_BASE_URL}/${apiPath}${queryString ? `?${queryString}` : ''}`;
    
    console.log('Proxy request:', {
      originalPath: path,
      apiPath,
      query,
      queryString,
      url,
      method: req.method,
      headers: req.headers,
      body: req.body
    });

    // Копіюємо заголовки з оригінального запиту
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Додаємо Authorization header якщо він є
    const authHeader = req.headers.authorization;
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    // Робимо запит до API
    const response = await fetch(url, {
      method: req.method,
      headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    // Отримуємо дані відповіді
    const data = await response.json();

    console.log('Proxy response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      data
    });

    // Повертаємо відповідь з тим самим статус кодом
    res.status(response.status).json(data);
  } catch (error: any) {
    console.error('Proxy API error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
}
