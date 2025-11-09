import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const IMGBB_API_KEY = ''; // Потрібно додати API ключ ImgBB

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const form = formidable({});
    const [fields, files] = await form.parse(req);

    const file = files.image?.[0];
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'Файл не знайдено',
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

    if (data.success) {
      return res.status(200).json({
        success: true,
        url: data.data.url,
        delete_url: data.data.delete_url,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Помилка завантаження зображення',
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


