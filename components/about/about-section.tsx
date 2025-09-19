"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody, Button } from "@heroui/react";
import { useTranslation } from "@/hooks/useTranslation";
import { useRouter } from "next/router";
// Використовуємо прості SVG іконки замість Tabler Icons

function AboutSection() {
  const { t } = useTranslation();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("company");

  // Обробка URL параметрів
  useEffect(() => {
    if (router.query.section) {
      setActiveSection(router.query.section as string);
    }
  }, [router.query.section]);

  const sections = [
    { key: "company", label: t("about.sections.company.title"), icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
    { key: "news", label: t("about.sections.news.title"), icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg> },
    { key: "contacts", label: t("about.sections.contacts.title"), icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg> },
    { key: "careers", label: t("about.sections.careers.title"), icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> }
  ];

  const values = [
    {
      icon: <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
      title: t("about.values.trust.title"),
      description: t("about.values.trust.description")
    },
    {
      icon: <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
      title: t("about.values.excellence.title"),
      description: t("about.values.excellence.description")
    },
    {
      icon: <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
      title: t("about.values.partnership.title"),
      description: t("about.values.partnership.description")
    },
    {
      icon: <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
      title: t("about.values.innovation.title"),
      description: t("about.values.innovation.description")
    }
  ];

  const renderCompanySection = () => (
    <div className="space-y-12">
      {/* Company Story */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            {t("about.company.story.title")}
          </h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
            <p>{t("about.company.story.paragraph1")}</p>
            <p>{t("about.company.story.paragraph2")}</p>
            <p>{t("about.company.story.paragraph3")}</p>
          </div>
        </div>
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop&crop=center"
            alt="Офіс компанії"
            className="rounded-2xl shadow-2xl"
          />
          <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6 rounded-xl shadow-lg">
            <div className="text-2xl font-bold">15+</div>
            <div className="text-sm">років досвіду</div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardBody className="p-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t("about.company.mission.title")}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {t("about.company.mission.description")}
            </p>
          </CardBody>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardBody className="p-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t("about.company.vision.title")}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {t("about.company.vision.description")}
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Values */}
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          {t("about.values.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardBody className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {value.description}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNewsSection = () => (
    <div className="space-y-8">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
        {t("about.news.title")}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop",
            title: "Нові можливості для інвесторів",
            date: "15 грудня 2024",
            excerpt: "Ринок нерухомості Чернівців показує стабільне зростання..."
          },
          {
            image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop",
            title: "Іпотечні програми для молоді",
            date: "10 грудня 2024",
            excerpt: "Спеціальні умови кредитування для молодих сімей..."
          },
          {
            image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop",
            title: "Цифрові технології в нерухомості",
            date: "5 грудня 2024",
            excerpt: "Впровадження нових технологій для зручності клієнтів..."
          }
        ].map((news, index) => (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="relative overflow-hidden">
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white px-3 py-1 rounded-full text-sm">
                {news.date}
              </div>
            </div>
            <CardBody className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                {news.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                {news.excerpt}
              </p>
              <Button className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white">
                Читати далі
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderContactsSection = () => (
    <div className="space-y-12">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
        {t("about.contacts.title")}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardBody className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Телефон</h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium">+380 50 150 55 55</p>
                <p className="text-blue-600 dark:text-blue-400 font-medium">+380 68 850 55 55</p>
              </CardBody>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardBody className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Email</h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium">kovcheg@gmail.com</p>
              </CardBody>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardBody className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Адреса</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">вул. Небесної сотні 8, Чернівці 58005</p>
              </CardBody>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardBody className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Години роботи</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Пн-Пт: 9:00-18:00</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Сб: 10:00-16:00</p>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Map */}
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=600&h=400&fit=crop"
            alt="Карта офісу"
            className="w-full h-96 object-cover rounded-2xl shadow-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="text-xl font-bold mb-2">Наш офіс</h3>
            <p className="text-sm">Центр Чернівців, зручне розташування</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCareersSection = () => (
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          {t("about.careers.title")}
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          {t("about.careers.subtitle")}
        </p>
      </div>

      {/* Why Join Us */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
            title: "Професійний ріст",
            description: "Можливості для розвитку та кар'єрного росту"
          },
          {
            icon: <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
            title: "Команда експертів",
            description: "Робота з досвідченими професіоналами"
          },
          {
            icon: <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
            title: "Корпоративна культура",
            description: "Дружня атмосфера та підтримка колег"
          }
        ].map((benefit, index) => (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardBody className="p-6 text-center">
              <div className="flex justify-center mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Open Positions */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Відкриті вакансії
        </h3>
        <div className="space-y-4">
          {[
            { title: "Агент з нерухомості", location: "Чернівці", type: "Повний день" },
            { title: "Консультант з іпотеки", location: "Чернівці", type: "Повний день" },
            { title: "Менеджер з продажів", location: "Чернівці", type: "Повний день" }
          ].map((position, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardBody className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {position.title}
                    </h4>
                    <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-300">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {position.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {position.type}
                      </span>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white">
                    Подати заявку
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "company":
        return renderCompanySection();
      case "news":
        return renderNewsSection();
      case "contacts":
        return renderContactsSection();
      case "careers":
        return renderCareersSection();
      default:
        return renderCompanySection();
    }
  };

  return (
    <div className="space-y-8">
      {/* Section Navigation */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {sections.map((section) => (
          <Button
            key={section.key}
            variant={activeSection === section.key ? "solid" : "bordered"}
            className={`flex items-center gap-2 ${
              activeSection === section.key
                ? "bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white"
                : "border-blue-300 text-blue-600 hover:bg-blue-50"
            }`}
            onPress={() => setActiveSection(section.key)}
          >
            {section.icon}
            {section.label}
          </Button>
        ))}
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
}

export default AboutSection;
