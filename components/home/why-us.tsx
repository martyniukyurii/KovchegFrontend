import { Card } from "@heroui/card";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

export function WhyUs() {
  const { t } = useTranslation();

  return (
    <section className="min-h-screen flex flex-col justify-center relative py-12">
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background/80 backdrop-blur-[2px]" />
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
          {t('whyUs.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="group relative overflow-hidden bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-[8px] border-primary/20 hover:border-primary/40 transition-all duration-500 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
            <div className="relative w-full h-40 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt={t('whyUs.buy.title')}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-6 flex flex-col h-[calc(100%-10rem)]">
              <h3 className="text-xl font-bold mb-4 text-foreground">{t('whyUs.buy.title')}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                {t('whyUs.buy.description')}
              </p>
              <Link 
                href="/agents"
                className="mt-6 inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-8 py-2 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02]"
              >
                {t('whyUs.buy.button')}
              </Link>
            </div>
          </Card>

          <Card className="group relative overflow-hidden bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-[8px] border-primary/20 hover:border-primary/40 transition-all duration-500 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
            <div className="relative w-full h-40 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80"
                alt={t('whyUs.sell.title')}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-6 flex flex-col h-[calc(100%-10rem)]">
              <h3 className="text-xl font-bold mb-4 text-foreground">{t('whyUs.sell.title')}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                {t('whyUs.sell.description')}
              </p>
              <Link 
                href="/sell"
                className="mt-6 inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-8 py-2 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02]"
              >
                {t('whyUs.sell.button')}
              </Link>
            </div>
          </Card>

          <Card className="group relative overflow-hidden bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-[8px] border-primary/20 hover:border-primary/40 transition-all duration-500 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
            <div className="relative w-full h-40 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80"
                alt={t('whyUs.rent.title')}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-6 flex flex-col h-[calc(100%-10rem)]">
              <h3 className="text-xl font-bold mb-4 text-foreground">{t('whyUs.rent.title')}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                {t('whyUs.rent.description')}
              </p>
              <Link 
                href="/rent"
                className="mt-6 inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-8 py-2 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02]"
              >
                {t('whyUs.rent.button')}
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
} 