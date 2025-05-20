import { FC } from 'react';
import { Select, SelectItem } from "@heroui/react";
import { useTranslation } from '@/hooks/useTranslation';

type Locale = 'uk' | 'en' | 'ru';

const FlagIcon = ({ country }: { country: Locale }) => {
  return (
    <svg
      width="20"
      height="15"
      viewBox="0 0 20 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {country === 'uk' && (
        <>
          <rect width="20" height="15" fill="#005BBB"/>
          <rect y="7.5" width="20" height="7.5" fill="#FFD500"/>
        </>
      )}
      {country === 'en' && (
        <>
          <rect width="20" height="15" fill="#012169"/>
          <path d="M0 0L20 15M20 0L0 15" stroke="white" strokeWidth="2"/>
          <path d="M10 0V15M0 7.5H20" stroke="white" strokeWidth="3"/>
          <path d="M10 0V15M0 7.5H20" stroke="#C8102E" strokeWidth="2"/>
        </>
      )}
      {country === 'ru' && (
        <>
          <rect width="20" height="5" fill="#fff"/>
          <rect y="5" width="20" height="5" fill="#0039A6"/>
          <rect y="10" width="20" height="5" fill="#D52B1E"/>
        </>
      )}
    </svg>
  );
};

const languages: Array<{ key: Locale; label: string }> = [
  { key: "uk", label: "UK" },
  { key: "en", label: "EN" },
  { key: "ru", label: "RU" },
];

export const LanguageSwitch: FC = () => {
  const { locale, changeLocale } = useTranslation();

  const handleSelectionChange = (keys: any) => {
    const newLocale = Array.from(keys)[0] as Locale;
    if (newLocale !== locale) {
      changeLocale(newLocale);
      // Перезавантажуємо сторінку після короткої затримки
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  return (
    <Select
      className="min-w-[120px]"
      selectedKeys={[locale]}
      onSelectionChange={handleSelectionChange}
      startContent={<FlagIcon country={locale} />}
    >
      {languages.map((lang) => (
        <SelectItem 
          key={lang.key}
          startContent={<FlagIcon country={lang.key} />}
        >
          {lang.label}
        </SelectItem>
      ))}
    </Select>
  );
}; 