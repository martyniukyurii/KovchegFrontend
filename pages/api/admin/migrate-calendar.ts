import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';

/**
 * API endpoint для міграції дат у календарі
 * Конвертує start_date та end_date з рядків в Date об'єкти
 * 
 * Використання: GET /api/admin/migrate-calendar
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('calendar_events');

    // Знаходимо всі події
    const events = await collection.find({}).toArray();
    
    if (events.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Немає подій для міграції',
        migrated: 0,
        skipped: 0,
        total: 0,
      });
    }

    let migrated = 0;
    let skipped = 0;

    for (const event of events) {
      // Перевіряємо чи дати є рядками
      const startIsString = typeof event.start_date === 'string';
      const endIsString = typeof event.end_date === 'string';

      if (startIsString || endIsString) {
        const updateData: any = {};
        
        if (startIsString) {
          updateData.start_date = new Date(event.start_date);
        }
        if (endIsString) {
          updateData.end_date = new Date(event.end_date);
        }

        await collection.updateOne(
          { _id: event._id },
          { $set: updateData }
        );

        migrated++;
      } else {
        skipped++;
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Міграція завершена',
      migrated,
      skipped,
      total: events.length,
    });

  } catch (error) {
    console.error('Migration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Помилка міграції',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

