import React from "react";
import { IconLoader2 } from "@tabler/icons-react";
import { useTranslation } from "@/hooks/useTranslation";

interface TranslationWrapperProps {
  children: React.ReactNode;
}

export const TranslationWrapper: React.FC<TranslationWrapperProps> = ({ children }) => {
  const { isLoading } = useTranslation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="text-center">
          <IconLoader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600 dark:text-gray-400">Завантаження локалізації...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
