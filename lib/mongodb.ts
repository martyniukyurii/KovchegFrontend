import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = 'mongodb+srv://yuramartin1993:ZgKbgBGVXm2Wi2Xf@cluster0.gitezea.mongodb.net/';
const MONGODB_DB = 'kovcheg_db';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db(MONGODB_DB);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}


