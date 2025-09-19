"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  IconPlus,
  IconFilter,
  IconSearch,
  IconEye,
  IconEdit,
  IconTrash,
  IconClock,
  IconUser,
  IconHome,
  IconCurrencyDollar,
  IconCalendar,
  IconAlertCircle,
  IconChevronLeft,
  IconChevronRight,
  IconChartBar,
  IconClipboard,
  IconLoader,
  IconX,
} from "@tabler/icons-react";

import { useTranslation } from "@/hooks/useTranslation";
import { useDeals, useActivityJournal } from "@/hooks/useDeals";
import { Deal, UpdateDealRequest } from "@/lib/api-client";

// Типи та статуси угод (використовуємо з API)
type DealType = "sale" | "rent" | "purchase";
type DealStatus = "active" | "pending" | "completed" | "cancelled" | "on_hold";
type DealPriority = "high" | "medium" | "low";

// Адаптер для відображення Deal з API
interface DealDisplay {
  id: string;
  title: string;
  type: DealType;
  status: DealStatus;
  priority: DealPriority;
  client: string;
  property: string;
  value: number;
  createdAt: Date;
  updatedAt: Date;
  closingDate?: Date;
  responsibleAgent: string;
  description?: string;
  currency: string;
}

// Функція для конвертації Deal з API в DealDisplay
const dealToDisplay = (deal: Deal): DealDisplay => {
  return {
    id: deal.id,
    title: deal.title,
    type: deal.deal_type,
    status: deal.status,
    priority: deal.priority,
    client: deal.client_id || 'Невідомий клієнт',
    property: deal.property_id || 'Невідома нерухомість',
    value: deal.value,
    createdAt: new Date(deal.created_at),
    updatedAt: new Date(deal.updated_at),
    closingDate: deal.actual_close_date ? new Date(deal.actual_close_date) : 
                  deal.expected_close_date ? new Date(deal.expected_close_date) : undefined,
    responsibleAgent: deal.responsible_agent || 'Не призначено',
    description: deal.description,
    currency: deal.currency,
  };
};

const statusLabels: Record<DealStatus, string> = {
  active: "Активна",
  pending: "Очікування",
  completed: "Завершена",
  cancelled: "Скасована",
  on_hold: "Призупинена",
};

const typeLabels: Record<DealType, string> = {
  sale: "Продаж",
  rent: "Оренда",
  purchase: "Купівля",
};

const priorityLabels: Record<DealPriority, string> = {
  high: "Висока",
  medium: "Середня",
  low: "Низька",
};

const statusColors: Record<DealStatus, string> = {
  active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  on_hold: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
};

const priorityColors: Record<DealPriority, string> = {
  high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
};

