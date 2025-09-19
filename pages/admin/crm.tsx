import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  IconHome,
  IconDatabase,
  IconUsers,
  IconCurrencyDollar,
  IconMessages,
  IconChartBar,
  IconCalendar,
  IconBriefcase,
  IconFiles,
  IconArrowRight,
  IconLogout,
} from "@tabler/icons-react";

import { AuthGuard } from "@/components/auth/auth-guard";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/hooks/useAuth";

const CrmPage = () => {
  const { t } = useTranslation();
  const { admin, logout } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const pageTitle = isMounted
    ? `${t("crm.title")} | ${t("common.companyName")}`
    : "CRM";

  const handleLogout = async () => {
    await logout();
  };

  // Конфігурація модулів CRM
  const crmModules = [
    {
      title: "Нерухомість",
      description: "Управління об'єктами нерухомості та оголошеннями",
      icon: IconHome,
      href: "/admin/properties",
      color: "bg-blue-500 hover:bg-blue-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "База даних",
      description: "Спарсені оголошення та аналіз ринку",
      icon: IconDatabase,
      href: "/admin/database",
      color: "bg-green-500 hover:bg-green-600",
      textColor: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Клієнти",
      description: "Управління клієнтами та контактами",
      icon: IconUsers,
      href: "/admin/clients",
      color: "bg-purple-500 hover:bg-purple-600",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      title: "Угоди",
      description: "Відстеження угод та продажів",
      icon: IconCurrencyDollar,
      href: "/admin/deals",
      color: "bg-orange-500 hover:bg-orange-600",
      textColor: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      title: "Комунікації",
      description: "Повідомлення та чати з клієнтами",
      icon: IconMessages,
      href: "/admin/communications",
      color: "bg-pink-500 hover:bg-pink-600",
      textColor: "text-pink-600",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
    },
    {
      title: "Аналітика",
      description: "Звіти та статистика продажів",
      icon: IconChartBar,
      href: "/admin/analytics",
      color: "bg-indigo-500 hover:bg-indigo-600",
      textColor: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    },
    {
      title: "Календар",
      description: "Планування зустрічей та подій",
      icon: IconCalendar,
      href: "/admin/calendar",
      color: "bg-teal-500 hover:bg-teal-600",
      textColor: "text-teal-600",
      bgColor: "bg-teal-50 dark:bg-teal-900/20",
    },
    {
      title: "Маркетинг",
      description: "Кампанії та просування оголошень",
      icon: IconBriefcase,
      href: "/admin/marketing",
      color: "bg-cyan-500 hover:bg-cyan-600",
      textColor: "text-cyan-600",
      bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
    },
    {
      title: "Документи",
      description: "Управління файлами та документами",
      icon: IconFiles,
      href: "/admin/documents",
      color: "bg-gray-500 hover:bg-gray-600",
      textColor: "text-gray-600",
      bgColor: "bg-gray-50 dark:bg-gray-900/20",
    },
  ];

  return (
    <AuthGuard>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="CRM система для управління нерухомістю" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 space-y-4 sm:space-y-0">
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  CRM Система
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
                  Вітаємо, {admin?.first_name} {admin?.last_name}
                </p>
              </div>
              <div className="flex items-center justify-center sm:justify-end space-x-2 sm:space-x-4">
                <button
                  onClick={() => router.push('/admin')}
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <span className="hidden sm:inline">Головна</span>
                  <span className="sm:hidden">Меню</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-100 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                  title="Вихід з системи"
                >
                  <IconLogout className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">Вихід</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-4 sm:p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <IconHome className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <div className="ml-3 sm:ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Активні об'єкти
                      </dt>
                      <dd className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                        --
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-4 sm:p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <IconUsers className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                  <div className="ml-3 sm:ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Клієнти
                      </dt>
                      <dd className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                        --
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg lg:col-span-1 sm:col-span-2">
              <div className="p-4 sm:p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <IconCurrencyDollar className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                  </div>
                  <div className="ml-3 sm:ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Активні угоди
                      </dt>
                      <dd className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                        --
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CRM Modules Grid */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Модулі CRM
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {crmModules.map((module) => {
                const IconComponent = module.icon;
                return (
                  <Link
                    key={module.href}
                    href={module.href}
                    className="group block"
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-md transition-all duration-200 group-hover:border-gray-300 dark:group-hover:border-gray-600">
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className={`p-2 sm:p-3 rounded-lg ${module.bgColor}`}>
                          <IconComponent className={`h-5 w-5 sm:h-6 sm:w-6 ${module.textColor}`} />
                        </div>
                        <IconArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {module.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                        {module.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Швидкі дії
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Link
                href="/admin/properties"
                className="flex flex-col sm:flex-row items-center p-2 sm:p-3 text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
              >
                <IconHome className="h-4 w-4 sm:h-5 sm:w-5 mb-1 sm:mb-0 sm:mr-2" />
                <span className="text-xs sm:text-sm font-medium text-center sm:text-left">Додати об'єкт</span>
              </Link>
              
              <Link
                href="/admin/clients"
                className="flex flex-col sm:flex-row items-center p-2 sm:p-3 text-green-600 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
              >
                <IconUsers className="h-4 w-4 sm:h-5 sm:w-5 mb-1 sm:mb-0 sm:mr-2" />
                <span className="text-xs sm:text-sm font-medium text-center sm:text-left">Новий клієнт</span>
              </Link>
              
              <Link
                href="/admin/deals"
                className="flex flex-col sm:flex-row items-center p-2 sm:p-3 text-orange-600 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors"
              >
                <IconCurrencyDollar className="h-4 w-4 sm:h-5 sm:w-5 mb-1 sm:mb-0 sm:mr-2" />
                <span className="text-xs sm:text-sm font-medium text-center sm:text-left">Створити угоду</span>
              </Link>
              
              <Link
                href="/admin/analytics"
                className="flex flex-col sm:flex-row items-center p-2 sm:p-3 text-purple-600 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
              >
                <IconChartBar className="h-4 w-4 sm:h-5 sm:w-5 mb-1 sm:mb-0 sm:mr-2" />
                <span className="text-xs sm:text-sm font-medium text-center sm:text-left">Переглянути звіти</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default CrmPage;
