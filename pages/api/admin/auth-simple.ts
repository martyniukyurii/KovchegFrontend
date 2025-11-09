import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://yuramartin1993:ZgKbgBGVXm2Wi2Xf@cluster0.gitezea.mongodb.net/';
const DB_NAME = 'kovcheg_db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('🔐 Auth API called:', req.method, req.body);
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const { login, password, telegram_id } = req.body;
  console.log('📝 Auth data:', { login, telegram_id: telegram_id ? 'present' : 'missing' });

  try {
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(DB_NAME);
    const adminsCollection = db.collection('admins');

    let admin;

    // Варіант 1: Вхід через Telegram ID
    if (telegram_id) {
      console.log('🔍 Searching for Telegram ID:', telegram_id);
      admin = await adminsCollection.findOne({ 
        telegram_id: parseInt(telegram_id),
        role: { $in: ['admin', 'agent'] }
      });

      console.log('👤 Admin found:', admin ? 'YES' : 'NO');

      if (!admin) {
        await client.close();
        return res.status(401).json({
          success: false,
          message: 'Telegram акаунт не знайдено або немає прав доступу',
        });
      }
    }
    // Варіант 2: Вхід через логін і пароль
    else if (login && password) {
      console.log('🔍 Searching for login:', login);
      admin = await adminsCollection.findOne({ 
        login: login,
        role: { $in: ['admin', 'agent'] }
      });

      if (!admin) {
        await client.close();
        return res.status(401).json({
          success: false,
          message: 'Невірний логін або пароль',
        });
      }

      // Перевірка пароля
      if (!admin.password) {
        await client.close();
        return res.status(401).json({
          success: false,
          message: 'Для цього акаунта пароль не встановлено. Використовуйте вхід через Telegram',
        });
      }

      const isPasswordValid = await bcrypt.compare(password, admin.password);
      
      if (!isPasswordValid) {
        await client.close();
        return res.status(401).json({
          success: false,
          message: 'Невірний логін або пароль',
        });
      }
    } else {
      await client.close();
      return res.status(400).json({
        success: false,
        message: 'Необхідно вказати логін і пароль або Telegram ID',
      });
    }

    await client.close();

    // Генеруємо токен
    const token = Buffer.from(`${admin._id}:${Date.now()}`).toString('base64');
    
    console.log('✅ Auth successful for:', admin.first_name, admin.last_name);
    
    return res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id.toString(),
        first_name: admin.first_name,
        last_name: admin.last_name,
        email: admin.email,
        role: admin.role,
        telegram_id: admin.telegram_id,
      },
      message: 'Авторизація успішна',
    });

  } catch (error) {
    console.error('❌ Auth error:', error);
    return res.status(500).json({
      success: false,
      message: 'Помилка сервера',
    });
  }
}