export function DealsSection() {
  const { t } = useTranslation();
  const { 
    deals: apiDeals, 
    loading, 
    error, 
    fetchDeals, 
    updateDeal, 
    deleteDeal,
    totalDeals,
    totalPages,
    currentPage 
  } = useDeals();
  
  const { 
    entries: activityEntries, 
    fetchActivityJournal,
    createActivityEntry 
  } = useActivityJournal();
  
  const [isMounted, setIsMounted] = useState(false);
  const [deals, setDeals] = useState<DealDisplay[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<DealDisplay[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<DealStatus | "all">("all");
  const [filterType, setFilterType] = useState<DealType | "all">("all");
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showActivityJournal, setShowActivityJournal] = useState(false);
  const [sortBy, setSortBy] = useState<
    "createdAt" | "value" | "updatedAt" | "closingDate"
  >("updatedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Ефект для конвертації угод з API
  useEffect(() => {
    const convertedDeals = apiDeals.map(dealToDisplay);
    setDeals(convertedDeals);
  }, [apiDeals]);

  // Ефект для монтування компонента
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Ефект для фільтрації та сортування угод
  useEffect(() => {
    let result = [...deals];

    // Фільтрація за пошуковим терміном
    if (searchTerm) {
      result = result.filter(
        (deal) =>
          deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          deal.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
          deal.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
          deal.responsibleAgent.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Фільтрація за статусом
    if (filterStatus !== "all") {
      result = result.filter((deal) => deal.status === filterStatus);
    }

    // Фільтрація за типом
    if (filterType !== "all") {
      result = result.filter((deal) => deal.type === filterType);
    }

    // Сортування
    result.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case "createdAt":
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
        case "updatedAt":
          aValue = a.updatedAt.getTime();
          bValue = b.updatedAt.getTime();
          break;
        case "value":
          aValue = a.value;
          bValue = b.value;
          break;
        case "closingDate":
          aValue = a.closingDate?.getTime() || 0;
          bValue = b.closingDate?.getTime() || 0;
          break;
        default:
          aValue = a.updatedAt.getTime();
          bValue = b.updatedAt.getTime();
      }

      return sortDirection === "desc" ? bValue - aValue : aValue - bValue;
    });

    setFilteredDeals(result);
  }, [deals, searchTerm, filterStatus, filterType, sortBy, sortDirection]);

  // Функція для видалення угоди
  const handleDeleteDeal = async (dealId: string) => {
    if (window.confirm("Ви впевнені, що хочете видалити цю угоду?")) {
      const success = await deleteDeal(dealId);
      if (success) {
        setSelectedDeal(null);
      }
    }
  };

  // Функція для форматування валюти
  const formatCurrency = (amount: number, currency: string) => {
    const formatter = new Intl.NumberFormat('uk-UA', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    
    const symbols: Record<string, string> = {
      UAH: '₴',
      USD: '$',
      EUR: '€',
    };
    
    return `${formatter.format(amount)} ${symbols[currency] || currency}`;
  };

  // Функція для форматування дати
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  // Пагінація
  const handlePageChange = (page: number) => {
    fetchDeals({ page, limit: 10 });
  };

  if (!isMounted) {
    return null;
  }

  const getSelectedDealData = () => {
    return filteredDeals.find((deal) => deal.id === selectedDeal);
  };

  return (
    <div className="space-y-6">
      {/* Заголовок та статистика */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Угоди
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Управління угодами та журналом активності
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowActivityJournal(!showActivityJournal)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            <IconClipboard className="h-4 w-4" />
            Журнал активності
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <IconPlus className="h-4 w-4" />
            Нова угода
          </button>
        </div>
      </div>

      {/* Пошук та фільтри */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Пошук */}
          <div className="flex-1">
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Пошук угод..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Кнопка фільтрів */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <IconFilter className="h-4 w-4" />
            Фільтри
          </button>
        </div>

        {/* Панель фільтрів */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Статус</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as DealStatus | "all")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                >
                  <option value="all">Усі статуси</option>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Тип угоди</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as DealType | "all")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                >
                  <option value="all">Усі типи</option>
                  {Object.entries(typeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Сортування</label>
                <select
                  value={`${sortBy}-${sortDirection}`}
                  onChange={(e) => {
                    const [field, direction] = e.target.value.split('-');
                    setSortBy(field as any);
                    setSortDirection(direction as "asc" | "desc");
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                >
                  <option value="updatedAt-desc">Останні оновлення</option>
                  <option value="createdAt-desc">Нові спочатку</option>
                  <option value="value-desc">Сума: по спаданню</option>
                  <option value="value-asc">Сума: по зростанню</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Обробка завантаження та помилок */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <IconLoader className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Завантаження угод...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <IconAlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <span className="text-red-800 dark:text-red-200">{error}</span>
          </div>
        </div>
      )}

      {/* Основний контент */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Список угод */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium">
                Угоди ({filteredDeals.length})
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredDeals.length === 0 ? (
                <div className="p-8 text-center">
                  <IconHome className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Угод не знайдено</p>
                </div>
              ) : (
                filteredDeals.map((deal) => (
                  <div
                    key={deal.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                      selectedDeal === deal.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                    onClick={() => setSelectedDeal(deal.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {deal.title}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[deal.status]}`}>
                            {statusLabels[deal.status]}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[deal.priority]}`}>
                            {priorityLabels[deal.priority]}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <div className="flex items-center gap-1">
                            <IconUser className="h-4 w-4" />
                            <span>{deal.client}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <IconHome className="h-4 w-4" />
                            <span>{deal.property}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {formatCurrency(deal.value, deal.currency)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(deal.updatedAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Пагінація */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Показано {filteredDeals.length} з {totalDeals}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <IconChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="px-3 py-2 text-sm">
                      {currentPage} з {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <IconChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Деталі угоди */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            {selectedDeal ? (
              <DealDetails 
                deal={getSelectedDealData()!} 
                onEdit={() => {}}
                onDelete={() => handleDeleteDeal(selectedDeal)}
              />
            ) : (
              <div className="p-8 text-center">
                <IconEye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Виберіть угоду для перегляду деталей
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Журнал активності */}
      {showActivityJournal && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Журнал активності</h2>
              <button
                onClick={() => setShowActivityJournal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <IconX className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="p-4">
            <div className="text-center py-8">
              <IconChartBar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Журнал активності буде показаний тут
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Компонент деталей угоди
interface DealDetailsProps {
  deal: DealDisplay;
  onEdit: () => void;
  onDelete: () => void;
}

function DealDetails({ deal, onEdit, onDelete }: DealDetailsProps) {
  const formatCurrency = (amount: number, currency: string) => {
    const formatter = new Intl.NumberFormat('uk-UA', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    
    const symbols: Record<string, string> = {
      UAH: '₴',
      USD: '$',
      EUR: '€',
    };
    
    return `${formatter.format(amount)} ${symbols[currency] || currency}`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Деталі угоди</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <IconEdit className="h-4 w-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
            >
              <IconTrash className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
            {deal.title}
          </h4>
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[deal.status]}`}>
              {statusLabels[deal.status]}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[deal.priority]}`}>
              {priorityLabels[deal.priority]}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <IconCurrencyDollar className="h-4 w-4 text-gray-400" />
            <span className="font-medium">{formatCurrency(deal.value, deal.currency)}</span>
          </div>

          <div className="flex items-center gap-2">
            <IconUser className="h-4 w-4 text-gray-400" />
            <span>{deal.client}</span>
          </div>

          <div className="flex items-center gap-2">
            <IconHome className="h-4 w-4 text-gray-400" />
            <span>{deal.property}</span>
          </div>

          <div className="flex items-center gap-2">
            <IconUser className="h-4 w-4 text-gray-400" />
            <span>Агент: {deal.responsibleAgent}</span>
          </div>

          <div className="flex items-center gap-2">
            <IconCalendar className="h-4 w-4 text-gray-400" />
            <span>Створено: {formatDate(deal.createdAt)}</span>
          </div>

          <div className="flex items-center gap-2">
            <IconClock className="h-4 w-4 text-gray-400" />
            <span>Оновлено: {formatDate(deal.updatedAt)}</span>
          </div>

          {deal.closingDate && (
            <div className="flex items-center gap-2">
              <IconCalendar className="h-4 w-4 text-gray-400" />
              <span>Закриття: {formatDate(deal.closingDate)}</span>
            </div>
          )}
        </div>

        {deal.description && (
          <div>
            <h5 className="font-medium text-gray-900 dark:text-white mb-2">
              Опис
            </h5>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {deal.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}