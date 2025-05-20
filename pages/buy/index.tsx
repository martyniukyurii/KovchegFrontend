import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { useTranslation } from "@/hooks/useTranslation";

export default function BuyPage() {
  const { t } = useTranslation();
  
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>{t('nav.buy')}</h1>
        </div>
      </section>
    </DefaultLayout>
  );
} 