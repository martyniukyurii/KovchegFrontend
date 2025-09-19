import React, { useEffect, useRef } from 'react';

interface TelegramLoginWidgetProps {
  botName: string;
  onAuth: (user: any) => void;
  buttonSize?: 'large' | 'medium' | 'small';
  cornerRadius?: number;
  requestAccess?: boolean;
  usePic?: boolean;
  lang?: string;
}

export const TelegramLoginWidget: React.FC<TelegramLoginWidgetProps> = ({
  botName,
  onAuth,
  buttonSize = 'large',
  cornerRadius,
  requestAccess = true,
  usePic = true,
  lang = 'uk'
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !botName) return;

    // Очищуємо попередній контент
    ref.current.innerHTML = '';

    // Створюємо глобальну функцію для обробки callback
    const callbackName = `onTelegramAuth_${Date.now()}`;
    (window as any)[callbackName] = onAuth;

    // Створюємо скрипт
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', botName);
    script.setAttribute('data-size', buttonSize);
    script.setAttribute('data-onauth', `${callbackName}(user)`);
    
    if (requestAccess) {
      script.setAttribute('data-request-access', 'write');
    }
    
    if (cornerRadius !== undefined) {
      script.setAttribute('data-radius', cornerRadius.toString());
    }
    
    if (!usePic) {
      script.setAttribute('data-userpic', 'false');
    }
    
    script.setAttribute('data-lang', lang);
    script.async = true;

    ref.current.appendChild(script);

    // Cleanup function
    return () => {
      delete (window as any)[callbackName];
    };
  }, [botName, onAuth, buttonSize, cornerRadius, requestAccess, usePic, lang]);

  return <div ref={ref} />;
};

// Hooks для роботи з Telegram Login Widget
export const useTelegramLoginWidget = () => {
  const loadScript = () => {
    return new Promise<void>((resolve, reject) => {
      // Перевіряємо чи скрипт вже завантажений
      if ((window as any).TelegramLoginWidget) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Telegram widget script'));
      
      document.head.appendChild(script);
    });
  };

  const createLoginButton = async (
    container: HTMLElement,
    botName: string,
    onAuth: (user: any) => void,
    options: {
      buttonSize?: 'large' | 'medium' | 'small';
      cornerRadius?: number;
      requestAccess?: boolean;
      usePic?: boolean;
      lang?: string;
    } = {}
  ) => {
    await loadScript();

    const {
      buttonSize = 'large',
      cornerRadius,
      requestAccess = true,
      usePic = true,
      lang = 'uk'
    } = options;

    // Очищуємо контейнер
    container.innerHTML = '';

    // Створюємо унікальну функцію callback
    const callbackName = `onTelegramAuth_${Date.now()}`;
    (window as any)[callbackName] = onAuth;

    // Створюємо iframe для віджета
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', botName);
    script.setAttribute('data-size', buttonSize);
    script.setAttribute('data-onauth', `${callbackName}(user)`);
    
    if (requestAccess) {
      script.setAttribute('data-request-access', 'write');
    }
    
    if (cornerRadius !== undefined) {
      script.setAttribute('data-radius', cornerRadius.toString());
    }
    
    if (!usePic) {
      script.setAttribute('data-userpic', 'false');
    }
    
    script.setAttribute('data-lang', lang);
    script.async = true;

    container.appendChild(script);

    // Повертаємо функцію для очищення
    return () => {
      delete (window as any)[callbackName];
    };
  };

  return { loadScript, createLoginButton };
}; 