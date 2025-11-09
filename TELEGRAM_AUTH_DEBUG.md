# 🔧 Налагодження Telegram авторизації

## ✅ Що вже зроблено:

### 1. **Динамічне завантаження Telegram Widget**
- ✅ Script створюється через `document.createElement()`
- ✅ Додається в DOM через `appendChild()`
- ✅ Кнопка Telegram тепер з'являється на сайті

### 2. **Захист від множинних викликів**
- ✅ Використовується `useRef` для відстеження стану обробки
- ✅ Перший виклик обробляється, наступні ігноруються
- ✅ Додано логування для діагностики

### 3. **Розширене логування**
- ✅ Логи в API: метод, тіло запиту, результат пошуку
- ✅ Логи на фронтенді: дані користувача, помилки

---

## 🐛 Поточна проблема:

З логів консолі видно:
```
admin-a42af50978c30f75.js:1 Telegram auth: Object { id: 1399519970, ... }
api/admin/auth:1 Failed to load resource: the server responded with a status of 405 ()
```

**405 помилка = "Method Not Allowed"**

Це означає, що:
- ❌ API endpoint не отримує POST запит
- ❌ Або endpoint не існує
- ❌ Або є проблема з роутингом Next.js

---

## 🔍 Діагностика:

### Крок 1: Перевірте логи Vercel

```bash
npx vercel logs kovchegfrontend-r00wyxjpe-martyniukyuriis-projects.vercel.app --follow
```

Шукайте в логах:
- `🔐 Auth API called:` - чи викликається API взагалі
- `❌ Method not allowed:` - який метод приходить
- `🔍 Searching for Telegram ID:` - чи шукається користувач

### Крок 2: Перевірте змінні середовища на Vercel

1. Відкрийте https://vercel.com/dashboard
2. Виберіть проект `kovchegfrontend`
3. Settings → Environment Variables
4. Перевірте чи є `MONGODB_URI`

**Якщо немає** - додайте:
```
MONGODB_URI = mongodb+srv://yuramartin1993:ZgKbgBGVXm2Wi2Xf@cluster0.gitezea.mongodb.net/
```

### Крок 3: Перевірте структуру API файлів

Файл має бути тут:
```
/Users/yurii/KovchegFrontend/pages/api/admin/auth.ts
```

URL має бути:
```
https://kovcheg.cv.ua/api/admin/auth
```

### Крок 4: Перевірте дані в MongoDB

Telegram ID користувача з логів: `1399519970`

Зайдіть в MongoDB Compass і перевірте:
```javascript
db.admins.findOne({ telegram_id: 1399519970 })
```

Має повернути:
```json
{
  "_id": "...",
  "telegram_id": 1399519970,
  "first_name": "Евгений Карпов",
  "role": "admin" або "agent",
  ...
}
```

---

## 🔧 Можливі рішення:

### Рішення 1: Redeploy з очищенням кешу

```bash
cd /Users/yurii/KovchegFrontend
npx vercel --prod --force
```

### Рішення 2: Перевірте чи API файл компілюється

Локально запустіть:
```bash
npm run dev
```

Відкрийте в браузері:
```
http://localhost:3000/api/admin/auth
```

Має повернути:
```json
{"message":"Method not allowed"}
```

Якщо повертає 404 - файл не компілюється.

### Рішення 3: Перевірте CORS

Можливо Vercel блокує запити. Додайте в `pages/api/admin/auth.ts`:

```typescript
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Додайте CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // ... решта коду
}
```

---

## 📊 Очікувана поведінка:

### Успішна авторизація:

1. Користувач натискає кнопку Telegram
2. Відкривається popup Telegram
3. Користувач підтверджує
4. Telegram викликає `onTelegramAuth(user)`
5. **Перший виклик** - відправляється POST на `/api/admin/auth`
6. **Наступні виклики** - ігноруються (логується "Already processing")
7. API шукає користувача в MongoDB
8. Повертає токен та дані
9. Редирект на `/admin/dashboard`

### Логи в консолі (успішно):

```
Telegram auth: { id: 1399519970, ... }
🔐 Auth API called: { method: 'POST', body: { telegram_id: 1399519970 } }
📝 Auth data: { telegram_id: 'present' }
🔍 Searching for Telegram ID: 1399519970
👤 Admin found: YES
```

---

## 🆘 Якщо нічого не допомагає:

Спробуйте альтернативний підхід - використайте `redirect` замість `callback`:

1. Змініть в `pages/admin/index.tsx`:

```typescript
script.setAttribute('data-auth-url', 'https://kovcheg.cv.ua/api/admin/telegram-callback');
// Видаліть data-onauth
```

2. Створіть новий API endpoint `pages/api/admin/telegram-callback.ts`:

```typescript
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, first_name, username, auth_date, hash } = req.query;
  
  // Авторизація...
  
  // Редирект на фронтенд з токеном
  res.redirect(`/admin/dashboard?token=${token}`);
}
```

---

## 📞 Контакти для підтримки:

Якщо проблема не вирішується - надішліть:
1. Скріншот консолі браузера (F12 → Console)
2. Логи з Vercel
3. Результат перевірки MongoDB

---

**Останнє оновлення:** 2025-01-09
**Версія:** 1.0

