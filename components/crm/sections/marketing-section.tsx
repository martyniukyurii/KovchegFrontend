"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  IconBrandFacebook,
  IconMail,
  IconSend,
  IconPlus,
  IconFilter,
  IconSearch,
  IconAd,
  IconTrash,
  IconPencil,
} from "@tabler/icons-react";

import { useTranslation } from "@/hooks/useTranslation";

// Типи для маркетингу
interface Campaign {
  id: string;
  name: string;
  status: "active" | "draft" | "completed" | "scheduled";
  type: "email" | "social" | "sms" | "ads";
  target: string;
  startDate: string;
  endDate: string;
  budget: string;
  performance: {
    reach: number;
    engagement: number;
    conversion: number;
  };
}

export function MarketingSection() {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "campaigns" | "audience" | "analytics"
  >("campaigns");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  // Дані для прикладу
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "1",
      name: "Промо нових квартир",
      status: "active",
      type: "email",
      target: "Потенційні покупці",
      startDate: "2023-06-01",
      endDate: "2023-06-30",
      budget: "5000 ₴",
      performance: {
        reach: 2500,
        engagement: 320,
        conversion: 48,
      },
    },
    {
      id: "2",
      name: "Реклама в соцмережах",
      status: "active",
      type: "social",
      target: "Широка аудиторія",
      startDate: "2023-06-15",
      endDate: "2023-07-15",
      budget: "12000 ₴",
      performance: {
        reach: 8500,
        engagement: 1250,
        conversion: 85,
      },
    },
    {
      id: "3",
      name: "SMS-розсилка клієнтам",
      status: "completed",
      type: "sms",
      target: "Існуючі клієнти",
      startDate: "2023-05-10",
      endDate: "2023-05-25",
      budget: "3000 ₴",
      performance: {
        reach: 1200,
        engagement: 320,
        conversion: 42,
      },
    },
    {
      id: "4",
      name: "Google Ads кампанія",
      status: "scheduled",
      type: "ads",
      target: "Пошукові запити",
      startDate: "2023-07-01",
      endDate: "2023-08-01",
      budget: "15000 ₴",
      performance: {
        reach: 0,
        engagement: 0,
        conversion: 0,
      },
    },
    {
      id: "5",
      name: "Спеціальна пропозиція",
      status: "draft",
      type: "email",
      target: "VIP клієнти",
      startDate: "",
      endDate: "",
      budget: "7000 ₴",
      performance: {
        reach: 0,
        engagement: 0,
        conversion: 0,
      },
    },
  ]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Закриття випадного меню при кліку поза ним
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(event.target as Node)
      ) {
        setIsFilterMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterMenuRef]);

  if (!isMounted) {
    return (
      <div className="h-96 w-full animate-pulse bg-gray-100 dark:bg-neutral-800 rounded-xl" />
    );
  }

  // Функції для роботи з кампаніями
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilter = (status: string | null) => {
    setStatusFilter(status);
  };

  // Фільтрація кампаній
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter
      ? campaign.status === statusFilter
      : true;

    return matchesSearch && matchesStatus;
  });

  // Отримання іконки за типом кампанії
  const getCampaignTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <IconMail className="h-5 w-5 text-blue-500" />;
      case "social":
        return <IconBrandFacebook className="h-5 w-5 text-indigo-500" />;
      case "sms":
        return <IconSend className="h-5 w-5 text-green-500" />;
      case "ads":
        return <IconAd className="h-5 w-5 text-orange-500" />;
      default:
        return <IconMail className="h-5 w-5 text-gray-500" />;
    }
  };

  // Відображення статусу кампанії
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            {t("crm.sections.marketing.statusActive")}
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            {t("crm.sections.marketing.statusDraft")}
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            {t("crm.sections.marketing.statusCompleted")}
          </span>
        );
      case "scheduled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            {t("crm.sections.marketing.statusScheduled")}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  // Вкладки для навігації
  const renderTabs = () => (
    <div className="mb-4 flex border-b border-gray-200 dark:border-neutral-700">
      <button
        onClick={() => setActiveTab("campaigns")}
        className={`py-2 px-4 text-sm font-medium border-b-2 -mb-px ${
          activeTab === "campaigns"
            ? "border-blue-500 text-blue-600 dark:text-blue-400"
            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
        }`}
      >
        {t("crm.sections.marketing.tabCampaigns")}
      </button>
      <button
        onClick={() => setActiveTab("audience")}
        className={`py-2 px-4 text-sm font-medium border-b-2 -mb-px ${
          activeTab === "audience"
            ? "border-blue-500 text-blue-600 dark:text-blue-400"
            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
        }`}
      >
        {t("crm.sections.marketing.tabAudience")}
      </button>
      <button
        onClick={() => setActiveTab("analytics")}
        className={`py-2 px-4 text-sm font-medium border-b-2 -mb-px ${
          activeTab === "analytics"
            ? "border-blue-500 text-blue-600 dark:text-blue-400"
            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
        }`}
      >
        {t("crm.sections.marketing.tabAnalytics")}
      </button>
    </div>
  );

  // Відображення вмісту кампаній
  const renderCampaigns = () => (
    <>
      {/* Верхній блок з пошуком та фільтрами */}
      <div className="mb-4 flex flex-wrap gap-3 items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-neutral-800">
        <div className="relative flex-grow max-w-md">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t("crm.sections.marketing.searchPlaceholder")}
            className="w-full rounded-md border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative" ref={filterMenuRef}>
            <button
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium flex items-center gap-1 dark:border-neutral-700 dark:bg-neutral-900"
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            >
              <IconFilter className="h-4 w-4" />
              {t("crm.sections.marketing.filterStatus")}
            </button>
            {isFilterMenuOpen && (
              <div className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 dark:bg-neutral-800 dark:ring-neutral-700">
                <div className="py-1">
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-neutral-700"
                    onClick={() => {
                      handleStatusFilter(null);
                      setIsFilterMenuOpen(false);
                    }}
                  >
                    {t("crm.sections.marketing.filterAll")}
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-neutral-700"
                    onClick={() => {
                      handleStatusFilter("active");
                      setIsFilterMenuOpen(false);
                    }}
                  >
                    {t("crm.sections.marketing.statusActive")}
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-neutral-700"
                    onClick={() => {
                      handleStatusFilter("draft");
                      setIsFilterMenuOpen(false);
                    }}
                  >
                    {t("crm.sections.marketing.statusDraft")}
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-neutral-700"
                    onClick={() => {
                      handleStatusFilter("scheduled");
                      setIsFilterMenuOpen(false);
                    }}
                  >
                    {t("crm.sections.marketing.statusScheduled")}
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-neutral-700"
                    onClick={() => {
                      handleStatusFilter("completed");
                      setIsFilterMenuOpen(false);
                    }}
                  >
                    {t("crm.sections.marketing.statusCompleted")}
                  </button>
                </div>
              </div>
            )}
          </div>
          <button className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors">
            <IconPlus className="mr-2 h-4 w-4 inline" />
            {t("crm.sections.marketing.newCampaign")}
          </button>
        </div>
      </div>

      {/* Таблиця кампаній */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-neutral-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
          <thead className="bg-gray-50 dark:bg-neutral-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                {t("crm.sections.marketing.campaign")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                {t("crm.sections.marketing.status")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                {t("crm.sections.marketing.type")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                {t("crm.sections.marketing.target")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                {t("crm.sections.marketing.dates")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                {t("crm.sections.marketing.budget")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                {t("crm.sections.marketing.performance")}
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                {t("crm.sections.marketing.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-neutral-700 dark:bg-neutral-900">
            {filteredCampaigns.length > 0 ? (
              filteredCampaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  className="hover:bg-gray-50 dark:hover:bg-neutral-800"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {campaign.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {getStatusBadge(campaign.status)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      {getCampaignTypeIcon(campaign.type)}
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        {campaign.type === "email"
                          ? "Email"
                          : campaign.type === "social"
                            ? "Соцмережі"
                            : campaign.type === "sms"
                              ? "SMS"
                              : campaign.type === "ads"
                                ? "Реклама"
                                : campaign.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {campaign.target}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {campaign.status === "draft" ? (
                      <span className="text-gray-400">—</span>
                    ) : (
                      <>
                        {campaign.startDate}
                        {campaign.endDate && <span> - {campaign.endDate}</span>}
                      </>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {campaign.budget}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {campaign.status === "active" ||
                    campaign.status === "completed" ? (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-24">
                            {t("crm.sections.marketing.reach")}:
                          </span>
                          <div className="ml-2 h-1.5 w-24 bg-gray-200 rounded-full dark:bg-gray-700">
                            <div
                              className="h-1.5 bg-blue-500 rounded-full"
                              style={{
                                width: `${Math.min(100, (campaign.performance.reach / 100) * 10)}%`,
                              }}
                            />
                          </div>
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                            {campaign.performance.reach}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-24">
                            {t("crm.sections.marketing.engagement")}:
                          </span>
                          <div className="ml-2 h-1.5 w-24 bg-gray-200 rounded-full dark:bg-gray-700">
                            <div
                              className="h-1.5 bg-green-500 rounded-full"
                              style={{
                                width: `${Math.min(100, (campaign.performance.engagement / 100) * 30)}%`,
                              }}
                            />
                          </div>
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                            {campaign.performance.engagement}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-24">
                            {t("crm.sections.marketing.conversion")}:
                          </span>
                          <div className="ml-2 h-1.5 w-24 bg-gray-200 rounded-full dark:bg-gray-700">
                            <div
                              className="h-1.5 bg-purple-500 rounded-full"
                              style={{
                                width: `${Math.min(100, (campaign.performance.conversion / 10) * 20)}%`,
                              }}
                            />
                          </div>
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                            {campaign.performance.conversion}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                        <IconPencil className="h-4 w-4" />
                      </button>
                      <button className="text-red-500 hover:text-red-700">
                        <IconTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  {t("crm.sections.marketing.noCampaigns")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );

  // Заглушка для неімплементованих вкладок
  const renderPlaceholder = (title: string) => (
    <div className="flex h-64 w-full items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-muted-foreground">{t("crm.comingSoon")}</p>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {t("crm.sections.marketing.title")}
        </h2>
      </div>

      {/* Вкладки */}
      {renderTabs()}

      {/* Вміст активної вкладки */}
      {activeTab === "campaigns" && renderCampaigns()}
      {activeTab === "audience" &&
        renderPlaceholder(t("crm.sections.marketing.tabAudience"))}
      {activeTab === "analytics" &&
        renderPlaceholder(t("crm.sections.marketing.tabAnalytics"))}
    </motion.div>
  );
}
