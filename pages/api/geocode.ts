import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { address, city } = req.query;

  if (!address || !city) {
    return res.status(400).json({
      success: false,
      message: 'Адреса та місто обов\'язкові',
    });
  }

  try {
    // Формуємо повну адресу для пошуку
    const fullAddress = `${address}, ${city}, Україна`;
    
    // Використовуємо Nominatim API від OpenStreetMap (безкоштовний)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
      `q=${encodeURIComponent(fullAddress)}` +
      `&format=json` +
      `&limit=1` +
      `&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'KovchegRealEstate/1.0', // Nominatim вимагає User-Agent
        },
      }
    );

    if (!response.ok) {
      throw new Error('Помилка геокодування');
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const location = data[0];
      
      return res.status(200).json({
        success: true,
        coordinates: {
          lat: parseFloat(location.lat),
          lng: parseFloat(location.lon),
        },
        displayName: location.display_name,
        message: 'Координати знайдено',
      });
    } else {
      // Якщо точна адреса не знайдена, шукаємо тільки місто
      const cityResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(city + ', Україна')}` +
        `&format=json` +
        `&limit=1`,
        {
          headers: {
            'User-Agent': 'KovchegRealEstate/1.0',
          },
        }
      );

      const cityData = await cityResponse.json();

      if (cityData && cityData.length > 0) {
        const cityLocation = cityData[0];
        
        return res.status(200).json({
          success: true,
          coordinates: {
            lat: parseFloat(cityLocation.lat),
            lng: parseFloat(cityLocation.lon),
          },
          displayName: cityLocation.display_name,
          warning: 'Точна адреса не знайдена, використано координати міста',
        });
      }

      return res.status(404).json({
        success: false,
        message: 'Координати не знайдено. Перевірте правильність адреси.',
      });
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    return res.status(500).json({
      success: false,
      message: 'Помилка геокодування',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}


