import { NextRequest, NextResponse } from 'next/server';

// Конфігурація для Google OAuth
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback';

// URL для обміну коду на токени доступу
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
// URL для отримання інформації про користувача
const GOOGLE_USER_INFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

export async function GET(request: NextRequest) {
  try {
    // Отримуємо код авторизації з URL
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    
    // Перевіряємо наявність коду
    if (!code) {
      return NextResponse.json({ error: 'Authorization code is missing' }, { status: 400 });
    }
    
    // В реальному проекті тут потрібно перевірити state для безпеки
    
    // Обмінюємо код на токен доступу
    const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });
    
    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.error('Error exchanging code for token:', tokenData);
      return NextResponse.json({ error: 'Failed to exchange code for token' }, { status: 500 });
    }
    
    // Отримуємо інформацію про користувача за допомогою токену доступу
    const userInfoResponse = await fetch(GOOGLE_USER_INFO_URL, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });
    
    const userData = await userInfoResponse.json();
    
    if (!userInfoResponse.ok) {
      console.error('Error fetching user info:', userData);
      return NextResponse.json({ error: 'Failed to fetch user info' }, { status: 500 });
    }
    
    // В реальному проекті тут:
    // 1. Знайти користувача в базі даних за email або створити нового
    // 2. Створити JWT токен або сесію
    // 3. Зберегти токен у куках або localStorage
    
    // Зараз просто перенаправляємо користувача на головну сторінку з тимчасовим токеном
    const homeUrl = new URL('/', request.nextUrl.origin);
    // Додаємо тимчасовий токен до URL (в реальному проекті використовуйте cookie)
    homeUrl.searchParams.append('token', Math.random().toString(36).substring(2));
    
    // Перенаправляємо користувача на головну сторінку
    return NextResponse.redirect(homeUrl);
  } catch (error) {
    console.error('Error in Google callback:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
} 