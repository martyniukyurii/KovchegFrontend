import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'ID обов\'язковий',
      });
    }

    const { db } = await connectToDatabase();
    const collection = db.collection('properties');

    // Шукаємо об'єкт за ID
    const property = await collection.findOne({
      _id: new ObjectId(id),
      is_active: true, // Тільки активні об'єкти
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Об\'єкт не знайдено',
      });
    }

    // Перевіряємо валідні координати
    const coords = property.location?.coordinates;
    let validCoordinates = null;
    
    if (coords && typeof coords.lat === 'number' && typeof coords.lng === 'number') {
      validCoordinates = { lat: coords.lat, lng: coords.lng };
    }

    // Фільтруємо тільки валідні URL зображень
    const validImages = (property.images || []).filter((img: string) => {
      return img && (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('/'));
    });

    // Трансформуємо дані
    const transformedProperty = {
      id: property._id.toString(),
      title: property.title,
      description: property.description,
      type: property.property_type,
      transactionType: property.transaction_type,
      status: 'active',
      isFeatured: property.is_featured || false,
      price: property.price.amount,
      currency: property.price.currency,
      address: property.location.address,
      city: property.location.city,
      fullAddress: `${property.location.address}, ${property.location.city}`,
      area: property.area,
      rooms: property.rooms || 0,
      floor: property.floor || 0,
      totalFloors: property.totalFloors || 0,
      images: validImages,
      features: property.features || [],
      coordinates: validCoordinates,
      createdAt: property.created_at,
      updatedAt: property.updated_at,
    };

    return res.status(200).json({
      success: true,
      data: transformedProperty,
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


