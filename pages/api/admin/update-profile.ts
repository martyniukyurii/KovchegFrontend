import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = 'mongodb+srv://yuramartin1993:ZgKbgBGVXm2Wi2Xf@cluster0.gitezea.mongodb.net/';
const DB_NAME = 'kovcheg_db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { admin_id, first_name, last_name, phone, photo } = req.body;

    if (!admin_id || !first_name) {
      return res.status(400).json({ success: false, message: 'Admin ID та ім\'я обов\'язкові' });
    }

    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(DB_NAME);
    const adminsCollection = db.collection('admins');

    const updateData: any = {
      first_name,
      updated_at: new Date(),
    };

    if (last_name !== undefined) updateData.last_name = last_name;
    if (phone !== undefined) updateData.phone = phone;
    if (photo !== undefined) updateData.photo = photo;

    const result = await adminsCollection.updateOne(
      { _id: new ObjectId(admin_id) },
      { $set: updateData }
    );

    await client.close();

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Адміна не знайдено',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Профіль успішно оновлено',
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Помилка сервера',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

