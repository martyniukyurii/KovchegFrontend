// Утіліти для завантаження зображень через imgbb API

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || 'ba24e0458b09a4dfa95ba22b9c5e5058'; // Public key для тестування

export interface ImageUploadResult {
  url: string;
  deleteUrl?: string;
  thumbnailUrl?: string;
  originalName: string;
  size: number;
}

export interface ImageUploadError {
  message: string;
  code?: string;
}

/**
 * Завантажує зображення на imgbb
 */
export async function uploadImageToImgbb(file: File): Promise<ImageUploadResult> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Файл повинен бути зображенням');
  }

  // Обмеження розміру файлу до 10MB
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error('Розмір файлу не повинен перевищувати 10MB');
  }

  const formData = new FormData();
  formData.append('image', file);
  formData.append('key', IMGBB_API_KEY);

  try {
    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error?.message || 'Не вдалося завантажити зображення');
    }

    return {
      url: data.data.url,
      deleteUrl: data.data.delete_url,
      thumbnailUrl: data.data.thumb?.url,
      originalName: file.name,
      size: file.size,
    };
  } catch (error: any) {
    console.error('Помилка завантаження зображення:', error);
    throw new Error(error.message || 'Не вдалося завантажити зображення');
  }
}

/**
 * Перевіряє чи файл є валідним зображенням
 */
export function validateImageFile(file: File): string | null {
  // Перевірка типу файлу
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return 'Підтримуються тільки файли форматів: JPEG, PNG, GIF, WebP';
  }

  // Перевірка розміру
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return 'Розмір файлу не повинен перевищувати 10MB';
  }

  return null;
}

/**
 * Стискає зображення перед завантаженням
 */
export function compressImage(file: File, maxWidth: number = 1920, maxHeight: number = 1080, quality: number = 0.8): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Розрахунок нових розмірів зі збереженням пропорцій
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
      }

      canvas.width = width;
      canvas.height = height;

      // Малювання зображення на canvas
      ctx?.drawImage(img, 0, 0, width, height);

      // Конвертація в blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Не вдалося стиснути зображення'));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => {
      reject(new Error('Не вдалося завантажити зображення для стиснення'));
    };

    img.src = URL.createObjectURL(file);
  });
}

/**
 * Завантажує зображення з автоматичним стисненням
 */
export async function uploadImageWithCompression(
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    autoCompress?: boolean;
  } = {}
): Promise<ImageUploadResult> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    autoCompress = true,
  } = options;

  // Валідація файлу
  const validationError = validateImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  let fileToUpload = file;

  // Автоматичне стиснення для великих зображень
  if (autoCompress && (file.size > 2 * 1024 * 1024)) { // Якщо більше 2MB
    try {
      fileToUpload = await compressImage(file, maxWidth, maxHeight, quality);
      console.log(`Зображення стиснено з ${(file.size / 1024 / 1024).toFixed(2)}MB до ${(fileToUpload.size / 1024 / 1024).toFixed(2)}MB`);
    } catch (error) {
      console.warn('Не вдалося стиснути зображення, завантажуємо оригінал:', error);
      fileToUpload = file;
    }
  }

  return uploadImageToImgbb(fileToUpload);
} 