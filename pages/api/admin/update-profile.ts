import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { admin_id, first_name, last_name, phone, photo } = req.body;

    if (!admin_id || !first_name) {
      return res.status(400).json({ success: false, message: 'Admin ID та ім\'я обов\'язкові' });
    }

    const { db } = await connectToDatabase();
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

