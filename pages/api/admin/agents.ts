import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    const adminsCollection = db.collection('admins');

    // Отримуємо всіх агентів та адмінів (але не owners)
    const agents = await adminsCollection
      .find({ 
        role: { $in: ['admin', 'agent'] } 
      })
      .project({
        _id: 1,
        first_name: 1,
        last_name: 1,
        email: 1,
        role: 1
      })
      .toArray();


    return res.status(200).json({
      success: true,
      data: agents,
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return res.status(500).json({
      success: false,
      message: 'Помилка сервера',
    });
  }
}

