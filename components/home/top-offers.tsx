"use client";
import Image from "next/image";
import React from "react";
import { Carousel, Card } from "../../components/ui/apple-cards-carousel";
import { useTranslation } from "@/hooks/useTranslation";

interface Property {
  id: number;
  title: string;
  price: string;
  location: string;
  image: string;
  category: string;
  src: string;
  content: React.ReactNode;
}

export function TopOffers() {
  const { t } = useTranslation();

const properties: Property[] = [
  {
    id: 1,
      category: t('topOffers.categories.apartments'),
      title: t('topOffers.properties.apartment.title'),
    price: "150,000 $",
      location: t('topOffers.properties.apartment.location'),
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1920&q=100",
    src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1920&q=100",
    content: null
  },
  {
    id: 2,
      category: t('topOffers.categories.houses'),
      title: t('topOffers.properties.cottage.title'),
    price: "280,000 $",
      location: t('topOffers.properties.cottage.location'),
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=100",
    src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=100",
    content: null
  },
  {
    id: 3,
      category: t('topOffers.categories.apartments'),
      title: t('topOffers.properties.penthouse.title'),
    price: "200,000 $",
      location: t('topOffers.properties.penthouse.location'),
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=100",
    src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=100",
    content: null
  },
  {
    id: 4,
      category: t('topOffers.categories.commercial'),
      title: t('topOffers.properties.office.title'),
    price: "180,000 $",
      location: t('topOffers.properties.office.location'),
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=100",
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=100",
    content: null
  },
  {
    id: 5,
      category: t('topOffers.categories.apartments'),
      title: t('topOffers.properties.studio.title'),
    price: "120,000 $",
      location: t('topOffers.properties.studio.location'),
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1920&q=100",
    src: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1920&q=100",
    content: null
  },
  {
    id: 6,
      category: t('topOffers.categories.commercial'),
      title: t('topOffers.properties.retail.title'),
    price: "220,000 $",
      location: t('topOffers.properties.retail.location'),
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=100",
    src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=100",
    content: null
  }
];

// Оновлюємо контент для кожної властивості
properties.forEach((property, index) => {
  property.content = (
    <div className="flex flex-col h-full">
      <div className="relative h-[120px] md:h-[160px] w-full rounded-lg overflow-hidden">
        <Image
          src={property.image}
          alt={property.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col flex-1 justify-between gap-2 mt-2">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm md:text-base font-bold text-foreground">{property.title}</h3>
              <p className="text-xs text-muted-foreground">{property.location}</p>
            </div>
            <p className="text-sm md:text-base font-bold text-primary">{property.price}</p>
          </div>
          <div className="space-y-1.5">
              <h4 className="font-semibold text-xs text-foreground">{t('topOffers.description')}:</h4>
            <p className="text-xs text-muted-foreground line-clamp-3">
                {property.category === t('topOffers.categories.apartments') && t('topOffers.descriptions.apartment')}
                {property.category === t('topOffers.categories.houses') && t('topOffers.descriptions.house')}
                {property.category === t('topOffers.categories.commercial') && t('topOffers.descriptions.commercial')}
            </p>
          </div>
          <div className="space-y-1.5">
              <h4 className="font-semibold text-xs text-foreground">{t('topOffers.features')}:</h4>
            <ul className="text-xs flex flex-wrap gap-1">
              {property.category === t('topOffers.categories.apartments') && (
                <>
                  <li>• {t('topOffers.offerFeatures.apartments.bedrooms')}</li>
                  <li>• {t('topOffers.offerFeatures.apartments.bathroom')}</li>
                  <li>• {t('topOffers.offerFeatures.apartments.area')}</li>
                  <li>• {t('topOffers.offerFeatures.apartments.floor')}</li>
                </>
              )}
              {property.category === t('topOffers.categories.houses') && (
                <>
                  <li>• {t('topOffers.offerFeatures.houses.bedrooms')}</li>
                  <li>• {t('topOffers.offerFeatures.houses.bathrooms')}</li>
                  <li>• {t('topOffers.offerFeatures.houses.area')}</li>
                  <li>• {t('topOffers.offerFeatures.houses.land')}</li>
                </>
              )}
              {property.category === t('topOffers.categories.commercial') && (
                <>
                  <li>• {t('topOffers.offerFeatures.commercial.area')}</li>
                  <li>• {t('topOffers.offerFeatures.commercial.floor')}</li>
                  <li>• {t('topOffers.offerFeatures.commercial.windows')}</li>
                  <li>• {t('topOffers.offerFeatures.commercial.parking')}</li>
                </>
              )}
            </ul>
          </div>
        </div>
        <button className="w-full py-1.5 text-xs font-medium text-white rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 transition-colors">
            {t('topOffers.learnMore')}
        </button>
      </div>
    </div>
  );
});

  const cards = properties.map((property, index) => (
    <Card
      key={property.id}
      card={{
        category: property.category,
        title: property.title,
        src: property.image,
        content: property.content
      }}
      index={index}
    />
  ));

  return (
    <section id="top-offers" className="min-h-screen flex flex-col justify-center relative py-12">
      <div className="absolute inset-0 bg-background/50 backdrop-blur-sm" />
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-foreground">{t('topOffers.title')}</h2>
        <div className="w-full">
          <Carousel items={cards} />
        </div>
      </div>
    </section>
  );
} 