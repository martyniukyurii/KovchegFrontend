import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = 'mongodb+srv://yuramartin1993:ZgKbgBGVXm2Wi2Xf@cluster0.gitezea.mongodb.net/';
const DB_NAME = 'kovcheg_db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(DB_NAME);
    const collection = db.collection('clients');

    // GET - отримати всіх клієнтів
    if (req.method === 'GET') {
      const { agent_id, role, type } = req.query;
      
      let query: any = {};
      
      // Фільтр за типом (buyer/seller)
      if (type) {
        query.type = type;
      }
      
      // Якщо це рієлтор, показуємо тільки його клієнтів
      if (role === 'agent' && agent_id) {
        query.agent_id = agent_id;
      }

      const clients = await collection
        .find(query)
        .sort({ created_at: -1 })
        .toArray();

      await client.close();

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

      await client.close();

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
        await client.close();
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

      await client.close();

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
        await client.close();
        return res.status(400).json({
          success: false,
          message: 'ID клієнта обов\'язковий',
        });
      }

      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      await client.close();

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

    await client.close();
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

