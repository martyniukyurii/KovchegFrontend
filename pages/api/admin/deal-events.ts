import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = 'mongodb+srv://yuramartin1993:ZgKbgBGVXm2Wi2Xf@cluster0.gitezea.mongodb.net/';
const DB_NAME = 'kovcheg_db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { deal_id, event } = req.body;

    if (!deal_id || !event) {
      return res.status(400).json({
        success: false,
        message: 'deal_id та event обов\'язкові',
      });
    }

    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(DB_NAME);
    const collection = db.collection('deals');

    const newEvent = {
      ...event,
      created_at: new Date(),
    };

    const result = await collection.updateOne(
      { _id: new ObjectId(deal_id) },
      {
        $push: { events: newEvent },
        $set: { updated_at: new Date() },
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
      message: 'Подію успішно додано',
      data: newEvent,
    });
  } catch (error) {
    console.error('Deal events API error:', error);
    return res.status(500).json({
      success: false,
      message: 'Помилка сервера',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

