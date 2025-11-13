import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_DB = process.env.MONGODB_DB || 'kovcheg_db';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

const options = {
  maxPoolSize: 10, // Максимум 10 підключень в пулі
  minPoolSize: 2,  // Мінімум 2 активних
  maxIdleTimeMS: 30000, // Закривати неактивні через 30 сек
  serverSelectionTimeoutMS: 5000, // Таймаут 5 сек
  socketTimeoutMS: 45000, // Таймаут операції 45 сек
};

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    // Перевіряємо чи з'єднання ще активне
    try {
      await cachedClient.db('admin').command({ ping: 1 });
      return { client: cachedClient, db: cachedDb };
    } catch (error) {
      console.log('Cached connection lost, reconnecting...');
      cachedClient = null;
      cachedDb = null;
    }
  }

  const client = await MongoClient.connect(MONGODB_URI, options);
  const db = client.db(MONGODB_DB);

  cachedClient = client;
  cachedDb = db;

  console.log('✅ MongoDB connected with connection pooling');

  return { client, db };
}


