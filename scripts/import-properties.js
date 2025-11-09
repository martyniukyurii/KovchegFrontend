const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://yuramartin1993:ZgKbgBGVXm2Wi2Xf@cluster0.gitezea.mongodb.net/';
const DB_NAME = 'kovcheg_db';

async function importProperties() {
  console.log('🚀 Починаю імпорт нерухомості...\n');

  try {
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(DB_NAME);
    const propertiesCollection = db.collection('properties');
    const adminsCollection = db.collection('admins');

    // Знаходимо Максима Голбана
    const maksym = await adminsCollection.findOne({ telegram_id: 657258294 });
    const tetyana = await adminsCollection.findOne({ first_name: 'Тетяна', last_name: 'Петрусєва' });

    if (!maksym) {
      console.error('❌ Максим Голбан не знайдений в базі');
      await client.close();
      return;
    }

    console.log('✅ Знайдено Максима Голбана:', maksym.first_name, maksym.email);
    if (tetyana) {
      console.log('✅ Знайдено Тетяну Петрусєву:', tetyana.first_name, tetyana.email);
    }

    const properties = [
      {
        title: '3-рівневий пентхаус + терасса',
        description: `Планування:

1 поверх: простора прихожа, сучасна кухня з виходом на балкон, санвузол із душовою кабіною, пральною машиною та туалетом.

2 поверх: дві окремі кімнати, одна з яких має балкон, санвузол з ванною та туалетом.

3 поверх: зона відпочинку або кабінет із виходом на величезну терасу. На даху можна встановити сонячні батареї 5 кВт для економії енергії.`,
        property_type: 'apartment',
        transaction_type: 'sale',
        price: { amount: 165000, currency: 'USD' },
        area: 130,
        rooms: 4,
        floor: 9,
        totalFloors: 10,
        location: {
          city: 'Чернівці',
          address: 'вул. Герцена 2',
          coordinates: {}
        },
        images: [],
        features: ['Євроремонт', 'Меблі', 'Техніка', 'Паркінг', 'Охорона', '2 балкона', 'терасса'],
        is_active: true,
        is_featured: true,
        status: 'approved',
        created_by: {
          admin_id: maksym._id.toString(),
          first_name: maksym.first_name,
          last_name: maksym.last_name || '',
          email: maksym.email,
          role: maksym.role,
        },
        created_at: new Date('2025-10-23'),
        updated_at: new Date('2025-10-23'),
        source: 'admin'
      },
      {
        title: '2-кімнатна квартира',
        description: '2-кімната квартира в новобудові, на етапі будівництва. Є лоджа з гарним краєвидом',
        property_type: 'apartment',
        transaction_type: 'sale',
        price: { amount: 61000, currency: 'USD' },
        area: 61,
        rooms: 2,
        floor: 3,
        totalFloors: 4,
        location: {
          city: 'Чернівці',
          address: 'вул. 2-й Горіхівський провулок',
          coordinates: {}
        },
        images: [],
        features: ['Новобудова', 'Балкон'],
        is_active: true,
        is_featured: false,
        status: 'approved',
        created_by: tetyana ? {
          admin_id: tetyana._id.toString(),
          first_name: tetyana.first_name,
          last_name: tetyana.last_name || '',
          email: tetyana.email,
          role: tetyana.role,
        } : null,
        created_at: new Date('2025-10-23'),
        updated_at: new Date('2025-10-23'),
        source: 'admin'
      },
      {
        title: 'Двокімнатна квартира',
        description: 'Продається двокімнатна квартира площею 63 кв. м. в будинку не етапі будівництва. Квартира має велику кухню площею 13.76 кв. м., дві кімнати, ванну кімнату, та великий балкон з гарним краєвидом',
        property_type: 'apartment',
        transaction_type: 'sale',
        price: { amount: 63000, currency: 'USD' },
        area: 63,
        rooms: 2,
        floor: 3,
        totalFloors: 4,
        location: {
          city: 'Київська область',
          address: '2-й Горіхівський провулок',
          coordinates: {}
        },
        images: [],
        features: ['Паркомісця', 'сад', 'зона відпочинку', 'Лоджія'],
        is_active: true,
        is_featured: false,
        status: 'approved',
        created_by: tetyana ? {
          admin_id: tetyana._id.toString(),
          first_name: tetyana.first_name,
          last_name: tetyana.last_name || '',
          email: tetyana.email,
          role: tetyana.role,
        } : null,
        created_at: new Date('2025-10-23'),
        updated_at: new Date('2025-10-23'),
        source: 'admin'
      },
      {
        title: '2-кімнатна квартира в центрі міста',
        description: 'Простора 2-кімнатна квартира в центрі міста, біля ресторану Вікторія Делюкс. Хороше планування, підійде також для комерції.',
        property_type: 'apartment',
        transaction_type: 'sale',
        price: { amount: 109500, currency: 'USD' },
        area: 73,
        rooms: 2,
        floor: 1,
        totalFloors: 5,
        location: {
          city: 'Чернівці',
          address: 'вул. Шептицького 7',
          coordinates: {}
        },
        images: [],
        features: ['Паркінг', 'ліфт від паркінгу', 'Роздільний санвузол'],
        is_active: true,
        is_featured: false,
        status: 'approved',
        created_by: {
          admin_id: maksym._id.toString(),
          first_name: maksym.first_name,
          last_name: maksym.last_name || '',
          email: maksym.email,
          role: maksym.role,
        },
        created_at: new Date('2025-10-23'),
        updated_at: new Date('2025-10-23'),
        source: 'admin'
      },
      {
        title: '1-кімнатна квартира в центрі міста',
        description: 'Простора 1-кімнатна квартира в центрі міста, біля ресторану Вікторія Делюкс. Хороше планування.',
        property_type: 'apartment',
        transaction_type: 'sale',
        price: { amount: 64000, currency: 'USD' },
        area: 40,
        rooms: 1,
        floor: 2,
        totalFloors: 5,
        location: {
          city: 'Чернівці',
          address: 'вул. Шептицького 7',
          coordinates: {}
        },
        images: [],
        features: ['Паркінг', 'ліфт', 'ресторан', 'Роздільний санвузол'],
        is_active: true,
        is_featured: false,
        status: 'approved',
        created_by: {
          admin_id: maksym._id.toString(),
          first_name: maksym.first_name,
          last_name: maksym.last_name || '',
          email: maksym.email,
          role: maksym.role,
        },
        created_at: new Date('2025-10-23'),
        updated_at: new Date('2025-10-23'),
        source: 'admin'
      },
      {
        title: '3-кімнатна квартира в центрі міста (92 м²)',
        description: 'Простора 3-кімнатна квартира в центрі міста, біля ресторану Вікторія Делюкс. Хороше планування.',
        property_type: 'apartment',
        transaction_type: 'sale',
        price: { amount: 147200, currency: 'USD' },
        area: 92,
        rooms: 3,
        floor: 2,
        totalFloors: 5,
        location: {
          city: 'Чернівці',
          address: 'вул. Шептицького 7',
          coordinates: {}
        },
        images: [],
        features: ['Паркінг', 'ліфт', 'ресторан', 'Роздільний санвузол'],
        is_active: true,
        is_featured: false,
        status: 'approved',
        created_by: tetyana ? {
          admin_id: tetyana._id.toString(),
          first_name: tetyana.first_name,
          last_name: tetyana.last_name || '',
          email: tetyana.email,
          role: tetyana.role,
        } : null,
        created_at: new Date('2025-10-23'),
        updated_at: new Date('2025-10-23'),
        source: 'admin'
      },
      {
        title: '3-кімнатна квартира в центрі міста (87 м²)',
        description: 'Простора 3-кімнатна квартира в центрі міста, біля ресторану Вікторія Делюкс. Хороше планування.',
        property_type: 'apartment',
        transaction_type: 'sale',
        price: { amount: 139200, currency: 'USD' },
        area: 87,
        rooms: 3,
        floor: 2,
        totalFloors: 5,
        location: {
          city: 'Чернівці',
          address: 'вул. Шептицького 7',
          coordinates: {}
        },
        images: [],
        features: ['Паркінг', 'ліфт', 'ресторан', 'Роздільний санвузол'],
        is_active: true,
        is_featured: false,
        status: 'approved',
        created_by: tetyana ? {
          admin_id: tetyana._id.toString(),
          first_name: tetyana.first_name,
          last_name: tetyana.last_name || '',
          email: tetyana.email,
          role: tetyana.role,
        } : null,
        created_at: new Date('2025-10-23'),
        updated_at: new Date('2025-10-23'),
        source: 'admin'
      },
      {
        title: '3-кімнатна квартира в центрі міста (90 м²)',
        description: 'Простора 3-кімнатна квартира в центрі міста, біля ресторану Вікторія Делюкс. Хороше планування.',
        property_type: 'apartment',
        transaction_type: 'sale',
        price: { amount: 135000, currency: 'USD' },
        area: 90,
        rooms: 3,
        floor: 3,
        totalFloors: 5,
        location: {
          city: 'Чернівці',
          address: 'вул. Шептицького 7',
          coordinates: {}
        },
        images: [],
        features: ['Паркінг', 'ліфт', 'ресторан', 'Роздільний санвузол'],
        is_active: true,
        is_featured: false,
        status: 'approved',
        created_by: {
          admin_id: maksym._id.toString(),
          first_name: maksym.first_name,
          last_name: maksym.last_name || '',
          email: maksym.email,
          role: maksym.role,
        },
        created_at: new Date('2025-10-23'),
        updated_at: new Date('2025-10-23'),
        source: 'admin'
      },
      {
        title: 'Квартира в центрі міста (73 м²)',
        description: 'Квартира в центрі міста, біля ресторану Вікторія Делюкс.',
        property_type: 'apartment',
        transaction_type: 'sale',
        price: { amount: 131400, currency: 'USD' },
        area: 73,
        rooms: 0,
        floor: 5,
        totalFloors: 5,
        location: {
          city: 'Чернівці',
          address: 'вул. Шептицького 7',
          coordinates: {}
        },
        images: [],
        features: ['Паркінг', 'ліфт', 'ресторан', 'Роздільний санвузол'],
        is_active: true,
        is_featured: false,
        status: 'approved',
        created_by: {
          admin_id: maksym._id.toString(),
          first_name: maksym.first_name,
          last_name: maksym.last_name || '',
          email: maksym.email,
          role: maksym.role,
        },
        created_at: new Date('2025-10-23'),
        updated_at: new Date('2025-10-23'),
        source: 'admin'
      },
      {
        title: 'Офісне приміщення (60 м²)',
        description: 'Здається в оренду приміщення в торгово-офісному центрі «Toloka». Приміщення просторе, світле та має зручне планування. Підійде для офісу, студії або невеликого бізнесу.',
        property_type: 'commercial',
        transaction_type: 'rent',
        price: { amount: 30000, currency: 'UAH' },
        area: 60,
        rooms: 0,
        floor: 3,
        totalFloors: 5,
        location: {
          city: 'Чернівці',
          address: 'вул. Ясська 3',
          coordinates: {}
        },
        images: [],
        features: ['Готове до здачі', 'стан новий'],
        is_active: true,
        is_featured: false,
        status: 'approved',
        created_by: tetyana ? {
          admin_id: tetyana._id.toString(),
          first_name: tetyana.first_name,
          last_name: tetyana.last_name || '',
          email: tetyana.email,
          role: tetyana.role,
        } : null,
        created_at: new Date('2025-10-23'),
        updated_at: new Date('2025-10-23'),
        source: 'admin'
      },
      {
        title: 'Офісне приміщення (77 м²)',
        description: 'Здається в оренду приміщення в торгово-офісному центрі «Toloka». Приміщення просторе, світле та має зручне планування. Підійде для офісу, студії або невеликого бізнесу.',
        property_type: 'commercial',
        transaction_type: 'rent',
        price: { amount: 38500, currency: 'UAH' },
        area: 77,
        rooms: 0,
        floor: 2,
        totalFloors: 5,
        location: {
          city: 'Чернівці',
          address: 'вул. Ясська 3',
          coordinates: {}
        },
        images: [],
        features: ['Готове до здачі', 'стан новий'],
        is_active: true,
        is_featured: false,
        status: 'approved',
        created_by: tetyana ? {
          admin_id: tetyana._id.toString(),
          first_name: tetyana.first_name,
          last_name: tetyana.last_name || '',
          email: tetyana.email,
          role: tetyana.role,
        } : null,
        created_at: new Date('2025-10-23'),
        updated_at: new Date('2025-10-23'),
        source: 'admin'
      },
      {
        title: 'Паркомісце',
        description: 'Продається паркомісце у сучасному підземному паркінгу',
        property_type: 'commercial',
        transaction_type: 'sale',
        price: { amount: 15000, currency: 'USD' },
        area: 17,
        rooms: 0,
        floor: 0,
        totalFloors: 0,
        location: {
          city: 'Чернівці',
          address: 'вул. Чорноморська 4',
          coordinates: {}
        },
        images: [],
        features: ['Готове до продажу', 'підземний паркінг'],
        is_active: true,
        is_featured: false,
        status: 'approved',
        created_by: tetyana ? {
          admin_id: tetyana._id.toString(),
          first_name: tetyana.first_name,
          last_name: tetyana.last_name || '',
          email: tetyana.email,
          role: tetyana.role,
        } : null,
        created_at: new Date('2025-10-23'),
        updated_at: new Date('2025-10-23'),
        source: 'admin'
      }
    ];

    console.log(`\n📦 Підготовлено ${properties.length} об'єктів для імпорту\n`);

    const result = await propertiesCollection.insertMany(properties);
    
    console.log(`✅ Успішно імпортовано ${result.insertedCount} об'єктів нерухомості!\n`);
    
    console.log('📋 ID імпортованих об\'єктів:');
    Object.values(result.insertedIds).forEach((id, index) => {
      console.log(`   ${index + 1}. ${id}`);
    });

    await client.close();
    console.log('\n🎉 Імпорт завершено успішно!');

  } catch (error) {
    console.error('❌ Помилка імпорту:', error);
  }
}

importProperties();


