"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Card, CardBody, Button, Input } from "@heroui/react";
import { useTranslation } from "@/hooks/useTranslation";
// Використовуємо прості SVG іконки замість Tabler Icons

interface Agent {
  id: number;
  name: string;
  position: string;
  experience: string;
  photo: string;
  bio: string;
  phone: string;
  email: string;
  rating: number;
  deals: number;
  specialties: string[];
}

export function AgentsSection() {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const agents: Agent[] = [
    {
      id: 1,
      name: "Сергій Босовик",
      position: "Власник агентства",
      experience: "30 років досвіду",
      photo: "/images/agents/BosovykSerhii.jpg",
      bio: "Досвідчений керівник агентства з 30-літнім досвідом. Керує складними угодами, консультує інвесторів, вирішує складні питання на ринку нерухомості та навчає молодих агентів.",
      phone: "+380501234567",
      email: "sergiy.bosovyk@kovcheg.com",
      rating: 5.0,
      deals: 500,
      specialties: ["Керівництво", "Інвестиційна нерухомість", "Складні угоди", "Консалтинг"]
    },
    {
      id: 2,
      name: "Микола Гунько",
      position: "Експерт з комерційної нерухомості",
      experience: "20 років досвіду",
      photo: "/images/agents/GunkoMykola.jpg",
      bio: "Провідний експерт з комерційної нерухомості. Має велику базу власників та покупців комерційної нерухомості. Допоміг десяткам бізнесів знайти ідеальні приміщення для розвитку.",
      phone: "+380501234568",
      email: "mykola.gunko@kovcheg.com",
      rating: 4.9,
      deals: 350,
      specialties: ["Комерційна нерухомість", "Бізнес-консультації", "Оренда офісів", "Торгові площі"]
    },
    {
      id: 3,
      name: "Наталія",
      position: "Експерт з нерухомості преміум-класу",
      experience: "12 років досвіду",
      photo: "/images/agents/Natalia.jpg",
      bio: "Пропоную комплексний супровід угод із купівлі, продажу та оренди житла бізнес- і еліт-категорії. Кожен клієнт отримує індивідуальну стратегію, конфіденційність та сервіс найвищого рівня. Працюю по м. Чернівці. Консультація безкоштовно. Прозорість, довіра та професіоналізм — мій підхід до кожного клієнта.",
      phone: "+380501234569",
      email: "natalia@kovcheg.com",
      rating: 4.9,
      deals: 180,
      specialties: ["Преміум нерухомість", "Еліт-житло", "VIP сервіс", "Конфіденційність"]
    },
    {
      id: 4,
      name: "Володимир Шуть",
      position: "Універсальний агент з нерухомості",
      experience: "8 років досвіду",
      photo: "/images/agents/ShutVolodymyr.jpg",
      bio: "Надаю послуги з продажу, купівлі та оренди нерухомості. Працюю в команді професіоналів. Індивідуальний підхід до кожного клієнта та швидке вирішення будь-яких питань на ринку нерухомості.",
      phone: "+380501234570",
      email: "volodymyr.shut@kovcheg.com",
      rating: 4.8,
      deals: 145,
      specialties: ["Купівля-продаж", "Оренда", "Житлова нерухомість", "Консультації"]
    },
    {
      id: 5,
      name: "Ніна Богданова",
      position: "Експерт з житлової нерухомості",
      experience: "28 років досвіду",
      photo: "/images/agents/BogdanovaNina.jpg",
      bio: "Експерт з житлової нерухомості, земельних ділянок та дач. 28 років досвіду на ринку нерухомості Чернівців. Глибоке знання ринку та індивідуальний підхід до кожного клієнта.",
      phone: "+380501234571",
      email: "nina.bogdanova@kovcheg.com",
      rating: 4.9,
      deals: 420,
      specialties: ["Житлова нерухомість", "Земельні ділянки", "Дачі", "Заміська нерухомість"]
    },
    {
      id: 6,
      name: "Ольга Леоненко",
      position: "Спеціаліст з архітектури та будівництва",
      experience: "10 років досвіду",
      photo: "/images/agents/LeonenkoOlga.jpg",
      bio: "Спеціаліст з архітектури, будівництва та продажу нерухомості. Унікальна експертиза дозволяє оцінити технічний стан об'єкта та надати професійні рекомендації щодо реконструкції та модернізації.",
      phone: "+380501234572",
      email: "olga.leonenko@kovcheg.com",
      rating: 4.8,
      deals: 125,
      specialties: ["Архітектура", "Будівництво", "Технічна експертиза", "Новобудови"]
    },
    {
      id: 7,
      name: "Валентина Білоткач",
      position: "Спеціаліст з нерухомості",
      experience: "7 років досвіду",
      photo: "/images/agents/ValentynaBilotkach.jpg",
      bio: "Допомагаю швидко та вигідно продати або придбати житло. Моя мета — зробити процес угоди комфортним, безпечним і результативним для кожного клієнта. Професійний супровід на всіх етапах угоди.",
      phone: "+380501234573",
      email: "valentyna.bilotkach@kovcheg.com",
      rating: 4.8,
      deals: 98,
      specialties: ["Купівля-продаж", "Супровід угод", "Житлова нерухомість", "Документообіг"]
    }
  ];

  // Обробка URL параметрів
  useEffect(() => {
    if (router.query.section) {
      const section = router.query.section as string;
      // Тут можна додати логіку для різних секцій
      console.log("Active section:", section);
    }
  }, [router.query.section]);

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.specialties.some(specialty => 
      specialty.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleContactAgent = (agent: Agent) => {
    // Тут буде логіка для зв'язку з агентом
    console.log(`Contacting agent: ${agent.name}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {t("agents.ourTeam.title")}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          {t("agents.ourTeam.subtitle")}
        </p>
        
        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <Input
            placeholder={t("agents.search.placeholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startContent={<svg className="h-4 w-4 text-default-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
            className="w-full"
          />
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAgents.map((agent) => (
          <Card 
            key={agent.id} 
            className="border-0 shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <CardBody className="p-6">
              {/* Photo */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <img
                    src={agent.photo}
                    alt={agent.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-blue-100 dark:border-blue-900"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white fill-current" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  </div>
                </div>
              </div>

              {/* Name & Position */}
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {agent.name}
                </h3>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
                  {agent.position}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {agent.experience}
                </p>
              </div>

              {/* Bio */}
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center leading-relaxed">
                {agent.bio}
              </p>

              {/* Stats */}
              <div className="flex justify-between items-center mb-4 text-xs">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-yellow-400 fill-current" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  <span className="text-gray-600 dark:text-gray-300">{agent.rating}</span>
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {agent.deals} угод
                </div>
              </div>

              {/* Specialties */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1 justify-center">
                  {agent.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Button */}
              <Button
                onClick={() => handleContactAgent(agent)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {t("agents.contact")}
              </Button>

              {/* Contact Info */}
              <div className="mt-3 space-y-1">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  <span>{agent.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <span>{agent.email}</span>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredAgents.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-600 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <h3 className="text-xl font-semibold mb-2">
              {t("agents.search.noResults")}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {t("agents.search.tryDifferent")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
