import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('properties');

    const { transaction_type } = req.query;

    // Фільтр: тільки активні та опубліковані властивості
    let query: any = { is_active: true };

    // Якщо вказано тип транзакції (sale або rent)
    if (transaction_type && (transaction_type === 'sale' || transaction_type === 'rent')) {
      query.transaction_type = transaction_type;
    }

    const properties = await collection
      .find(query)
      .sort({ is_featured: -1, created_at: -1 }) // Спочатку рекомендовані, потім нові
      .toArray();

    // Трансформуємо дані для фронтенду
    const transformedProperties = properties.map((prop) => {
      // Перевіряємо чи є валідні координати
      const coords = prop.location?.coordinates;
      let validCoordinates = null;
      
      if (coords && typeof coords.lat === 'number' && typeof coords.lng === 'number') {
        validCoordinates = { lat: coords.lat, lng: coords.lng };
      }

      // Фільтруємо тільки валідні URL зображень
      const validImages = (prop.images || []).filter((img: string) => {
        return img && (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('/'));
      });

      return {
        id: prop._id.toString(),
        title: prop.title,
        type: prop.property_type,
        status: 'active',
        isFeatured: prop.is_featured || false,
        price: prop.price.amount,
        currency: prop.price.currency,
        address: `${prop.location.address}, ${prop.location.city}`,
        area: prop.area,
        rooms: prop.rooms || 0,
        floor: prop.floor || 0,
        totalFloors: prop.totalFloors || 0,
        description: prop.description,
        images: validImages,
        tags: prop.features || [],
        coordinates: validCoordinates,
      };
    });

    return res.status(200).json({
      success: true,
      data: transformedProperties,
    });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({
      success: false,
      message: 'Помилка сервера',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

