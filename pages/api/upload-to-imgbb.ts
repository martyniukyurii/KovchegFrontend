import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

// API ключ ImgBB
const IMGBB_API_KEY = 'd9212d9b0fa918b0b3df3ca7252878d9';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed' 
    });
  }

  try {
    const form = formidable({
      maxFileSize: 32 * 1024 * 1024, // 32MB максимум
    });

    const [fields, files] = await form.parse(req);

    const file = files.image?.[0];
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'Файл не знайдено',
      });
    }

    // Перевірка типу файлу
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype || '')) {
      return res.status(400).json({
        success: false,
        message: 'Непідтримуваний формат файлу. Дозволені: JPG, PNG, GIF, WebP',
      });
    }

    // Читаємо файл як base64
    const imageBuffer = fs.readFileSync(file.filepath);
    const base64Image = imageBuffer.toString('base64');

    // Завантажуємо на ImgBB
    const formData = new URLSearchParams();
    formData.append('image', base64Image);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    // Видаляємо тимчасовий файл
    fs.unlinkSync(file.filepath);

    if (data.success) {
      return res.status(200).json({
        success: true,
        url: data.data.url,
        displayUrl: data.data.display_url,
        deleteUrl: data.data.delete_url,
        message: 'Зображення успішно завантажено',
      });
    } else {
      return res.status(400).json({
        success: false,
        message: data.error?.message || 'Помилка завантаження зображення на ImgBB',
      });
    }
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      success: false,
      message: 'Помилка сервера',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

