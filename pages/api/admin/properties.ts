import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('properties');

    // GET - отримати всі властивості (включаючи архівні)
    if (req.method === 'GET') {
      const { showAll, admin_id, role } = req.query;
      
      let query: any = {};
      
      // Фільтр для активних/архівних
      if (showAll !== 'true') {
        query.is_active = true;
      }
      
      // Якщо це НЕ owner, показуємо тільки нерухомість цього адміна/рієлтора
      if (role && role !== 'owner' && admin_id) {
        query['created_by.admin_id'] = admin_id;
      }
      // Якщо owner - показуємо все (без додаткових фільтрів)

      let properties = await collection
        .find(query)
        .sort({ created_at: -1 })
        .toArray();

      // Витягуємо телефони рієлторів з колекції admins
      const adminsCollection = db.collection('admins');
      const adminIds = properties
        .map(p => p.created_by?.admin_id)
        .filter(Boolean)
        .map(id => new ObjectId(id));

      const admins = await adminsCollection
        .find({ _id: { $in: adminIds } })
        .project({ _id: 1, phone: 1 })
        .toArray();

      const adminPhoneMap = new Map(
        admins.map(a => [a._id.toString(), a.phone])
      );

      // Додаємо телефон до кожної нерухомості
      properties = properties.map(property => ({
        ...property,
        realtor_phone: property.created_by?.admin_id 
          ? adminPhoneMap.get(property.created_by.admin_id) || null
          : null,
      }));

      return res.status(200).json({
        success: true,
        data: properties,
      });
    }

    // POST - створити нову властивість
    if (req.method === 'POST') {
      const propertyData = {
        ...req.body,
        created_at: new Date(),
        updated_at: new Date(),
        is_active: req.body.is_active !== undefined ? req.body.is_active : true,
        status: req.body.status || 'pending_review',
        source: 'admin',
        images: req.body.images || [],
        features: req.body.features || [],
        // Додаємо інформацію про того, хто створив
        created_by: req.body.created_by || null,
      };

      const result = await collection.insertOne(propertyData);

      return res.status(201).json({
        success: true,
        data: { _id: result.insertedId, ...propertyData },
        message: 'Нерухомість успішно додано',
      });
    }

    // PUT - оновити властивість
    if (req.method === 'PUT') {
      const { _id, ...updateData } = req.body;

      if (!_id) {
        return res.status(400).json({
          success: false,
          message: 'ID нерухомості обов\'язковий',
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
          message: 'Нерухомість не знайдено',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Нерухомість успішно оновлено',
      });
    }

    // DELETE - видалити властивість (м'яке видалення)
    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'ID нерухомості обов\'язковий',
        });
      }

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            is_active: false,
            updated_at: new Date(),
          },
        }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Нерухомість не знайдено',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Нерухомість переміщено в архів',
      });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({
      success: false,
      message: 'Помилка сервера',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}


