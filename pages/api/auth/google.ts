import type { NextApiRequest, NextApiResponse } from "next";

// Конфігурація для Google OAuth
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const REDIRECT_URI =
  process.env.GOOGLE_REDIRECT_URI ||
  "http://localhost:3000/api/auth/google/callback";

// Параметри для аутентифікації через Google
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const SCOPES = ["profile", "email"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Створюємо URL для перенаправлення на автентифікацію Google
    const authUrl = new URL(GOOGLE_AUTH_URL);

    // Додаємо необхідні параметри
    authUrl.searchParams.append("client_id", GOOGLE_CLIENT_ID);
    authUrl.searchParams.append("redirect_uri", REDIRECT_URI);
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("scope", SCOPES.join(" "));
    authUrl.searchParams.append("access_type", "offline");
    authUrl.searchParams.append("prompt", "consent");

    // В реальному проекті тут також потрібно додати state для безпеки
    const state = Math.random().toString(36).substring(2);
    authUrl.searchParams.append("state", state);

    // Перенаправляємо користувача на сторінку аутентифікації Google
    res.redirect(authUrl.toString());
  } catch (error) {
    console.error("Error with Google OAuth:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
}




