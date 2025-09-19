import DefaultLayout from "@/layouts/default";
import { ImagesSliderDemo } from "@/components/home/images-slider-demo";
import { TopOffers } from "@/components/home/top-offers";
import { WhyUs } from "@/components/home/why-us";
import { FAQ } from "@/components/home/faq";
import Head from "next/head";

export default function IndexPage() {
  return (
    <>
      <Head>
        <title>Агентство нерухомості "Ваш Ковчег" в Чернівцях | Купівля, продаж, оренда нерухомості</title>
        <meta name="description" content="Агентство нерухомості 'Ваш Ковчег' в Чернівцях з 2004 року. Купівля, продаж, оренда квартир, будинків, земельних ділянок. 20 років досвіду, 1000+ клієнтів, 500+ угод." />
        <meta name="keywords" content="агентство нерухомості Чернівці, купівля квартир Чернівці, продаж будинків Чернівці, оренда нерухомості Чернівці, земельні ділянки Чернівці, новобудови Чернівці, комерційна нерухомість, іпотека Чернівці" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Агентство нерухомості 'Ваш Ковчег' в Чернівцях" />
        <meta property="og:description" content="20 років досвіду на ринку нерухомості Чернівців. Професійні послуги з купівлі, продажу та оренди нерухомості." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kovcheg.com.ua" />
        <meta property="og:image" content="https://kovcheg.com.ua/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Агентство нерухомості 'Ваш Ковчег' в Чернівцях" />
        <meta name="twitter:description" content="20 років досвіду на ринку нерухомості Чернівців. Професійні послуги з купівлі, продажу та оренди нерухомості." />
        <link rel="canonical" href="https://kovcheg.com.ua" />
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
      <div>
        <section className="h-screen">
          <ImagesSliderDemo />
        </section>
        <main className="-mt-1">
          <TopOffers />
          <WhyUs />
          <FAQ />
        </main>
      </div>
      </DefaultLayout>
    </>
  );
}
