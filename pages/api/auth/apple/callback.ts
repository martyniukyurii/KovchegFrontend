import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Отримуємо параметри з URL
    const { code, state } = req.query;

    // Перевіряємо наявність коду
    if (!code || typeof code !== "string") {
      return res.status(400).json({ error: "Authorization code is missing" });
    }

    // TODO: Реалізувати логіку обробки Apple callback
    // 1. Обмін коду на токени
    // 2. Отримання інформації про користувача
    // 3. Створення/оновлення користувача в базі даних
    // 4. Генерація JWT токену

    // Тимчасово перенаправляємо на головну сторінку
    res.redirect("/");
  } catch (error) {
    console.error("Error in Apple callback:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
}




