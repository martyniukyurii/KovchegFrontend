import DefaultLayout from "@/layouts/default";
import { useTranslation } from "@/hooks/useTranslation";
import AboutSection from "@/components/about/about-section";
import Head from "next/head";

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>Про нас - Агентство нерухомості "Ваш Ковчег" в Чернівцях | 20 років досвіду</title>
        <meta name="description" content="Агентство нерухомості 'Ваш Ковчег' в Чернівцях з 2004 року. Купівля, продаж, оренда квартир, будинків, земельних ділянок. 1000+ задоволених клієнтів, 500+ успішних угод." />
        <meta name="keywords" content="агентство нерухомості Чернівці, купівля квартир Чернівці, продаж будинків Чернівці, оренда нерухомості, земельні ділянки Чернівці, новобудови Чернівці, комерційна нерухомість" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Про нас - Агентство нерухомості 'Ваш Ковчег' в Чернівцях" />
        <meta property="og:description" content="20 років досвіду на ринку нерухомості Чернівців. Професійні послуги з купівлі, продажу та оренди нерухомості." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kovcheg.com.ua/about" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Про нас - Агентство нерухомості 'Ваш Ковчег' в Чернівцях" />
        <meta name="twitter:description" content="20 років досвіду на ринку нерухомості Чернівців. Професійні послуги з купівлі, продажу та оренди нерухомості." />
        <link rel="canonical" href="https://kovcheg.com.ua/about" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              "name": "Агентство нерухомості 'Ваш Ковчег'",
              "description": "Агентство нерухомості в Чернівцях з 2004 року. Купівля, продаж, оренда квартир, будинків, земельних ділянок.",
              "url": "https://kovcheg.com.ua",
              "logo": "https://kovcheg.com.ua/logo.png",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "вул. Небесної сотні 8",
                "addressLocality": "Чернівці",
                "postalCode": "58005",
                "addressCountry": "UA"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+380501505555",
                "contactType": "customer service",
                "availableLanguage": ["Ukrainian", "Russian"]
              },
              "foundingDate": "2004",
              "numberOfEmployees": "10",
              "areaServed": {
                "@type": "City",
                "name": "Чернівці"
              },
              "serviceType": ["Real Estate Sales", "Real Estate Rental", "Property Management"],
              "priceRange": "$$"
            })
          }}
        />
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            {t("about.title")}
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            {t("about.subtitle")}
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">20+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Років на ринку</div>
            </div>
            
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">1000+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Задоволених клієнтів</div>
            </div>
            
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">500+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Успішних угод</div>
            </div>
            
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">10+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Професійних агентів</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* About Content */}
      <section className="py-16 md:py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <AboutSection />
        </div>
      </section>
      </DefaultLayout>
    </>
  );
}
