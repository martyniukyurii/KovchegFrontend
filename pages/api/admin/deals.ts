import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('deals');

    // GET - отримати всі угоди
    if (req.method === 'GET') {
      const { agent_id, role, status } = req.query;
      
      let query: any = {};
      
      // Фільтр за статусом
      if (status) {
        query.status = status;
      }
      
      // Якщо це рієлтор (НЕ owner), показуємо тільки його угоди
      if (role === 'agent' && agent_id) {
        query['created_by.admin_id'] = agent_id;
      }
      // Якщо owner - показуємо всі (query залишається порожнім або тільки зі статусом)

      const deals = await collection
        .find(query)
        .sort({ created_at: -1 })
        .toArray();


      return res.status(200).json({
        success: true,
        data: deals,
      });
    }

    // POST - створити нову угоду
    if (req.method === 'POST') {
      const dealData = {
        ...req.body,
        created_at: new Date(),
        updated_at: new Date(),
        events: req.body.events || [],
      };

      const result = await collection.insertOne(dealData);


      return res.status(201).json({
        success: true,
        data: { _id: result.insertedId, ...dealData },
        message: 'Угоду успішно створено',
      });
    }

    // PUT - оновити угоду
    if (req.method === 'PUT') {
      const { _id, ...updateData } = req.body;

      if (!_id) {
        return res.status(400).json({
          success: false,
          message: 'ID угоди обов\'язковий',
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


      if (result.matchedCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Угоду не знайдено',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Угоду успішно оновлено',
      });
    }

    // DELETE - видалити угоду
    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'ID угоди обов\'язковий',
        });
      }

      const result = await collection.deleteOne({ _id: new ObjectId(id) });


      if (result.deletedCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Угоду не знайдено',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Угоду успішно видалено',
      });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Deals API error:', error);
    return res.status(500).json({
      success: false,
      message: 'Помилка сервера',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

