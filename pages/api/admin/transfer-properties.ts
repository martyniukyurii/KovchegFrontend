import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = 'mongodb+srv://yuramartin1993:ZgKbgBGVXm2Wi2Xf@cluster0.gitezea.mongodb.net/';
const DB_NAME = 'kovcheg_db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { property_ids, target_agent_id } = req.body;

    if (!property_ids || !Array.isArray(property_ids) || property_ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Необхідно вказати ID нерухомості',
      });
    }

    if (!target_agent_id) {
      return res.status(400).json({
        success: false,
        message: 'Необхідно вказати ID цільового рієлтора',
      });
    }

    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(DB_NAME);
    const adminsCollection = db.collection('admins');
    const propertiesCollection = db.collection('properties');

    // Отримуємо інформацію про цільового рієлтора
    const targetAgent = await adminsCollection.findOne({ 
      _id: new ObjectId(target_agent_id) 
    });

    if (!targetAgent) {
      await client.close();
      return res.status(404).json({
        success: false,
        message: 'Рієлтора не знайдено',
      });
    }

    // Оновлюємо всі обрані об'єкти
    const result = await propertiesCollection.updateMany(
      { _id: { $in: property_ids.map((id: string) => new ObjectId(id)) } },
      {
        $set: {
          created_by: {
            admin_id: target_agent_id,
            first_name: targetAgent.first_name,
            last_name: targetAgent.last_name || '',
            email: targetAgent.email,
            role: targetAgent.role,
          },
          updated_at: new Date(),
        },
      }
    );

    await client.close();

    return res.status(200).json({
      success: true,
      message: `Успішно перенесено ${result.modifiedCount} об'єктів`,
      modified_count: result.modifiedCount,
    });
  } catch (error) {
    console.error('Transfer error:', error);
    return res.status(500).json({
      success: false,
      message: 'Помилка сервера',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

