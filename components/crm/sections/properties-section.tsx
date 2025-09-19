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
  IconStar,
  IconStarFilled,
  IconMapPin,
  IconRuler,
  IconHome,
  IconBuildingSkyscraper,
  IconBuildingWarehouse,
  IconBuildingStore,
  IconCurrencyDollar,
  IconCalendar,
  IconPhoto,
  IconAlertCircle,
  IconLoader,
} from "@tabler/icons-react";

import { useTranslation } from "@/hooks/useTranslation";
import { useMyProperties, useFavoriteProperties } from "@/hooks/useProperties";
import { useAllProperties } from "@/hooks/useAllProperties";
import { PropertyFormModal } from "@/components/crm/property-form-modal";
import { PropertyViewModal } from "@/components/crm/property-view-modal";
import type { Property, PropertyType, PropertyStatus, TransactionType } from "@/types";

// Типи статусів для UI
type UIPropertyStatus = "active" | "sold" | "pending" | "reserved" | "draft" | "archived";
type PropertyPriority = "high" | "medium" | "low";

// Маппінг статусів з API до UI
const mapApiStatusToUI = (status: PropertyStatus): UIPropertyStatus => {
  switch (status) {
    case "active":
      return "active";
    case "sold":
      return "sold";
    case "inactive":
      return "draft";
    default:
      return "active";
  }
};

// Конвертація API Property в UI Property
const convertApiPropertyToUI = (apiProperty: Property) => {
  return {
    id: apiProperty._id,
    title: apiProperty.title,
    type: apiProperty.property_type,
    status: mapApiStatusToUI(apiProperty.status),
    priority: "medium" as PropertyPriority, // За замовчуванням середній пріоритет
    isFeatured: apiProperty.is_featured || false,
    price: apiProperty.price,
    currency: "USD", // За замовчуванням USD
    address: `${apiProperty.location.address}, ${apiProperty.location.city}`,
    area: apiProperty.area,
    rooms: apiProperty.rooms,
    description: apiProperty.description,
    createdAt: new Date(apiProperty.created_at),
    updatedAt: new Date(apiProperty.updated_at),
    responsibleAgent: "Агент", // Можна додати пізніше
    images: apiProperty.images || [],
    tags: apiProperty.features || [],
  };
};

