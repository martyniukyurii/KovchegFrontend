"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconChartLine,
  IconCalendar,
  IconBuildingStore,
  IconUsers,
  IconBuilding,
  IconMessages,
  IconFileDescription,
  IconBrandShopee,
  IconMoon,
  IconSun,
  IconLanguage,
  IconLogout,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import { useTheme } from "next-themes";

import { CrmSectionType, useCrmSection } from "./section-provider";

import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/hooks/useAuth";

export function CrmNavigation() {
  const { activeSection, setActiveSection } = useCrmSection();
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { t, locale, changeLocale } = useTranslation();
  const { admin, logout } = useAuth();

  // Ефект для відстеження монтування компонента
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Ефект для відстеження скролу
  useEffect(() => {
    if (!isMounted) return;

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMounted]);

  // Закриття меню профілю при кліку поза ним
  useEffect(() => {
    if (!isMounted) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        showProfileMenu &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileMenu, isMounted]);

  // Перший рядок мобільної навігації
  const firstRowItems = [
    {
      id: "calendar",
      label: t("crm.nav.calendar"),
      icon: <IconCalendar className="h-5 w-5" />,
    },
    {
      id: "deals",
      label: t("crm.nav.journal"),
      icon: <IconFileDescription className="h-5 w-5" />,
    },
    {
      id: "communications",
      label: t("crm.nav.communications"),
      icon: <IconMessages className="h-5 w-5" />,
    },
    {
      id: "documents",
      label: t("crm.nav.documents"),
      icon: <IconFileDescription className="h-5 w-5" />,
    },
    {
      id: "marketing",
      label: t("crm.nav.marketing"),
      icon: <IconBrandShopee className="h-5 w-5" />,
    },
  ];

  // Другий рядок мобільної навігації - клієнти, нерухомість, аналітика
  const secondRowItems = [
    {
      id: "clients",
      label: t("crm.nav.clients"),
      icon: <IconUsers className="h-5 w-5" />,
    },
    {
      id: "properties",
      label: t("crm.nav.properties"),
      icon: <IconBuilding className="h-5 w-5" />,
    },
    {
      id: "database",
      label: t("crm.nav.database"),
      icon: <IconBuildingStore className="h-5 w-5" />,
    },
    {
      id: "analytics",
      label: t("crm.nav.analytics"),
      icon: <IconChartLine className="h-5 w-5" />,
    },
  ];

  // Всі елементи для десктопу
  const allNavItems = [...firstRowItems, ...secondRowItems];

  const handleSectionChange = (section: CrmSectionType) => {
    setActiveSection(section);
    if (isMounted && typeof window !== "undefined") {
      window.location.hash = section;
    }
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const toggleLanguage = () => {
    const nextLang = locale === "uk" ? "en" : locale === "en" ? "ru" : "uk";

    changeLocale(nextLang as any);
  };

  // Показуємо заглушку, доки компонент не змонтований
  if (!isMounted) {
    return <div className="h-16 w-full" />;
  }

  return (
    <motion.div
      ref={navRef}
      className={`sticky top-0 z-40 w-full px-4 py-2 transition-all duration-300
        ${isScrolled ? "shadow-md backdrop-blur-md" : ""}
        ${resolvedTheme === "dark" ? "bg-neutral-900/80" : "bg-white/80"}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
    >
      <div className="w-full">
        {/* Десктопна навігація */}
        <div className="hidden md:flex justify-between items-center">
          <div className="flex-1 flex items-center gap-3 overflow-x-auto no-scrollbar">
            {allNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id as CrmSectionType)}
                className={`group relative flex min-w-fit items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all
                  ${
                    activeSection === item.id
                      ? resolvedTheme === "dark"
                        ? "bg-blue-500 text-white"
                        : "bg-blue-100 text-blue-800"
                      : resolvedTheme === "dark"
                        ? "hover:bg-neutral-800 text-white/80"
                        : "hover:bg-gray-100 text-gray-700"
                  }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {activeSection === item.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 mx-auto h-0.5 w-10 bg-current"
                    layoutId="crm-nav-underline-desktop"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
              </button>
            ))}
          </div>
          <div className="relative ml-4">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="h-9 w-9 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
            >
              <IconUser className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Мобільна навігація */}
        <div className="md:hidden">
          <div className="flex justify-between items-center mb-2">
            {/* Перший рядок - основні розділи */}
            <div className="flex-1 flex items-center gap-1 overflow-x-auto no-scrollbar">
              {firstRowItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSectionChange(item.id as CrmSectionType)}
                  className={`group relative flex min-w-fit items-center gap-1 rounded px-1.5 py-1 text-xs font-medium transition-all
                    ${
                      activeSection === item.id
                        ? resolvedTheme === "dark"
                          ? "bg-blue-500 text-white"
                          : "bg-blue-100 text-blue-800"
                        : resolvedTheme === "dark"
                          ? "hover:bg-neutral-800 text-white/80"
                          : "hover:bg-gray-100 text-gray-700"
                    }`}
                >
                  <div className="h-4 w-4">{item.icon}</div>
                  <span className="hidden text-xs">{item.label}</span>
                  {activeSection === item.id && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 mx-auto h-0.5 w-8 bg-current"
                      layoutId="crm-nav-underline-mobile-top"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
            <div className="relative ml-1">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
              >
                <IconUser className="h-3 w-3" />
              </button>
            </div>
          </div>
          
          {/* Другий рядок - клієнти, нерухомість, аналітика */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {secondRowItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id as CrmSectionType)}
                className={`group relative flex min-w-fit items-center gap-1 rounded px-1.5 py-1 text-xs font-medium transition-all
                  ${
                    activeSection === item.id
                      ? resolvedTheme === "dark"
                        ? "bg-blue-500 text-white"
                        : "bg-blue-100 text-blue-800"
                      : resolvedTheme === "dark"
                        ? "hover:bg-neutral-800 text-white/80"
                        : "hover:bg-gray-100 text-gray-700"
                  }`}
              >
                <div className="h-4 w-4">{item.icon}</div>
                <span className="hidden text-xs">{item.label}</span>
                {activeSection === item.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 mx-auto h-0.5 w-8 bg-current"
                    layoutId="crm-nav-underline-mobile-bottom"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Профільне меню (тільки для десктопу, на мобільних вже є в основних блоках) */}
        <AnimatePresence>
          {showProfileMenu && (
            <motion.div
              ref={profileMenuRef}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className={`absolute right-0 top-full mt-2 w-56 rounded-lg border shadow-lg z-50
                ${resolvedTheme === "dark" ? "bg-neutral-800 border-neutral-700" : "bg-white border-gray-200"}
                overflow-hidden`}
              style={{ transformOrigin: "top right" }}
            >
              <div className="p-3 border-b border-gray-200 dark:border-neutral-700">
                <p className="text-sm font-medium">
                  {admin ? `${admin.first_name} ${admin.last_name}` : 'Адміністратор Ковчег'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {admin?.email || 'admin@kovcheg.ua'}
                </p>
                {admin?.role && (
                  <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                    {admin.role}
                  </p>
                )}
              </div>

              <div className="p-2">
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center gap-2 rounded-md p-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                >
                  {resolvedTheme === "dark" ? (
                    <IconSun className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <IconMoon className="h-5 w-5 text-blue-500" />
                  )}
                  {resolvedTheme === "dark"
                    ? t("profile.lightTheme")
                    : t("profile.darkTheme")}
                </button>

                <button
                  onClick={toggleLanguage}
                  className="w-full flex items-center gap-2 rounded-md p-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                >
                  <IconLanguage className="h-5 w-5 text-green-500" />
                  {locale === "uk"
                    ? "English"
                    : locale === "en"
                      ? "Русский"
                      : "Українська"}
                </button>

                <button className="w-full flex items-center gap-2 rounded-md p-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors">
                  <IconUser className="h-5 w-5 text-blue-500" />
                  {t("profile.myProfile")}
                </button>

                <button className="w-full flex items-center gap-2 rounded-md p-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors">
                  <IconSettings className="h-5 w-5 text-gray-500" />
                  {t("profile.settings")}
                </button>
              </div>

              <div className="border-t border-gray-200 dark:border-neutral-700 p-2">
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-2 rounded-md p-2 text-sm text-left text-red-500 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                >
                  <IconLogout className="h-5 w-5" />
                  {t("profile.logout")}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
