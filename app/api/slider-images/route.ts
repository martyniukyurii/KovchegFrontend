import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Функція для перемішування масиву (алгоритм Фішера-Єйтса)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function GET() {
  try {
    const sliderDir = path.join(process.cwd(), 'public', 'images', 'slider');
    
    // Перевіряємо, чи існує директорія
    try {
      await fs.access(sliderDir);
    } catch (error) {
      console.error('Slider directory does not exist:', error);
      return NextResponse.json({ images: [] });
    }
    
    const files = await fs.readdir(sliderDir);
    
    const images = shuffleArray(
      files
        .filter(file => /\.(jpg|jpeg|png|webp|avif)$/i.test(file))
        .map(file => `/images/slider/${file}`)
    );

    console.log('Found images:', images); // Для дебагу
    
    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error reading slider images:', error);
    return NextResponse.json({ images: [] }, { status: 500 });
  }
} 