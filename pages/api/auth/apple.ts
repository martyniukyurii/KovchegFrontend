import crypto from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";

// Конфігурація для Apple OAuth
const APPLE_CLIENT_ID = process.env.APPLE_CLIENT_ID || "";
const APPLE_TEAM_ID = process.env.APPLE_TEAM_ID || "";
const APPLE_KEY_ID = process.env.APPLE_KEY_ID || "";
const APPLE_REDIRECT_URI =
  process.env.APPLE_REDIRECT_URI ||
  "http://localhost:3000/api/auth/apple/callback";
const APPLE_PRIVATE_KEY = process.env.APPLE_PRIVATE_KEY || ""; // Приватний ключ у форматі PEM

// Параметри для аутентифікації через Apple
const APPLE_AUTH_URL = "https://appleid.apple.com/auth/authorize";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Створюємо URL для перенаправлення на автентифікацію Apple
    const authUrl = new URL(APPLE_AUTH_URL);

    // Генеруємо state для безпеки
    const state = crypto.randomBytes(16).toString("hex");

    // Додаємо необхідні параметри
    authUrl.searchParams.append("client_id", APPLE_CLIENT_ID);
    authUrl.searchParams.append("redirect_uri", APPLE_REDIRECT_URI);
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("scope", "name email");
    authUrl.searchParams.append("response_mode", "form_post");
    authUrl.searchParams.append("state", state);

    // Перенаправляємо користувача на сторінку аутентифікації Apple
    res.redirect(authUrl.toString());
  } catch (error) {
    console.error("Error with Apple OAuth:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
}




