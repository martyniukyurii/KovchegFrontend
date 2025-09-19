import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { access_token, endpoint = 'me' } = req.body;

  if (!access_token) {
    return res.status(400).json({ error: 'Access token is required' });
  }

  try {
    // Вибираємо endpoint залежно від того, які дані потрібно отримати
    let apiUrl = '';
    
    switch (endpoint) {
      case 'me':
        apiUrl = 'https://www.olx.ua/api/v1/users/me';
        break;
      case 'listings':
        apiUrl = 'https://www.olx.ua/api/v1/users/me/listings';
        break;
      case 'favorites':
        apiUrl = 'https://www.olx.ua/api/v1/users/me/favorites';
        break;
      case 'messages':
        apiUrl = 'https://www.olx.ua/api/v1/users/me/messages';
        break;
      default:
        return res.status(400).json({ error: 'Invalid endpoint' });
    }

    // Робимо запит до OLX API
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OLX API error:', data);
      return res.status(response.status).json({ 
        error: `OLX API error: ${data.error || 'Unknown error'}`,
        details: data
      });
    }

    // Повертаємо дані
    return res.status(200).json({
      endpoint,
      data,
    });

  } catch (error) {
    console.error('Error fetching data from OLX:', error);
    return res.status(500).json({ 
      error: 'Internal server error while fetching data' 
    });
  }
} 