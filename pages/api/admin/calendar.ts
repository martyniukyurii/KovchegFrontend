import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('calendar_events');

    // GET - отримати події
    if (req.method === 'GET') {
      const { agent_id, role, start_date, end_date } = req.query;
      
      let query: any = {};
      
      // Фільтр за датами - показуємо події які перетинаються з періодом
      if (start_date && end_date) {
        const periodStart = new Date(start_date as string);
        const periodEnd = new Date(end_date as string);
        
        // Подія показується якщо:
        // - start_date події <= кінець періоду
        // - end_date події >= початок періоду
        query.$and = [
          { start_date: { $lte: periodEnd } },
          { end_date: { $gte: periodStart } }
        ];
      }
      
      // Якщо це рієлтор (НЕ owner), показуємо тільки його події
      if (role === 'agent' && agent_id) {
        query['created_by.admin_id'] = agent_id;
      }
      // Якщо owner - показуємо всі події

      const events = await collection
        .find(query)
        .sort({ start_date: 1 })
        .toArray();

      return res.status(200).json({
        success: true,
        data: events,
      });
    }

    // POST - створити нову подію
    if (req.method === 'POST') {
      const { start_date, end_date, ...rest } = req.body;
      
      const eventData = {
        ...rest,
        start_date: new Date(start_date), // Конвертуємо в Date!
        end_date: new Date(end_date),     // Конвертуємо в Date!
        created_at: new Date(),
        updated_at: new Date(),
      };

      const result = await collection.insertOne(eventData);

      return res.status(201).json({
        success: true,
        data: { _id: result.insertedId, ...eventData },
        message: 'Подію успішно створено',
      });
    }

    // PUT - оновити подію
    if (req.method === 'PUT') {
      const { _id, start_date, end_date, ...rest } = req.body;

      if (!_id) {
        return res.status(400).json({
          success: false,
          message: 'ID події обов\'язковий',
        });
      }

      const updateData: any = {
        ...rest,
        updated_at: new Date(),
      };
      
      // Конвертуємо дати якщо вони передані
      if (start_date) {
        updateData.start_date = new Date(start_date);
      }
      if (end_date) {
        updateData.end_date = new Date(end_date);
      }

      const result = await collection.updateOne(
        { _id: new ObjectId(_id) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Подію не знайдено',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Подію успішно оновлено',
      });
    }

    // DELETE - видалити подію
    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'ID події обов\'язковий',
        });
      }

      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Подію не знайдено',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Подію успішно видалено',
      });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({
      success: false,
      message: 'Помилка сервера',
      error: (error as Error).message,
    });
  }
}

