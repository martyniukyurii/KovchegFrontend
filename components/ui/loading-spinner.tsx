import { Spinner } from "@heroui/react";
import { useTranslation } from "@/hooks/useTranslation";

export function LoadingSpinner() {
  const { t } = useTranslation();
  
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <Spinner size="lg" color="primary" />
      <p className="mt-4 text-foreground">{t('loading')}</p>
    </div>
  );
} 