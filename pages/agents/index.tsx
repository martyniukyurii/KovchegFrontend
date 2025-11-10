import DefaultLayout from "@/layouts/default";
import { useTranslation } from "@/hooks/useTranslation";
import { AgentsSection } from "@/components/agents/agents-section";
import Head from "next/head";

export default function AgentsPage() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>Наші агенти - Професійна команда агентів нерухомості в Чернівцях | Ваш Ковчег</title>
        <meta name="description" content="7 професійних агентів нерухомості в Чернівцях з 1800+ успішними угодами. Сергій Босовик, Микола Гунько, Ніна Богданова та інші експерти з нерухомості." />
        <meta name="keywords" content="агенти нерухомості Чернівці, риелтори Чернівці, консультанти нерухомості, експерти з нерухомості Чернівці, агентство нерухомості співробітники, Сергій Босовик, Микола Гунько" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Наші агенти - Професійна команда агентів нерухомості в Чернівцях" />
        <meta property="og:description" content="7 досвідчених агентів нерухомості з 1800+ успішними угодами та 30 років досвіду. Кожен агент спеціалізується на своїй сфері нерухомості." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kovcheg.com.ua/agents" />
        <link rel="canonical" href="https://kovcheg.com.ua/agents" />
      </Head>
      <DefaultLayout>
        {/* Agents Section */}
      <section className="py-16 md:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <AgentsSection />
        </div>
      </section>
      </DefaultLayout>
    </>
  );
}
