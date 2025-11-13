const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://yuramartin1993:ZgKbgBGVXm2Wi2Xf@cluster0.gitezea.mongodb.net/';

async function checkSecurity() {
  console.log('🔐 Перевірка безпеки MongoDB\n');
  console.log('═══════════════════════════════════════\n');
  
  let client;
  try {
    client = await MongoClient.connect(MONGODB_URI);
    const db = client.db('kovcheg_db');
    
    // 1. Перевірка адмінів
    console.log('👥 1. ПЕРЕВІРКА АДМІНІСТРАТОРІВ:\n');
    const admins = await db.collection('admins').find().toArray();
    
    console.log(`Знайдено ${admins.length} адміністраторів:\n`);
    admins.forEach((admin, i) => {
      console.log(`${i + 1}. Email: ${admin.email || 'N/A'}`);
      console.log(`   Ім'я: ${admin.first_name} ${admin.last_name || ''}`);
      console.log(`   Роль: ${admin.role}`);
      console.log(`   Telegram ID: ${admin.telegram_id || 'N/A'}`);
      console.log(`   Створено: ${admin.created_at || 'N/A'}`);
      console.log('');
    });
    
    console.log('⚠️  ПЕРЕВІРТЕ: Чи всі ці люди вам знайомі?\n');
    console.log('═══════════════════════════════════════\n');
    
    // 2. Перевірка останніх змін
    console.log('📝 2. ОСТАННІ ЗМІНИ В БАЗІ:\n');
    
    // Останні додані нерухомості
    const recentProperties = await db.collection('properties')
      .find()
      .sort({ created_at: -1 })
      .limit(5)
      .toArray();
    
    console.log('🏠 Останні 5 доданих нерухомостей:');
    recentProperties.forEach((prop, i) => {
      console.log(`${i + 1}. ${prop.title}`);
      console.log(`   Створено: ${new Date(prop.created_at).toLocaleString('uk-UA')}`);
      console.log(`   Автор: ${prop.created_by?.first_name || 'N/A'} ${prop.created_by?.last_name || ''}`);
      console.log('');
    });
    
    // Останні клієнти
    const recentClients = await db.collection('clients')
      .find()
      .sort({ created_at: -1 })
      .limit(5)
      .toArray();
    
    console.log('👤 Останні 5 доданих клієнтів:');
    recentClients.forEach((client, i) => {
      console.log(`${i + 1}. ${client.first_name} ${client.last_name}`);
      console.log(`   Створено: ${new Date(client.created_at).toLocaleString('uk-UA')}`);
      console.log(`   Автор: ${client.created_by?.first_name || 'N/A'} ${client.created_by?.last_name || ''}`);
      console.log('');
    });
    
    console.log('⚠️  ПЕРЕВІРТЕ: Чи ви створювали все це?\n');
    console.log('═══════════════════════════════════════\n');
    
    // 3. Статистика колекцій
    console.log('📊 3. СТАТИСТИКА КОЛЕКЦІЙ:\n');
    
    const collections = await db.listCollections().toArray();
    
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`📁 ${col.name}: ${count} документів`);
    }
    console.log('');
    
    // Перевірка на підозрілі колекції
    const suspiciousNames = ['hack', 'dump', 'backup', 'temp', 'test', 'admin_new'];
    const suspicious = collections.filter(col => 
      suspiciousNames.some(name => col.name.toLowerCase().includes(name))
    );
    
    if (suspicious.length > 0) {
      console.log('⚠️  УВАГА: Знайдено підозрілі колекції:');
      suspicious.forEach(col => console.log(`   - ${col.name}`));
      console.log('');
    } else {
      console.log('✅ Підозрілих колекцій не знайдено\n');
    }
    
    console.log('═══════════════════════════════════════\n');
    
    // 4. Перевірка коли було створено дані
    console.log('📅 4. ЧАСОВА АНАЛІТИКА:\n');
    
    const oldestProperty = await db.collection('properties')
      .find()
      .sort({ created_at: 1 })
      .limit(1)
      .toArray();
    
    const newestProperty = await db.collection('properties')
      .find()
      .sort({ created_at: -1 })
      .limit(1)
      .toArray();
    
    if (oldestProperty.length > 0 && newestProperty.length > 0) {
      console.log(`Перша нерухомість: ${new Date(oldestProperty[0].created_at).toLocaleString('uk-UA')}`);
      console.log(`Остання нерухомість: ${new Date(newestProperty[0].created_at).toLocaleString('uk-UA')}`);
      console.log('');
    }
    
    // Активність по днях
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    
    const recentActivity = await db.collection('properties').countDocuments({
      created_at: { $gte: last7Days }
    });
    
    console.log(`📈 Додано за останні 7 днів: ${recentActivity} нерухомостей`);
    
    if (recentActivity > 50) {
      console.log('⚠️  УВАГА: Дуже багато записів за тиждень - перевірте!');
    } else {
      console.log('✅ Активність виглядає нормально');
    }
    console.log('');
    
    console.log('═══════════════════════════════════════\n');
    
    // 5. Фінальний висновок
    console.log('🎯 ВИСНОВОК:\n');
    
    console.log('✅ Що перевірено:');
    console.log('   - Список адміністраторів');
    console.log('   - Останні додані записи');
    console.log('   - Колекції в базі');
    console.log('   - Підозріла активність\n');
    
    console.log('⚠️  ЩО РОБИТИ ДАЛІ:\n');
    console.log('1. Перевірте MongoDB Atlas Access Logs:');
    console.log('   https://cloud.mongodb.com → Security → Access Manager → View Access Logs\n');
    
    console.log('2. Перевірте IP Access List:');
    console.log('   https://cloud.mongodb.com → Network Access → IP Access List');
    console.log('   - Шукайте незнайомі IP адреси\n');
    
    console.log('3. Якщо щось виглядає підозріло:');
    console.log('   - НЕГАЙНО змініть пароль MongoDB');
    console.log('   - Видаліть підозрілі дані');
    console.log('   - Обмежте IP Access до тільки ваших IP\n');
    
    console.log('4. GitHub Security:');
    console.log('   - Перевірте чи пароль ще в історії Git');
    console.log('   - Використайте git-secrets в майбутньому\n');
    
    console.log('═══════════════════════════════════════\n');
    
    console.log('💡 ВАЖЛИВО:\n');
    console.log('MongoDB Atlas НЕ показує детальні логи підключень');
    console.log('в безкоштовній версії. Для повного аудиту потрібен');
    console.log('платний план з Access Logs.\n');
    
    console.log('Але якщо в базі немає:');
    console.log('- Незнайомих адмінів');
    console.log('- Підозрілих даних');
    console.log('- Масових видалень');
    console.log('То найімовірніше все ОК! ✅\n');
    
  } catch (error) {
    console.error('❌ Помилка:', error.message);
  } finally {
    if (client) {
      await client.close();
      console.log('✅ Перевірку завершено\n');
    }
  }
}

checkSecurity();
