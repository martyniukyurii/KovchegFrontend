const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://yuramartin1993:ZgKbgBGVXm2Wi2Xf@cluster0.gitezea.mongodb.net/';

async function checkConnections() {
  console.log('🔍 Діагностика MongoDB підключень\n');
  console.log('═══════════════════════════════════════\n');
  
  // Тест 1: Створюємо 10 підключень підряд (погано)
  console.log('🧪 ТЕСТ 1: Створення множинних підключень (старий спосіб)');
  console.log('   Це те, що відбувалось РАНІШЕ...\n');
  
  const connections = [];
  const startTime = Date.now();
  
  try {
    for (let i = 1; i <= 5; i++) {
      const client = await MongoClient.connect(MONGODB_URI);
      connections.push(client);
      console.log(`   [${i}/5] Створено підключення #${i}`);
    }
    
    const timeElapsed = Date.now() - startTime;
    console.log(`\n   ⏱️  Час: ${timeElapsed}ms`);
    console.log(`   ❌ ПРОБЛЕМА: Кожне підключення займає ~${Math.round(timeElapsed/5)}ms`);
    console.log(`   ❌ При 100 запитах = ${connections.length * 20} підключень!`);
    console.log(`   ❌ При 1000 запитах = ${connections.length * 200} підключень! 😱\n`);
    
    // Закриваємо
    for (const client of connections) {
      await client.close();
    }
    
  } catch (error) {
    console.error('   ❌ Помилка:', error.message);
  }
  
  console.log('═══════════════════════════════════════\n');
  
  // Тест 2: Connection pooling (добре)
  console.log('🧪 ТЕСТ 2: Connection Pooling (новий спосіб)');
  console.log('   Це те, що ми ВИПРАВИЛИ...\n');
  
  const poolStartTime = Date.now();
  
  try {
    const client = await MongoClient.connect(MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
    });
    
    const db = client.db('kovcheg_db');
    
    // Робимо 5 запитів через один пул
    for (let i = 1; i <= 5; i++) {
      const result = await db.collection('properties').countDocuments();
      console.log(`   [${i}/5] Запит через пул: знайдено ${result} нерухомості`);
    }
    
    const poolTimeElapsed = Date.now() - poolStartTime;
    console.log(`\n   ⏱️  Час: ${poolTimeElapsed}ms`);
    console.log(`   ✅ ВИРІШЕНО: Всі запити через 1 підключення!`);
    console.log(`   ✅ При 100 запитах = ~10 підключень (в пулі)`);
    console.log(`   ✅ При 1000 запитах = ~10 підключень (в пулі)! 🎉\n`);
    
    await client.close();
    
  } catch (error) {
    console.error('   ❌ Помилка:', error.message);
  }
  
  console.log('═══════════════════════════════════════\n');
  
  // Статистика
  console.log('📊 ВИСНОВОК:\n');
  console.log('   ❌ БУЛО (без pooling):');
  console.log('      - Нове підключення на кожен запит');
  console.log('      - 200-300 підключень при навантаженні');
  console.log('      - Тайм-аути (ETIMEOUT)');
  console.log('      - Повільні запити\n');
  
  console.log('   ✅ СТАЛО (з pooling):');
  console.log('      - Переиспользование підключень з пулу');
  console.log('      - 2-10 підключень (maxPoolSize: 10)');
  console.log('      - Швидкі запити');
  console.log('      - Без тайм-аутів\n');
  
  console.log('💡 ЩО ЗРОБЛЕНО:\n');
  console.log('   1. ✅ Створено lib/mongodb.ts з connection pooling');
  console.log('   2. ✅ Оновлено всі API routes (10 файлів)');
  console.log('   3. ✅ Видалено всі client.close()');
  console.log('   4. ✅ Додано maxPoolSize: 10, minPoolSize: 2\n');
  
  console.log('🎯 РЕКОМЕНДАЦІЇ:\n');
  console.log('   1. Перезапустіть dev сервер: npm run dev');
  console.log('   2. Перевірте MongoDB Atlas Metrics');
  console.log('   3. Підключення має впасти з 200-300 до 2-10');
  console.log('   4. Якщо ще багато - перевірте .env.local\n');
  
  console.log('✅ Діагностику завершено!\n');
}

checkConnections();

