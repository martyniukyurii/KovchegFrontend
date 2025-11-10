import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = 'mongodb+srv://yuramartin1993:ZgKbgBGVXm2Wi2Xf@cluster0.gitezea.mongodb.net/';
const DB_NAME = 'kovcheg_db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'ID нерухомості обов\'язковий',
    });
  }

  try {
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(DB_NAME);
    const collection = db.collection('properties');

    // Збільшуємо лічильник переглядів
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $inc: { views_count: 1 },
        $set: { last_viewed_at: new Date() },
      }
    );

    await client.close();

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Нерухомість не знайдено',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Перегляд зареєстровано',
    });
  } catch (error) {
    console.error('View tracking error:', error);
    return res.status(500).json({
      success: false,
      message: 'Помилка сервера',
    });
  }
}

