require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function migrate() {
  console.log('🔄 Міграція дат у календарі...\n');
  
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI не знайдено в .env.local');
    process.exit(1);
  }

  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Підключено до MongoDB\n');
    
    const db = client.db(process.env.MONGODB_DB || 'kovcheg_db');
    const collection = db.collection('calendar_events');
    
    // Знаходимо всі події
    const events = await collection.find({}).toArray();
    console.log(`📅 Знайдено подій: ${events.length}\n`);
    
    if (events.length === 0) {
      console.log('✅ Немає подій для міграції');
      return;
    }
    
    let migrated = 0;
    let skipped = 0;
    
    for (const event of events) {
      // Перевіряємо чи дати є рядками
      const startIsString = typeof event.start_date === 'string';
      const endIsString = typeof event.end_date === 'string';
      
      if (startIsString || endIsString) {
        console.log(`🔧 Мігрую подію: "${event.title}"`);
        console.log(`   Старі дати: ${event.start_date} → ${event.end_date}`);
        
        const updateData = {};
        if (startIsString) {
          updateData.start_date = new Date(event.start_date);
        }
        if (endIsString) {
          updateData.end_date = new Date(event.end_date);
        }
        
        await collection.updateOne(
          { _id: event._id },
          { $set: updateData }
        );
        
        console.log(`   Нові дати: ${updateData.start_date || event.start_date} → ${updateData.end_date || event.end_date}`);
        console.log('   ✅ Мігровано\n');
        migrated++;
      } else {
        console.log(`⏭️  Пропускаю подію: "${event.title}" (дати вже Date об'єкти)`);
        skipped++;
      }
    }
    
    console.log('\n📊 РЕЗУЛЬТАТ:');
    console.log(`   ✅ Мігровано: ${migrated}`);
    console.log(`   ⏭️  Пропущено: ${skipped}`);
    console.log(`   📅 Всього: ${events.length}`);
    
  } catch (error) {
    console.error('❌ Помилка:', error);
  } finally {
    await client.close();
    console.log('\n🔌 З\'єднання закрито');
  }
}

migrate();