export function PropertiesSection() {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  
  // Використовуємо хуки для роботи з API
  const { 
    properties: myProperties, 
    isLoading: myPropertiesLoading, 
    error: myPropertiesError,
    totalPages: myTotalPages,
    currentPage: myCurrentPage,
    total: myTotal,
    goToPage: goToMyPage,
    deleteProperty: deleteMyProperty,
    refresh: refreshMyProperties 
  } = useMyProperties();

  const {
    properties: allProperties,
    isLoading: allPropertiesLoading,
    error: allPropertiesError,
    totalPages: allTotalPages,
    currentPage: allCurrentPage,
    total: allTotal,
    goToPage: goToAllPage,
    deleteProperty: deleteAllProperty,
    refresh: refreshAllProperties
  } = useAllProperties();
  
  const { 
    favorites, 
    isLoading: favoritesLoading, 
    addToFavorites, 
    removeFromFavorites, 
    isFavorite 
  } = useFavoriteProperties();

  // Локальні стани для UI
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<UIPropertyStatus | "all">("all");
  const [filterType, setFilterType] = useState<PropertyType | "all">("all");

  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"title" | "price" | "area" | "createdAt" | "updatedAt">("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [showAllProperties, setShowAllProperties] = useState(false);

  // Стани модальних вікон
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [viewingProperty, setViewingProperty] = useState<Property | null>(null);

  // Ефект для монтування компонента
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Ефект для фільтрації та сортування об'єктів
  useEffect(() => {
    // Конвертування API властивостей в UI формат
    const apiProperties = showAllProperties ? allProperties : myProperties;
    console.log('showAllProperties:', showAllProperties);
    console.log('allProperties:', allProperties);
    console.log('myProperties:', myProperties);
    const uiProperties = apiProperties.map(convertApiPropertyToUI);
    console.log('uiProperties:', uiProperties);
    let result = [...uiProperties];

    // Фільтрація за обраними
    if (showFeaturedOnly) {
      result = result.filter((property) => property.isFeatured);
    }

    // Фільтрація за статусом
    if (filterStatus !== "all") {
      result = result.filter((property) => property.status === filterStatus);
    }

    // Фільтрація за типом
    if (filterType !== "all") {
      result = result.filter((property) => property.type === filterType);
    }

    // Пошук за текстом
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (property) =>
          property.title.toLowerCase().includes(term) ||
          property.address.toLowerCase().includes(term) ||
          property.description?.toLowerCase().includes(term) ||
          property.responsibleAgent.toLowerCase().includes(term) ||
          property.tags.some((tag: string) => tag.toLowerCase().includes(term)),
      );
    }

    // Сортування
    result.sort((a, b) => {
      if (sortBy === "title") {
        return sortDirection === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortBy === "price") {
        return sortDirection === "asc"
          ? a[sortBy].amount - b[sortBy].amount
          : b[sortBy].amount - a[sortBy].amount;
      } else if (sortBy === "area") {
        return sortDirection === "asc"
          ? a[sortBy] - b[sortBy]
          : b[sortBy] - a[sortBy];
      } else {
        // Для дат
        const aTime = a[sortBy].getTime();
        const bTime = b[sortBy].getTime();
        return sortDirection === "asc" ? aTime - bTime : bTime - aTime;
      }
    });

    setFilteredProperties(result);
  }, [
    myProperties,
    allProperties,
    showAllProperties,
    filterStatus,
    filterType,
    searchTerm,
    sortBy,
    sortDirection,
    showFeaturedOnly,
  ]);

  // Функція для отримання кольору статусу нерухомості
  const getStatusColor = (status: UIPropertyStatus) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "sold":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "reserved":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
      case "archived":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  // Функція для отримання перекладу статусу нерухомості
  const getStatusText = (status: UIPropertyStatus) => {
    return t(`crm.properties.statuses.${status}`);
  };

  // Функція для отримання класу пріоритету
  const getPriorityClass = (priority: PropertyPriority) => {
    switch (priority) {
      case "high":
        return "border-l-4 border-red-500";
      case "medium":
        return "border-l-4 border-yellow-500";
      case "low":
        return "border-l-4 border-green-500";
      default:
        return "";
    }
  };

  // Функція для отримання іконки типу нерухомості
  const getTypeIcon = (type: PropertyType) => {
    switch (type) {
      case "apartment":
        return (
          <IconBuildingSkyscraper className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        );
      case "house":
        return (
          <IconHome className="h-5 w-5 text-green-600 dark:text-green-400" />
        );
      case "commercial":
        return (
          <IconBuildingStore className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        );
      case "land":
        return (
          <IconBuildingWarehouse className="h-5 w-5 text-orange-600 dark:text-orange-400" />
        );
      default:
        return <IconHome className="h-5 w-5" />;
    }
  };

  // Функція для отримання тексту типу нерухомості
  const getTypeText = (type: PropertyType) => {
    return t(`crm.properties.types.${type}`);
  };

  // Функція для форматування дати
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  // Функція для форматування ціни
  const formatPrice = (price: { amount: number; currency: string }) => {
    return `${price.amount.toLocaleString("uk-UA")} ${price.currency}`;
  };

  // Функція для зміни статусу "обраний"
  const toggleFeatured = async (propertyId: string) => {
    const property = (showAllProperties ? allProperties : myProperties).find((p: Property) => p._id === propertyId);
    if (!property) return;

    if (property.is_featured) {
      await removeFromFavorites(propertyId);
    } else {
      await addToFavorites(propertyId);
    }
    
    // Оновлюємо список властивостей
    if (showAllProperties) {
      refreshAllProperties();
    } else {
      refreshMyProperties();
    }
  };

  // Функції модальних вікон
  const handleCreateProperty = () => {
    setIsCreateModalOpen(true);
  };

  const handleViewProperty = (property: any) => {
    // Знаходимо оригінальну API властивість
    const apiProperty = (showAllProperties ? allProperties : myProperties).find(p => p._id === property.id);
    if (apiProperty) {
      setViewingProperty(apiProperty);
      setIsViewModalOpen(true);
    }
  };

  const handleEditProperty = (property: any) => {
    // Знаходимо оригінальну API властивість
    const apiProperty = (showAllProperties ? allProperties : myProperties).find(p => p._id === property.id);
    if (apiProperty) {
      setEditingProperty(apiProperty);
      setIsEditModalOpen(true);
    }
  };

  const handleDeleteProperty = async (property: any) => {
    if (window.confirm('Ви впевнені що хочете видалити цей об\'єкт?')) {
      const deleteFunc = showAllProperties ? deleteAllProperty : deleteMyProperty;
      const success = await deleteFunc(property.id);
      if (success) {
        // Закриваємо модал перегляду якщо він відкритий
        if (isViewModalOpen && viewingProperty?._id === property.id) {
          setIsViewModalOpen(false);
          setViewingProperty(null);
        }
      }
    }
  };

  const handleCloseModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
    setEditingProperty(null);
    setViewingProperty(null);
  };

  const handleModalSuccess = () => {
    if (showAllProperties) {
      refreshAllProperties();
    } else {
      refreshMyProperties();
    }
    handleCloseModals();
  };

  const handleEditFromView = () => {
    if (viewingProperty) {
      setEditingProperty(viewingProperty);
      setIsViewModalOpen(false);
      setIsEditModalOpen(true);
      setViewingProperty(null);
    }
  };

  const handleDeleteFromView = () => {
    if (viewingProperty) {
      handleDeleteProperty({ id: viewingProperty._id });
    }
  };

  // Компонент плашки для тегів
  const Tag = ({ text }: { text: string }) => (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
      {text}
    </span>
  );

  // Компонент для відображення помилки
  const ErrorMessage = ({ message }: { message: string | null }) => (
    <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
      <IconAlertCircle className="h-5 w-5" />
      <span>{message}</span>
      <button 
        onClick={() => showAllProperties ? refreshAllProperties() : refreshMyProperties()}
        className="ml-auto px-3 py-1 bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 rounded text-sm"
      >
        Повторити
      </button>
    </div>
  );

  // Компонент для завантаження
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-8">
      <IconLoader className="h-8 w-8 animate-spin text-blue-500" />
      <span className="ml-2 text-gray-600 dark:text-gray-400">Завантаження...</span>
    </div>
  );

  // Компонент для рядка властивостей
  const PropertyRow = ({ property }: { property: any }) => {

    return (
      <div
        className={`
        p-3 sm:p-4 mb-3 sm:mb-4 rounded-lg bg-card shadow-sm transition-all
        ${getPriorityClass(property.priority)}
        hover:bg-gray-50 dark:hover:bg-gray-900/20
      `}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="flex items-start space-x-3">
            <div className="mt-0.5 flex flex-col items-center">
              {getTypeIcon(property.type)}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFeatured(property.id);
                }}
                className="mt-2 text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400"
                aria-label={
                  property.isFeatured
                    ? t("crm.properties.removeFromFeatured")
                    : t("crm.properties.addToFeatured")
                }
              >
                {property.isFeatured ? (
                  <IconStarFilled className="h-5 w-5 text-yellow-500" />
                ) : (
                  <IconStar className="h-5 w-5" />
                )}
              </button>
            </div>
            <div>
              <h3 className="font-medium text-lg">{property.title}</h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${getStatusColor(property.status)}`}
                >
                  {getStatusText(property.status)}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {getTypeText(property.type)}
                </span>
                <span className="text-sm font-medium">
                  {formatPrice(property.price)}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                <IconMapPin className="h-3.5 w-3.5 mr-1" />
                {property.address}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-3 md:mt-0">
            <button
              onClick={() => handleViewProperty(property)}
              className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label={t("crm.properties.viewDetails")}
            >
              <IconEye className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleEditProperty(property)}
              className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label={t("crm.properties.edit")}
            >
              <IconEdit className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleDeleteProperty(property)}
              className="p-1.5 rounded-full text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              aria-label={t("crm.properties.delete")}
            >
              <IconTrash className="h-5 w-5" />
            </button>
          </div>
        </div>


      </div>
    );
  };

  // Компонент для фільтрів
  const FiltersPanel = () => {
    return (
      <div
        className={`
        p-4 mb-4 rounded-lg bg-gray-50 dark:bg-gray-900/30 transition-all
        ${showFilters ? "block" : "hidden"}
      `}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              className="text-sm font-medium block mb-1.5"
              htmlFor="status-filter"
            >
              {t("crm.properties.filterByStatus")}
            </label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as UIPropertyStatus | "all")
              }
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <option value="all">{t("crm.properties.allStatuses")}</option>
              <option value="active">
                {t("crm.properties.statuses.active")}
              </option>
              <option value="sold">{t("crm.properties.statuses.sold")}</option>
              <option value="pending">
                {t("crm.properties.statuses.pending")}
              </option>
              <option value="reserved">
                {t("crm.properties.statuses.reserved")}
              </option>
              <option value="draft">
                {t("crm.properties.statuses.draft")}
              </option>
              <option value="archived">
                {t("crm.properties.statuses.archived")}
              </option>
            </select>
          </div>

          <div>
            <label
              className="text-sm font-medium block mb-1.5"
              htmlFor="type-filter"
            >
              {t("crm.properties.filterByType")}
            </label>
            <select
              id="type-filter"
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value as PropertyType | "all")
              }
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <option value="all">{t("crm.properties.allTypes")}</option>
              <option value="apartment">
                {t("crm.properties.types.apartment")}
              </option>
              <option value="house">{t("crm.properties.types.house")}</option>
              <option value="commercial">
                {t("crm.properties.types.commercial")}
              </option>
              <option value="land">{t("crm.properties.types.land")}</option>
            </select>
          </div>

          <div>
            <label
              className="text-sm font-medium block mb-1.5"
              htmlFor="sort-by"
            >
              {t("crm.properties.sortBy")}
            </label>
            <div className="flex gap-2">
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="flex-grow px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <option value="title">{t("crm.properties.title")}</option>
                <option value="price">{t("crm.properties.price")}</option>
                <option value="area">{t("crm.properties.area")}</option>
                <option value="createdAt">
                  {t("crm.properties.createdAt")}
                </option>
                <option value="updatedAt">
                  {t("crm.properties.updatedAt")}
                </option>
              </select>

              <button
                onClick={() =>
                  setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                }
                className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                {sortDirection === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-3 space-y-3">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showFeaturedOnly}
              onChange={(e) => setShowFeaturedOnly(e.target.checked)}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
            <span className="ms-3 text-sm font-medium">
              {t("crm.properties.showFeaturedOnly")}
            </span>
          </label>
          
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showAllProperties}
              onChange={(e) => {
                const newValue = e.target.checked;
                console.log('Changing showAllProperties to:', newValue);
                setShowAllProperties(newValue);
                if (newValue) {
                  refreshAllProperties();
                } else {
                  refreshMyProperties();
                }
              }}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600" />
            <span className="ms-3 text-sm font-medium">
              Показати всі об'єкти з бази
            </span>
          </label>
        </div>
      </div>
    );
  };

  // Показуємо заглушку до монтування компонента
  if (!isMounted) {
    return <div className="w-full p-4 h-64" />;
  }

  return (
    <motion.div
      className="w-full p-4 sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">
          {t("crm.sections.properties.title")}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">{t("crm.properties.subtitle")}</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <div className="relative flex-grow max-w-md w-full sm:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IconSearch className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={t("crm.properties.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 sm:pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center gap-1.5"
          >
            <IconFilter className="h-5 w-5" />
            <span className="hidden sm:inline">
              {t("crm.properties.filters")}
            </span>
          </button>

          <button 
            onClick={handleCreateProperty}
            className="px-3 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-1.5"
          >
            <IconPlus className="h-5 w-5" />
            <span className="hidden sm:inline">
              {t("crm.properties.newProperty")}
            </span>
          </button>
        </div>
      </div>

      <FiltersPanel />

      <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-sm p-2 sm:p-4">
        {(showAllProperties ? allPropertiesLoading : myPropertiesLoading) ? (
          <LoadingSpinner />
        ) : (showAllProperties ? allPropertiesError : myPropertiesError) ? (
          <ErrorMessage message={(showAllProperties ? allPropertiesError : myPropertiesError) || 'Помилка завантаження даних'} />
        ) : filteredProperties.length > 0 ? (
          <div className="space-y-1">
            {filteredProperties.map((property) => (
              <PropertyRow key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <IconHome className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>{t("crm.properties.noPropertiesFound")}</p>
            <button 
              onClick={handleCreateProperty}
              className="mt-4 px-4 py-2 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600"
            >
              {t("crm.properties.createFirstProperty")}
            </button>
          </div>
        )}

        {/* Пагінація */}
        {(showAllProperties ? allTotalPages : myTotalPages) > 1 && (
          <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            {/* Мобільна версія пагінації */}
            <div className="flex flex-col sm:hidden space-y-3">
              <div className="text-center text-xs text-gray-600 dark:text-gray-400">
                Сторінка {showAllProperties ? allCurrentPage : myCurrentPage} з {showAllProperties ? allTotalPages : myTotalPages} ({showAllProperties ? allTotal : myTotal} об'єктів)
              </div>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => showAllProperties ? goToAllPage(allCurrentPage - 1) : goToMyPage(myCurrentPage - 1)}
                  disabled={(showAllProperties ? allCurrentPage : myCurrentPage) === 1}
                  className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:hover:bg-gray-800 text-sm"
                >
                  ← Попередня
                </button>
                
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max={showAllProperties ? allTotalPages : myTotalPages}
                    value={showAllProperties ? allCurrentPage : myCurrentPage}
                    onChange={(e) => {
                      const newPage = parseInt(e.target.value);
                      const maxPages = showAllProperties ? allTotalPages : myTotalPages;
                      if (newPage >= 1 && newPage <= maxPages) {
                        showAllProperties ? goToAllPage(newPage) : goToMyPage(newPage);
                      }
                    }}
                    className="w-16 px-2 py-1 text-center border border-gray-300 rounded text-sm dark:border-gray-700 dark:bg-gray-800"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">/ {showAllProperties ? allTotalPages : myTotalPages}</span>
                </div>
                
                <button
                  onClick={() => showAllProperties ? goToAllPage(allCurrentPage + 1) : goToMyPage(myCurrentPage + 1)}
                  disabled={(showAllProperties ? allCurrentPage : myCurrentPage) === (showAllProperties ? allTotalPages : myTotalPages)}
                  className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:hover:bg-gray-800 text-sm"
                >
                  Наступна →
                </button>
              </div>
            </div>

            {/* Десктопна версія пагінації */}
            <div className="hidden sm:flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
                <span className="hidden sm:inline">Показано {filteredProperties.length} з {showAllProperties ? allTotal : myTotal} об'єктів</span>
                <span className="block sm:hidden">{filteredProperties.length} з {showAllProperties ? allTotal : myTotal}</span>
                <span className="block sm:inline"> (сторінка {showAllProperties ? allCurrentPage : myCurrentPage} з {showAllProperties ? allTotalPages : myTotalPages})</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 justify-center">
                <button
                  onClick={() => showAllProperties ? goToAllPage(allCurrentPage - 1) : goToMyPage(myCurrentPage - 1)}
                  disabled={(showAllProperties ? allCurrentPage : myCurrentPage) === 1}
                  className="px-2 sm:px-3 py-1 sm:py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Попередня</span>
                  <span className="sm:hidden">←</span>
                </button>
                
                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: Math.min(5, showAllProperties ? allTotalPages : myTotalPages) }, (_, i) => {
                    const page = i + 1;
                    const isActive = page === (showAllProperties ? allCurrentPage : myCurrentPage);
                    
                    return (
                      <button
                        key={page}
                        onClick={() => showAllProperties ? goToAllPage(page) : goToMyPage(page)}
                        className={`px-3 py-2 rounded-md text-sm ${
                          isActive
                            ? 'bg-blue-500 text-white'
                            : 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  {(showAllProperties ? allTotalPages : myTotalPages) > 5 && (
                    <>
                      <span className="px-2 text-gray-500">...</span>
                      <button
                        onClick={() => showAllProperties ? goToAllPage(allTotalPages) : goToMyPage(myTotalPages)}
                        className={`px-3 py-2 rounded-md text-sm ${
                          (showAllProperties ? allTotalPages : myTotalPages) === (showAllProperties ? allCurrentPage : myCurrentPage)
                            ? 'bg-blue-500 text-white'
                            : 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {showAllProperties ? allTotalPages : myTotalPages}
                      </button>
                    </>
                  )}
                </div>

                <button
                  onClick={() => showAllProperties ? goToAllPage(allCurrentPage + 1) : goToMyPage(myCurrentPage + 1)}
                  disabled={(showAllProperties ? allCurrentPage : myCurrentPage) === (showAllProperties ? allTotalPages : myTotalPages)}
                  className="px-2 sm:px-3 py-1 sm:py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Наступна</span>
                  <span className="sm:hidden">→</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Модальні вікна */}
      <PropertyFormModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModals}
        onSuccess={handleModalSuccess}
      />

      <PropertyFormModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModals}
        property={editingProperty}
        onSuccess={handleModalSuccess}
      />

      <PropertyViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseModals}
        property={viewingProperty}
        onEdit={handleEditFromView}
        onDelete={handleDeleteFromView}
      />
    </motion.div>
  );
}
