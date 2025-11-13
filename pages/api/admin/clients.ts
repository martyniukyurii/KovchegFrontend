import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('clients');

    // GET - отримати всіх клієнтів
    if (req.method === 'GET') {
      const { agent_id, role, type } = req.query;
      
      let query: any = {};
      
      // Фільтр за типом (buyer/seller)
      if (type) {
        query.type = type;
      }
      
      // Якщо це рієлтор (НЕ owner), показуємо тільки його клієнтів
      if (role === 'agent' && agent_id) {
        query['created_by.admin_id'] = agent_id;
      }
      // Якщо owner - показуємо всіх (query залишається порожнім або тільки з типом)

      const clients = await collection
        .find(query)
        .sort({ created_at: -1 })
        .toArray();

      // Connection pool - не закриваємо, використовується повторно

      return res.status(200).json({
        success: true,
        data: clients,
      });
    }

    // POST - створити нового клієнта
    if (req.method === 'POST') {
      const clientData = {
        ...req.body,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const result = await collection.insertOne(clientData);

      // Connection pool - не закриваємо, використовується повторно

      return res.status(201).json({
        success: true,
        data: { _id: result.insertedId, ...clientData },
        message: 'Клієнта успішно додано',
      });
    }

    // PUT - оновити клієнта
    if (req.method === 'PUT') {
      const { _id, ...updateData } = req.body;

      if (!_id) {
        // Connection pool - не закриваємо, використовується повторно
        return res.status(400).json({
          success: false,
          message: 'ID клієнта обов\'язковий',
        });
      }

      const result = await collection.updateOne(
        { _id: new ObjectId(_id) },
        {
          $set: {
            ...updateData,
            updated_at: new Date(),
          },
        }
      );

      // Connection pool - не закриваємо, використовується повторно

      if (result.matchedCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Клієнта не знайдено',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Клієнта успішно оновлено',
      });
    }

    // DELETE - видалити клієнта
    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id || typeof id !== 'string') {
        // Connection pool - не закриваємо, використовується повторно
        return res.status(400).json({
          success: false,
          message: 'ID клієнта обов\'язковий',
        });
      }

      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      // Connection pool - не закриваємо, використовується повторно

      if (result.deletedCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Клієнта не знайдено',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Клієнта успішно видалено',
      });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Clients API error:', error);
    return res.status(500).json({
      success: false,
      message: 'Помилка сервера',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

