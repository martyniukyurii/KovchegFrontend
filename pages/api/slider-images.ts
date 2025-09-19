import fs from "fs/promises";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

// Функція для перемішування масиву (алгоритм Фішера-Єйтса)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const sliderDir = path.join(process.cwd(), "public", "images", "slider");

    // Перевіряємо, чи існує директорія
    try {
      await fs.access(sliderDir);
    } catch (error) {
      console.error("Slider directory does not exist:", error);
      return res.status(200).json({ images: [] });
    }

    const files = await fs.readdir(sliderDir);

    const images = shuffleArray(
      files
        .filter((file) => /\.(jpg|jpeg|png|webp|avif)$/i.test(file))
        .map((file) => `/images/slider/${file}`),
    );

    console.log("Found images:", images); // Для дебагу

    res.status(200).json({ images });
  } catch (error) {
    console.error("Error reading slider images:", error);
    res.status(500).json({ images: [] });
  }
}




