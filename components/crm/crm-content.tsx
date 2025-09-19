"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useCrmSection } from "./section-provider";
import { AnalyticsSection } from "./sections/analytics-section";
import { CalendarSection } from "./sections/calendar-section";
import { DealsSection } from "./sections/deals-section";
import { ClientsSection } from "./sections/clients-section";
import { PropertiesSection } from "./sections/properties-section";
import { CommunicationsSection } from "./sections/communications-section";
import { DocumentsSection } from "./sections/documents-section";
import { MarketingSection } from "./sections/marketing-section";
import { DatabaseSection } from "./sections/database-section";

import { useTranslation } from "@/hooks/useTranslation";

export function CrmContent() {
  const { activeSection } = useCrmSection();
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  // Монтування компонента
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Відображення вмісту в залежності від активної секції
  const renderContent = () => {
    switch (activeSection) {
      case "analytics":
        return <AnalyticsSection />;
      case "calendar":
        return <CalendarSection />;
      case "deals":
        return <DealsSection />;
      case "clients":
        return <ClientsSection />;
      case "properties":
        return <PropertiesSection />;
      case "communications":
        return <CommunicationsSection />;
      case "documents":
        return <DocumentsSection />;
      case "marketing":
        return <MarketingSection />;
      case "database":
        return <DatabaseSection />;
      default:
        // Для всіх інших секцій, які ще не реалізовані, показуємо заглушку
        return (
          <div className="flex h-64 w-full items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">
                {t("crm.sections." + activeSection + ".title")}
              </h2>
              <p className="text-muted-foreground">
                {t("crm.sections.comingSoon")}
              </p>
            </div>
          </div>
        );
    }
  };

  // Показуємо заглушку до монтування компонента
  if (!isMounted) {
    return <div className="container mx-auto max-w-screen-lg px-4 py-6 h-64" />;
  }

  return (
    <div className="container mx-auto max-w-screen-lg px-4 py-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
