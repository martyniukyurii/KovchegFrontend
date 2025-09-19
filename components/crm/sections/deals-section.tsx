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
  IconFileText,
} from "@tabler/icons-react";

import { useTranslation } from "@/hooks/useTranslation";
import { useDeals, useActivityJournal } from "@/hooks/useDeals";
import { Deal, UpdateDealRequest } from "@/lib/api-client";
import DealFormModal from "@/components/crm/deal-form-modal";
import DealDetailsModal from "@/components/crm/deal-details-modal";
import { useUsers } from "@/hooks/useUsers";
import { useProperties } from "@/hooks/useProperties";

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

// Функція для конвертації Deal з API в DealDisplay (перемістимо всередину компонента)

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
    createDeal,
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

  // Додаткові хуки для відображення імен
  const { users, fetchUsers } = useUsers();
  const { properties, fetchProperties } = useProperties();
  
  const [isMounted, setIsMounted] = useState(false);
  const [deals, setDeals] = useState<DealDisplay[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<DealDisplay[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<DealStatus | "all">("all");
  const [filterType, setFilterType] = useState<DealType | "all">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showActivityJournal, setShowActivityJournal] = useState(false);
  const [sortBy, setSortBy] = useState<
    "createdAt" | "value" | "updatedAt" | "closingDate"
  >("updatedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [showDealModal, setShowDealModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  // Ефект для конвертації угод з API
  useEffect(() => {
    console.log('🔄 Конвертуємо угоди з API:', apiDeals);
    // Фільтруємо undefined/null елементи перед конвертацією
    const validDeals = apiDeals.filter(deal => deal != null);
    const convertedDeals = validDeals.map(dealToDisplay);
    console.log('✅ Конвертовані угоди:', convertedDeals);
    setDeals(convertedDeals);
  }, [apiDeals, users.length, properties.length]); // Використовуємо length замість масивів

  // Завантажуємо користувачів та об'єкти при ініціалізації
  useEffect(() => {
    if (users.length === 0) {
      fetchUsers();
    }
    if (properties.length === 0) {
      fetchProperties();
    }
  }, []); // Видаляємо залежності щоб завантаження відбулося лише один раз

  // Функції для отримання імен
  const getUserName = (userId: string) => {
    const user = users.find((u: any) => u._id === userId || u.id === userId);
    return user ? `${user.first_name} ${user.last_name}` : userId ? `Клієнт ${userId.substring(0, 8)}` : 'Невідомий клієнт';
  };

  const getPropertyName = (propertyId: string) => {
    const property = properties.find((p: any) => p._id === propertyId || p.id === propertyId);
    return property ? `${property.title} - ${(property as any).city}` : propertyId ? `Об'єкт ${propertyId.substring(0, 8)}` : 'Невідомий об\'єкт';
  };

  // Функція для конвертації Deal з API в DealDisplay
  const dealToDisplay = (deal: Deal): DealDisplay => {
    // Захист від undefined/null
    if (!deal) {
      console.warn('🚨 dealToDisplay: отримано undefined/null deal');
      return {
        id: 'unknown',
        title: 'Невідома угода',
        type: 'sale',
        status: 'active',
        priority: 'medium',
        client: 'Невідомо',
        property: 'Невідомо',
        value: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        responsibleAgent: 'Не призначено',
        description: '',
        currency: 'UAH',
      };
    }

    // Виправляємо маппінг полів з API
    const apiDeal = deal as any; // Тимчасово використовуємо any для доступу до реальних полів API
    
    return {
      id: apiDeal._id || deal.id,
      title: deal.title || `${typeLabels[apiDeal.type as DealType] || 'Угода'} - ${getUserName(deal.client_id || '')}`,
      type: apiDeal.type || deal.deal_type || 'sale',
      status: deal.status || 'active',
      priority: deal.priority || 'medium',
      client: getUserName(deal.client_id || ''),
      property: getPropertyName(deal.property_id || ''),
      value: apiDeal.price || deal.value || 0,
      createdAt: new Date(deal.created_at),
      updatedAt: new Date(deal.updated_at),
      closingDate: deal.actual_close_date ? new Date(deal.actual_close_date) : 
                    apiDeal.expected_close_date ? new Date(apiDeal.expected_close_date) : undefined,
      responsibleAgent: deal.responsible_agent || 'Не призначено',
      description: deal.description || apiDeal.notes,
      currency: deal.currency || 'UAH',
    };
  };

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

  // Функція для створення нової угоди
  const handleCreateDeal = () => {
    setEditingDeal(null);
    setShowDealModal(true);
  };

  // Функція для редагування угоди
  const handleEditDeal = (deal: DealDisplay) => {
    // Знайдемо оригінальну угоду з API
    const originalDeal = apiDeals.find(d => (d as any)._id === deal.id || d.id === deal.id);
    if (originalDeal) {
      setEditingDeal(originalDeal);
      setShowDealModal(true);
    }
  };

  const handleViewDeal = (deal: DealDisplay) => {
    // Знаходимо оригінальну угоду з API
    const originalDeal = apiDeals.find(d => (d as any)._id === deal.id || d.id === deal.id);
    if (originalDeal) {
      setSelectedDeal(originalDeal);
      setShowDetailsModal(true);
    }
  };

  // Функція для обробки сабміту модалки
  const handleDealSubmit = async (dealData: any) => {
    try {
      if (editingDeal) {
        // Редагування існуючої угоди
        const updatedDeal = await updateDeal(editingDeal.id, dealData);
        if (updatedDeal) {
          setShowDealModal(false);
          setEditingDeal(null);
          // Оновлюємо список угод
          await fetchDeals();
        }
      } else {
        // Створення нової угоди
        const newDeal = await createDeal(dealData);
        if (newDeal) {
          setShowDealModal(false);
          // Оновлюємо список угод
          await fetchDeals();
        }
      }
    } catch (error) {
      console.error('Помилка при збереженні угоди:', error);
    }
  };

  // Функція для видалення угоди
  const handleDeleteDeal = async (dealId: string) => {
    if (window.confirm("Ви впевнені, що хочете видалити цю угоду?")) {
      const success = await deleteDeal(dealId);
      if (success) {
        // Оновлюємо список угод після видалення
        await fetchDeals();
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

  // Функція більше не потрібна, оскільки selectedDeal тепер містить повну угоду

    return (
    <div className="space-y-6">
      {/* Заголовок та статистика */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Угоди
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hidden sm:block">
              Управління угодами та журналом активності
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowActivityJournal(!showActivityJournal)}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm"
            >
              <IconClipboard className="h-4 w-4" />
              <span className="hidden sm:inline">Журнал активності</span>
              <span className="sm:hidden">Журнал</span>
            </button>
            <button
              onClick={() => handleCreateDeal()}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
            >
              <IconPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Нова угода</span>
              <span className="sm:hidden">Нова</span>
            </button>
          </div>
        </div>

        {/* Мобільний підзаголовок */}
        <div className="sm:hidden">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Управління угодами та журналом активності
          </p>
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
      <div className="grid grid-cols-1 gap-6">
        {/* Список угод */}
              <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium">
                Угоди ({filteredDeals.length})
              </h2>
              </div>

            <div className="space-y-1">
              {filteredDeals.length === 0 ? (
                <div className="p-8 text-center">
                  <IconHome className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Угод не знайдено</p>
                </div>
              ) : (
                filteredDeals.map((deal) => (
                  <div
                    key={deal.id}
                    className="p-3 sm:p-4 mb-3 sm:mb-4 rounded-lg bg-card shadow-sm transition-all hover:bg-gray-50 dark:hover:bg-gray-900/20 cursor-pointer"
                    onClick={() => handleViewDeal(deal)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="mt-0.5 flex flex-col items-center">
                          <IconFileText className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-base sm:text-lg truncate">{deal.title}</h3>
                          <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                            <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${statusColors[deal.status]}`}>
                              {statusLabels[deal.status]}
                            </span>
                            <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${priorityColors[deal.priority]}`}>
                              {priorityLabels[deal.priority]}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1 min-w-0">
                              <IconUser className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                              <span className="truncate">{deal.client}</span>
                            </div>
                            <div className="flex items-center gap-1 min-w-0">
                              <IconHome className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                              <span className="truncate">{deal.property}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end mt-3 sm:mt-0 text-right min-w-0">
                        <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">
                          {formatCurrency(deal.value, deal.currency)}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
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
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 order-2 sm:order-1">
                    Показано {filteredDeals.length} з {totalDeals}
                  </div>
                  <div className="flex items-center gap-2 order-1 sm:order-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <IconChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="px-2 sm:px-3 py-2 text-xs sm:text-sm">
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

        {/* Тут раніше були деталі угоди - тепер використовуємо модалку */}
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

      {/* Модалка створення/редагування угоди */}
      <DealFormModal
        isOpen={showDealModal}
        onClose={() => {
          setShowDealModal(false);
          setEditingDeal(null);
        }}
        onSubmit={handleDealSubmit}
        deal={editingDeal}
        isLoading={loading}
      />

      {/* Модалка деталей угоди */}
      <DealDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedDeal(null);
        }}
        deal={selectedDeal}
      />
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