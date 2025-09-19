import type { NextApiRequest, NextApiResponse } from "next";

// Конфігурація для Google OAuth
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const REDIRECT_URI =
  process.env.GOOGLE_REDIRECT_URI ||
  "http://localhost:3000/api/auth/google/callback";

// URL для обміну коду на токени доступу
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
// URL для отримання інформації про користувача
const GOOGLE_USER_INFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Отримуємо код авторизації з URL
    const { code, state } = req.query;

    // Перевіряємо наявність коду
    if (!code || typeof code !== "string") {
      return res.status(400).json({ error: "Authorization code is missing" });
    }

    // В реальному проекті тут потрібно перевірити state для безпеки

    // Обмінюємо код на токен доступу
    const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Error exchanging code for token:", tokenData);
      return res.status(500).json({ error: "Failed to exchange code for token" });
    }

    // Отримуємо інформацію про користувача за допомогою токену доступу
    const userInfoResponse = await fetch(GOOGLE_USER_INFO_URL, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userInfoResponse.json();

    if (!userInfoResponse.ok) {
      console.error("Error fetching user info:", userData);
      return res.status(500).json({ error: "Failed to fetch user info" });
    }

    // В реальному проекті тут:
    // 1. Знайти користувача в базі даних за email або створити нового
    // 2. Створити JWT токен або сесію
    // 3. Зберегти токен у куках або localStorage

    // Зараз просто перенаправляємо користувача на головну сторінку з тимчасовим токеном
    const homeUrl = new URL("/", `http://${req.headers.host}`);

    // Додаємо тимчасовий токен до URL (в реальному проекті використовуйте cookie)
    homeUrl.searchParams.append(
      "token",
      Math.random().toString(36).substring(2),
    );

    // Перенаправляємо користувача на головну сторінку
    res.redirect(homeUrl.toString());
  } catch (error) {
    console.error("Error in Google callback:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
}




