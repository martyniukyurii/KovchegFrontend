import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { useTranslation } from "@/hooks/useTranslation";
import { SellPropertyForm } from "@/components/sell/sell-property-form";
import Head from "next/head";

export default function SellPage() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>Продати нерухомість в Чернівцях - Безкоштовна оцінка та швидкий продаж | Ваш Ковчег</title>
        <meta name="description" content="Продайте нерухомість в Чернівцях швидко та вигідно. Безкоштовна оцінка, терміновий викуп, повний сервіс продажу під ключ. 20 років досвіду на ринку нерухомості." />
        <meta name="keywords" content="продати нерухомість Чернівці, оцінка нерухомості Чернівці, швидкий продаж квартир, терміновий викуп нерухомості, продаж будинків Чернівці, продаж земельних ділянок" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Продати нерухомість в Чернівцях - Безкоштовна оцінка та швидкий продаж" />
        <meta property="og:description" content="Професійні послуги з продажу нерухомості в Чернівцях. Безкоштовна оцінка, швидкий продаж, терміновий викуп." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kovcheg.com.ua/sell" />
        <link rel="canonical" href="https://kovcheg.com.ua/sell" />
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            {t("sell.title")}
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            {t("sell.subtitle")}
          </p>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=64&h=64&fit=crop&crop=center" 
                  alt="Оцінка нерухомості"
                  className="w-10 h-10 rounded-lg object-cover"
                />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Безкоштовна оцінка</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Професійна оцінка ринкової вартості</p>
            </div>
            
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=64&h=64&fit=crop&crop=center" 
                  alt="Швидкий продаж"
                  className="w-10 h-10 rounded-lg object-cover"
                />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Швидкий продаж</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Терміновий викуп нерухомості</p>
            </div>
            
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=64&h=64&fit=crop&crop=center" 
                  alt="Повний сервіс"
                  className="w-10 h-10 rounded-lg object-cover"
                />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Повний сервіс</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Продаж під ключ</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Form Section */}
      <section className="py-16 md:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">Заповніть форму</h2>
              <p className="text-blue-100">Ми зв'яжемося з вами найближчим часом</p>
            </div>
            
            <div className="p-8">
              <SellPropertyForm />
            </div>
          </div>
        </div>
      </section>
      </DefaultLayout>
    </>
  );
}
