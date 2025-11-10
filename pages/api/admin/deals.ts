import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = 'mongodb+srv://yuramartin1993:ZgKbgBGVXm2Wi2Xf@cluster0.gitezea.mongodb.net/';
const DB_NAME = 'kovcheg_db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(DB_NAME);
    const collection = db.collection('deals');

    // GET - отримати всі угоди
    if (req.method === 'GET') {
      const { agent_id, role, status } = req.query;
      
      let query: any = {};
      
      // Фільтр за статусом
      if (status) {
        query.status = status;
      }
      
      // Якщо це рієлтор, показуємо тільки його угоди
      if (role === 'agent' && agent_id) {
        query.agent_id = agent_id;
      }

      const deals = await collection
        .find(query)
        .sort({ created_at: -1 })
        .toArray();

      await client.close();

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

      await client.close();

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
        await client.close();
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

      await client.close();

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
        await client.close();
        return res.status(400).json({
          success: false,
          message: 'ID угоди обов\'язковий',
        });
      }

      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      await client.close();

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

    await client.close();
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

