const { connectToDatabase } = require('../lib/mongodb.ts');

async function debug() {
  console.log('🔍 Діагностика календаря...\n');
  
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('calendar_events');
    
    // Отримуємо всі події
    const allEvents = await collection.find({}).toArray();
    console.log(`📅 Всього подій в базі: ${allEvents.length}\n`);
    
    if (allEvents.length > 0) {
      console.log('📋 Список подій:\n');
      allEvents.forEach((event, i) => {
        console.log(`${i + 1}. "${event.title}"`);
        console.log(`   Тип: ${event.type}`);
        console.log(`   Початок: ${event.start_date}`);
        console.log(`   Кінець: ${event.end_date}`);
        console.log(`   Створив: ${event.created_by?.first_name} ${event.created_by?.last_name} (${event.created_by?.role})`);
        console.log(`   ID адміна: ${event.created_by?.admin_id}`);
        console.log('');
      });
      
      // Перевіряємо фільтр за поточним місяцем
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      console.log(`\n📆 Фільтр за ${now.toLocaleString('uk-UA', { month: 'long', year: 'numeric' })}:`);
      console.log(`   Початок місяця: ${startOfMonth.toISOString()}`);
      console.log(`   Кінець місяця: ${endOfMonth.toISOString()}\n`);
      
      const filteredEvents = await collection.find({
        start_date: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        }
      }).toArray();
      
      console.log(`✅ Подій у поточному місяці: ${filteredEvents.length}\n`);
      
      if (filteredEvents.length !== allEvents.length) {
        console.log('⚠️  ПРОБЛЕМА: Не всі події потрапляють у фільтр!\n');
        console.log('Події поза фільтром:');
        const outsideEvents = allEvents.filter(e => 
          !filteredEvents.find(f => f._id.toString() === e._id.toString())
        );
        outsideEvents.forEach(event => {
          console.log(`   - "${event.title}" (${event.start_date})`);
        });
      }
    } else {
      console.log('❌ Немає подій в базі!\n');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Помилка:', error);
    process.exit(1);
  }
}

debug();
