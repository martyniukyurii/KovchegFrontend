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
        {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 dark:from-blue-950 dark:via-blue-900 dark:to-indigo-900 py-16 md:py-24">
        <div className="absolute inset-0 opacity-50">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            {t("agents.title")}
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            {t("agents.subtitle")}
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">7</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Професійних агентів</div>
            </div>
            
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">1800+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Успішних угод</div>
            </div>
            
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">30</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Років досвіду</div>
            </div>
          </div>
        </div>
      </section>
      
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
