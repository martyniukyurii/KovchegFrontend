import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Конфігурація для Apple OAuth
const APPLE_CLIENT_ID = process.env.APPLE_CLIENT_ID || '';
const APPLE_TEAM_ID = process.env.APPLE_TEAM_ID || '';
const APPLE_KEY_ID = process.env.APPLE_KEY_ID || '';
const APPLE_PRIVATE_KEY = process.env.APPLE_PRIVATE_KEY || ''; // Приватний ключ у форматі PEM

// URL для обміну коду на токени доступу
const APPLE_TOKEN_URL = 'https://appleid.apple.com/auth/token';

export async function POST(request: NextRequest) {
  try {
    // Отримуємо дані форми
    const formData = await request.formData();
    const code = formData.get('code')?.toString();
    const state = formData.get('state')?.toString();
    const user = formData.get('user')?.toString(); // JSON як строка з інформацією про користувача
    
    // Перевіряємо наявність коду
    if (!code) {
      return NextResponse.json({ error: 'Authorization code is missing' }, { status: 400 });
    }
    
    // В реальному проекті тут потрібно перевірити state для безпеки
    
    // Створюємо Client Secret для Apple - це JWT підписаний приватним ключем
    const clientSecret = generateAppleClientSecret();
    
    // Обмінюємо код на токен доступу
    const tokenResponse = await fetch(APPLE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: APPLE_CLIENT_ID,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
      }),
    });
    
    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.error('Error exchanging code for token:', tokenData);
      return NextResponse.json({ error: 'Failed to exchange code for token' }, { status: 500 });
    }
    
    // Декодуємо id_token для отримання email користувача
    const userData = jwt.decode(tokenData.id_token);
    
    // Парсимо додаткову інформацію про користувача (ім'я), якщо вона є
    let userInfo = {};
    if (user) {
      try {
        userInfo = JSON.parse(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    // В реальному проекті тут:
    // 1. Знайти користувача в базі даних за email або створити нового
    // 2. Створити JWT токен або сесію
    // 3. Зберегти токен у куках або localStorage
    
    // Зараз просто перенаправляємо користувача на головну сторінку з тимчасовим токеном
    const homeUrl = new URL('/', new URL(request.url).origin);
    // Додаємо тимчасовий токен до URL (в реальному проекті використовуйте cookie)
    homeUrl.searchParams.append('token', Math.random().toString(36).substring(2));
    
    // Перенаправляємо користувача на головну сторінку
    return NextResponse.redirect(homeUrl);
  } catch (error) {
    console.error('Error in Apple callback:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

// Функція для генерації client_secret для Apple
function generateAppleClientSecret() {
  try {
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: APPLE_TEAM_ID,
      iat: now,
      exp: now + 86400 * 180, // 180 днів
      aud: 'https://appleid.apple.com',
      sub: APPLE_CLIENT_ID,
    };
    
    const signOptions = {
      algorithm: 'ES256' as const,
      keyid: APPLE_KEY_ID,
    };
    
    return jwt.sign(payload, APPLE_PRIVATE_KEY, signOptions);
  } catch (error) {
    console.error('Error generating Apple client secret:', error);
    throw error;
  }
} 