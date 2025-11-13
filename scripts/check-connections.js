const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://yuramartin1993:ZgKbgBGVXm2Wi2Xf@cluster0.gitezea.mongodb.net/';

async function checkConnections() {
  console.log('🔍 Перевірка підключень до MongoDB...\n');
  
  let client;
  try {
    client = await MongoClient.connect(MONGODB_URI);
    const db = client.db('admin');
    
    // Отримуємо статус сервера
    const serverStatus = await db.command({ serverStatus: 1 });
    
    console.log('📊 Статистика підключень:');
    console.log('═══════════════════════════════════════\n');
    
    const connections = serverStatus.connections;
    console.log('🔌 Connections:');
    console.log(`   Current:     ${connections.current}`);
    console.log(`   Available:   ${connections.available}`);
    console.log(`   Total Created: ${connections.totalCreated}\n`);
    
    // Отримуємо поточні операції
    const currentOps = await db.command({ currentOp: 1 });
    
    console.log('🔄 Активні операції:');
    console.log(`   Total: ${currentOps.inprog.length}\n`);
    
    // Групуємо по клієнтах
    const clientStats = {};
    currentOps.inprog.forEach(op => {
      if (op.client) {
        const client = op.client;
        if (!clientStats[client]) {
          clientStats[client] = {
            count: 0,
            ops: []
          };
        }
        clientStats[client].count++;
        clientStats[client].ops.push({
          op: op.op,
          ns: op.ns,
          secs_running: op.secs_running || 0,
          desc: op.desc
        });
      }
    });
    
    console.log('👥 Підключення по клієнтах:');
    console.log('═══════════════════════════════════════\n');
    
    const sortedClients = Object.entries(clientStats)
      .sort((a, b) => b[1].count - a[1].count);
    
    sortedClients.forEach(([client, stats]) => {
      console.log(`📍 ${client}`);
      console.log(`   Кількість операцій: ${stats.count}`);
      stats.ops.slice(0, 3).forEach(op => {
        console.log(`   - ${op.op} на ${op.ns} (${op.secs_running}s) - ${op.desc || 'N/A'}`);
      });
      if (stats.ops.length > 3) {
        console.log(`   ... та ще ${stats.ops.length - 3} операцій`);
      }
      console.log('');
    });
    
    // Connection pool info
    console.log('🏊 Connection Pool Settings:');
    console.log('═══════════════════════════════════════\n');
    
    const adminDb = client.db('kovcheg_db');
    const collections = await adminDb.listCollections().toArray();
    
    console.log('📚 Collections:');
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    console.log('');
    
    // Рекомендації
    console.log('💡 Рекомендації:');
    console.log('═══════════════════════════════════════\n');
    
    if (connections.current > 50) {
      console.log('⚠️  УВАГА: Дуже багато підключень (>50)!');
      console.log('   Рекомендації:');
      console.log('   1. Перевірте connection pooling в коді');
      console.log('   2. Переконайтесь що використовується connectToDatabase()');
      console.log('   3. НЕ закривайте підключення в API routes');
      console.log('   4. Перезапустіть сервер після змін\n');
    } else if (connections.current > 20) {
      console.log('⚠️  ПОПЕРЕДЖЕННЯ: Багато підключень (>20)');
      console.log('   Це може бути нормально при високому навантаженні,');
      console.log('   але перевірте чи всі API використовують connection pool\n');
    } else {
      console.log('✅ Кількість підключень в нормі (<20)');
      console.log('   Connection pooling працює правильно!\n');
    }
    
    console.log('📈 Статистика створених підключень:');
    console.log(`   За весь час створено: ${connections.totalCreated} підключень`);
    console.log(`   Це ${connections.totalCreated > 1000 ? 'ДУЖЕ' : connections.totalCreated > 100 ? 'багато' : 'нормально'}`);
    console.log('   (При правильному pooling має зростати повільно)\n');
    
  } catch (error) {
    console.error('❌ Помилка:', error.message);
  } finally {
    if (client) {
      await client.close();
      console.log('✅ Перевірку завершено, з\'єднання закрито');
    }
  }
}

checkConnections();

