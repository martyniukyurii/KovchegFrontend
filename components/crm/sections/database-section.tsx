"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconSearch,
  IconFilter,
  IconEye,
  IconPhone,
  IconMapPin,
  IconBuilding,
  IconBed,
  IconRuler,
  IconCalendar,
  IconX,
  IconChevronLeft,
  IconChevronRight,
  IconExternalLink,
  IconRefresh,
  IconAdjustmentsHorizontal,
  IconTrash,
  IconCheck,
  IconRotate,
  IconEdit,
  IconDots,
  IconAlertTriangle,
} from "@tabler/icons-react";

import { useListings, useListing, PropertyListing, PropertyFilters } from "@/hooks/useListings";
import { useTranslation } from "@/hooks/useTranslation";
import { apiClient } from "@/lib/api-client";

export function DatabaseSection() {
  const { t } = useTranslation();
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState<{ action: string; id: string; title: string } | null>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  const {
    listings,
    loading,
    error,
    total,
    page,
    totalPages,
    filters,
    updateFilters,
    updatePage,
    resetFilters,
    refetch,
  } = useListings({}, 1, 12);

  console.log('Database Section - listings:', listings);
  console.log('Database Section - loading:', loading);
  console.log('Database Section - error:', error);
  console.log('Database Section - total:', total);
  console.log('Database Section - listings type:', typeof listings);
  console.log('Database Section - listings is array:', Array.isArray(listings));
  console.log('Database Section - listings length:', listings?.length);

  const { listing: selectedListing, loading: listingLoading } = useListing(selectedListingId || "");

  // Безпечна перевірка listings
  const safeListings = Array.isArray(listings) ? listings : [];
  console.log('Database Section - safeListings after check:', safeListings);
  
  // Використовуємо дані як є, оскільки вони вже відсортовані на сервері
  const sortedListings = safeListings;
  
  // Додаткове логування для діагностики
  console.log('Database Section - total from hook:', total);
  console.log('Database Section - totalPages from hook:', totalPages);
  console.log('Database Section - page from hook:', page);

  useEffect(() => {
    if (selectedListing) {
      setCurrentImageIndex(0);
    }
  }, [selectedListing]);

  // Закриття меню фільтрів при кліку поза ним
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    updateFilters({ ...filters, search: query });
  };

  const handleFilterChange = (newFilters: Partial<PropertyFilters>) => {
    updateFilters({ ...filters, ...newFilters });
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    resetFilters();
  };

  const formatPrice = (priceObj: { amount: number; currency: string } | number, currency?: string) => {
    let amount: number;
    let curr: string;
    
    if (typeof priceObj === 'object' && priceObj !== null) {
      amount = priceObj.amount;
      curr = priceObj.currency;
    } else {
      amount = priceObj;
      curr = currency || "USD";
    }
    
    return new Intl.NumberFormat("uk-UA", {
      style: "currency",
      currency: curr === "USD" ? "USD" : "UAH",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("uk-UA");
  };

  const nextImage = () => {
    if (selectedListing && selectedListing.images && selectedListing.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === selectedListing.images!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedListing && selectedListing.images && selectedListing.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedListing.images!.length - 1 : prev - 1
      );
    }
  };

  // Функції для управління оголошеннями
  const handleDeleteListing = async (id: string) => {
    setIsProcessing(id);
    try {
      const response = await apiClient.deleteParsedListing(id);
      if (response.status === 'success') {
        console.log('✅ Оголошення видалено успішно');
        refetch(); // Оновлюємо список
      } else {
        alert(`Помилка видалення: ${response.message}`);
      }
    } catch (error: any) {
      console.error('❌ Помилка видалення оголошення:', error);
      alert(`Помилка видалення: ${error.message}`);
    } finally {
      setIsProcessing(null);
      setShowConfirmDialog(null);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setIsProcessing(id);
    try {
      const response = await apiClient.updateParsedListingStatus(id, newStatus);
      if (response.status === 'success') {
        console.log(`✅ Статус оголошення змінено на ${newStatus}`);
        refetch(); // Оновлюємо список
      } else {
        alert(`Помилка зміни статусу: ${response.message}`);
      }
    } catch (error: any) {
      console.error('❌ Помилка зміни статусу:', error);
      alert(`Помилка зміни статусу: ${error.message}`);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleConvertListing = async (id: string) => {
    setIsProcessing(id);
    try {
      const response = await apiClient.convertParsedListing(id);
      if (response.status === 'success') {
        console.log('✅ Оголошення конвертовано в об\'єкт нерухомості');
        refetch(); // Оновлюємо список
        alert('Оголошення успішно конвертовано в об\'єкт нерухомості!');
      } else {
        alert(`Помилка конвертації: ${response.message}`);
      }
    } catch (error: any) {
      console.error('❌ Помилка конвертації:', error);
      alert(`Помилка конвертації: ${error.message}`);
    } finally {
      setIsProcessing(null);
      setShowConfirmDialog(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'processed': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'converted': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'Новий';
      case 'processed': return 'Оброблений';
      case 'approved': return 'Схвалений';
      case 'converted': return 'Конвертований';
      default: return status;
    }
  };



  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full p-4 sm:p-6"
    >
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">{t("crm.sections.database.title")}</h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t("crm.sections.database.subtitle")}
          </p>
        </div>
        <button
          onClick={refetch}
          disabled={loading}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
        >
          <IconRefresh className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">{t("crm.sections.database.refresh")}</span>
          <span className="sm:hidden">Оновити</span>
        </button>
      </div>

      {/* Пошук та фільтри */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={t("crm.sections.database.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-700 dark:bg-gray-800"
          />
        </div>
        
        <div className="flex gap-2">
          <div className="relative" ref={filterMenuRef}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              <IconAdjustmentsHorizontal className="h-4 w-4" />
              {t("crm.sections.database.filters")}
            </button>
            
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                >
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{t("crm.sections.database.filters")}</h3>
                      <button
                        onClick={handleResetFilters}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        {t("crm.sections.database.resetFilters")}
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Статус
                        </label>
                        <select
                          value={filters.status_filter || ""}
                          onChange={(e) => handleFilterChange({ status_filter: e.target.value || undefined } as any)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800"
                        >
                          <option value="">Всі статуси</option>
                          <option value="new">Нові</option>
                          <option value="processed">Оброблені</option>
                          <option value="approved">Схвалені</option>
                          <option value="converted">Конвертовані</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Джерело
                        </label>
                        <select
                          value={filters.source || ""}
                          onChange={(e) => handleFilterChange({ source: e.target.value || undefined } as any)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800"
                        >
                          <option value="">Всі джерела</option>
                          <option value="OLX">OLX</option>
                          <option value="RIA">RIA</option>
                          <option value="DOM_RIA">DOM.RIA</option>
                          <option value="M2BOMBER">M2BOMBER</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          {t("crm.sections.database.propertyType")}
                        </label>
                        <select
                          value={filters.property_type || ""}
                          onChange={(e) => handleFilterChange({ property_type: e.target.value || undefined })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800"
                        >
                          <option value="">{t("crm.sections.database.allTypes")}</option>
                          <option value="prodazh">Продаж</option>
                          <option value="orenda">Оренда</option>
                          <option value="commerce">Комерційна</option>
                          <option value="zemlya">Земля</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          {t("crm.sections.database.listingType")}
                        </label>
                        <select
                          value={filters.listing_type || ""}
                          onChange={(e) => handleFilterChange({ listing_type: e.target.value || undefined })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800"
                        >
                          <option value="">{t("crm.sections.database.allListings")}</option>
                          <option value="sale">{t("crm.sections.database.sale")}</option>
                          <option value="rent">{t("crm.sections.database.rent")}</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          {t("crm.sections.database.minPrice")}
                        </label>
                        <input
                          type="number"
                          placeholder="0"
                          value={filters.min_price || ""}
                          onChange={(e) => handleFilterChange({ min_price: e.target.value ? Number(e.target.value) : undefined })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          {t("crm.sections.database.maxPrice")}
                        </label>
                        <input
                          type="number"
                          placeholder="∞"
                          value={filters.max_price || ""}
                          onChange={(e) => handleFilterChange({ max_price: e.target.value ? Number(e.target.value) : undefined })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          {t("crm.sections.database.rooms")}
                        </label>
                        <select
                          value={filters.rooms || ""}
                          onChange={(e) => handleFilterChange({ rooms: e.target.value ? Number(e.target.value) : undefined })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800"
                        >
                          <option value="">{t("crm.sections.database.anyRooms")}</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5+</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          {t("crm.sections.database.city")}
                        </label>
                        <input
                          type="text"
                          placeholder={t("crm.sections.database.cityPlaceholder")}
                          value={filters.city || ""}
                          onChange={(e) => handleFilterChange({ city: e.target.value || undefined })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div className="mb-4 sm:mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{t("crm.sections.database.totalListings")}</p>
              <p className="text-lg sm:text-2xl font-bold">{total > 0 ? total.toLocaleString() : sortedListings.length.toLocaleString()}</p>
            </div>
            <IconBuilding className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{t("crm.sections.database.currentPage")}</p>
              <p className="text-lg sm:text-2xl font-bold">{page} / {totalPages}</p>
            </div>
            <IconFilter className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{t("crm.sections.database.activeFilters")}</p>
              <p className="text-lg sm:text-2xl font-bold">{Object.keys(filters).filter(key => filters[key as keyof PropertyFilters]).length}</p>
            </div>
            <IconAdjustmentsHorizontal className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Список оголошень */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="animate-pulse">
                <div className="h-40 sm:h-48 bg-gray-300 dark:bg-gray-600"></div>
                <div className="p-3 sm:p-4 space-y-3">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {sortedListings.map((listing) => (
              <motion.div
                key={listing._id || listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedListingId(listing._id || listing.id)}
              >
                <div className="relative h-40 sm:h-48">
                  {listing.images && listing.images.length > 0 ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/img/placeholder.jpg";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                      <IconBuilding className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-1 sm:top-2 left-1 sm:left-2 flex flex-col gap-1">
                    <span className={`px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium ${getStatusColor(listing.status || 'new')}`}>
                      {getStatusText(listing.status || 'new')}
                    </span>
                    {listing.source && (
                      <span className="bg-gray-600 text-white px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs">
                        {typeof listing.source === 'string' ? listing.source : listing.source.platform || 'Невідомо'}
                      </span>
                    )}
                  </div>
                  <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                    {listing.category === "prodazh" || listing.listing_type === "sale" ? t("crm.sections.database.sale") : t("crm.sections.database.rent")}
                  </div>
                  {listing.images && listing.images.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                      +{listing.images.length - 1} фото
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{listing.title}</h3>
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {formatPrice(listing.price)}
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <IconMapPin className="h-4 w-4" />
                      <span className="line-clamp-1">
                        {listing.address || listing.location?.address || listing.location?.city || "Адреса не вказана"}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {listing.area && (
                        <div className="flex items-center gap-1">
                          <IconRuler className="h-4 w-4" />
                          <span>{listing.area} м²</span>
                        </div>
                      )}
                      {listing.rooms && (
                        <div className="flex items-center gap-1">
                          <IconBed className="h-4 w-4" />
                          <span>{listing.rooms} кімн.</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <IconCalendar className="h-4 w-4" />
                      <span>{formatDate(listing.created_at || listing.parsed_at || new Date().toISOString())}</span>
                    </div>
                  </div>
                  
                  {/* Кнопки управління */}
                  <div className="mt-4 flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex-1 flex gap-1">
                      {listing.status === 'new' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(listing._id || listing.id, 'processed');
                          }}
                          disabled={isProcessing === (listing._id || listing.id)}
                          className="text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 disabled:opacity-50"
                          title="Позначити як оброблений"
                        >
                          <IconEdit className="h-3 w-3" />
                        </button>
                      )}
                      
                      {listing.status === 'processed' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(listing._id || listing.id, 'approved');
                          }}
                          disabled={isProcessing === (listing._id || listing.id)}
                          className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 disabled:opacity-50"
                          title="Схвалити"
                        >
                          <IconCheck className="h-3 w-3" />
                        </button>
                      )}
                      
                      {listing.status === 'approved' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowConfirmDialog({ 
                              action: 'convert', 
                              id: listing._id || listing.id, 
                              title: listing.title 
                            });
                          }}
                          disabled={isProcessing === (listing._id || listing.id)}
                          className="text-xs bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600 disabled:opacity-50"
                          title="Конвертувати в об'єкт нерухомості"
                        >
                          <IconRotate className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowConfirmDialog({ 
                          action: 'delete', 
                          id: listing._id || listing.id, 
                          title: listing.title 
                        });
                      }}
                      disabled={isProcessing === (listing._id || listing.id)}
                      className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                      title="Видалити"
                    >
                      <IconTrash className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Показуємо повідомлення, якщо немає даних */}
          {sortedListings.length === 0 && !loading && (
            <div className="text-center py-12">
              <IconBuilding className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                {t("crm.sections.database.noListings")}
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                {t("crm.sections.database.noListingsDescription")}
              </p>
            </div>
          )}

          {/* Пагінація */}
          {(totalPages > 1 || (total > 0 && sortedListings.length > 0)) && (
            <div className="mt-6 sm:mt-8">
              {/* Мобільна версія пагінації */}
              <div className="flex flex-col sm:hidden space-y-3">
                <div className="text-center text-xs text-gray-600 dark:text-gray-400">
                  Сторінка {page} з {totalPages} ({total} оголошень)
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => updatePage(page - 1)}
                    disabled={page === 1}
                    className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:hover:bg-gray-800 text-sm"
                  >
                    <IconChevronLeft className="h-4 w-4" />
                    Попередня
                  </button>
                  
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="1"
                      max={totalPages}
                      value={page}
                      onChange={(e) => {
                        const newPage = parseInt(e.target.value);
                        if (newPage >= 1 && newPage <= totalPages) {
                          updatePage(newPage);
                        }
                      }}
                      className="w-16 px-2 py-1 text-center border border-gray-300 rounded text-sm dark:border-gray-700 dark:bg-gray-800"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">/ {totalPages}</span>
                  </div>
                  
                  <button
                    onClick={() => updatePage(page + 1)}
                    disabled={page === Math.max(1, totalPages)}
                    className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:hover:bg-gray-800 text-sm"
                  >
                    Наступна
                    <IconChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Десктопна версія пагінації */}
              <div className="hidden sm:flex justify-center">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updatePage(page - 1)}
                    disabled={page === 1}
                    className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    <IconChevronLeft className="h-4 w-4" />
                    {t("crm.sections.database.prev")}
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, Math.max(1, totalPages)) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(Math.max(1, totalPages) - 4, page - 2)) + i;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => updatePage(pageNum)}
                          className={`px-3 py-2 rounded-md ${
                            pageNum === page
                              ? "bg-blue-600 text-white"
                              : "border border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => updatePage(page + 1)}
                    disabled={page === Math.max(1, totalPages)}
                    className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    {t("crm.sections.database.next")}
                    <IconChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Модальне вікно для детального перегляду */}
      <AnimatePresence>
        {selectedListingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedListingId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {listingLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4">{t("crm.sections.database.loading")}</p>
                </div>
              ) : selectedListing ? (
                <div>
                  <div className="relative">
                    <button
                      onClick={() => setSelectedListingId(null)}
                      className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg"
                    >
                      <IconX className="h-5 w-5" />
                    </button>
                    
                    {selectedListing.images && selectedListing.images.length > 0 ? (
                      <div className="relative h-96">
                        <img
                          src={selectedListing.images[currentImageIndex]}
                          alt={selectedListing.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/img/placeholder.jpg";
                          }}
                        />
                        
                        {selectedListing.images && selectedListing.images.length > 1 && (
                          <>
                            <button
                              onClick={prevImage}
                              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg"
                            >
                              <IconChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                              onClick={nextImage}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg"
                            >
                              <IconChevronRight className="h-5 w-5" />
                            </button>
                            
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                              {selectedListing.images && selectedListing.images.map((_, index) => (
                                <button
                                  key={index}
                                  onClick={() => setCurrentImageIndex(index)}
                                  className={`w-2 h-2 rounded-full ${
                                    index === currentImageIndex ? "bg-white" : "bg-white bg-opacity-50"
                                  }`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="h-96 bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <IconBuilding className="h-24 w-24 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-2xl font-bold">{selectedListing.title}</h2>
                      <div className="text-3xl font-bold text-blue-600">
                        {formatPrice(selectedListing.price)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-3">{t("crm.sections.database.details")}</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">{t("crm.sections.database.propertyType")}:</span>
                            <span>{selectedListing.property_type || "Не вказано"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">{t("crm.sections.database.listingType")}:</span>
                            <span>{selectedListing.category === "prodazh" || selectedListing.listing_type === "sale" ? t("crm.sections.database.sale") : t("crm.sections.database.rent")}</span>
                          </div>
                          {selectedListing.area && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">{t("crm.sections.database.area")}:</span>
                              <span>{selectedListing.area} м²</span>
                            </div>
                          )}
                          {selectedListing.rooms && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">{t("crm.sections.database.rooms")}:</span>
                              <span>{selectedListing.rooms}</span>
                            </div>
                          )}
                          {selectedListing.floor && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">{t("crm.sections.database.floor")}:</span>
                              <span>{selectedListing.floor}{selectedListing.total_floors ? `/${selectedListing.total_floors}` : ""}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">{t("crm.sections.database.created")}:</span>
                            <span>{formatDate(selectedListing.created_at || selectedListing.parsed_at || new Date().toISOString())}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-3">{t("crm.sections.database.contact")}</h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <IconMapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">
                              {selectedListing.address || selectedListing.location?.address || selectedListing.location?.city || "Адреса не вказана"}
                            </span>
                          </div>
                          {(selectedListing.phone || selectedListing.contact_info?.phone) && (
                            <div className="flex items-center gap-2">
                              <IconPhone className="h-4 w-4 text-gray-400" />
                              <a href={`tel:${selectedListing.phone || selectedListing.contact_info?.phone}`} className="text-sm text-blue-600 hover:underline">
                                {selectedListing.phone || selectedListing.contact_info?.phone}
                              </a>
                            </div>
                          )}
                          {(selectedListing.contact_person || selectedListing.contact_info?.name) && (
                            <div className="text-sm">
                              <span className="text-gray-600 dark:text-gray-400">{t("crm.sections.database.contactPerson")}: </span>
                              <span>{selectedListing.contact_person || selectedListing.contact_info?.name}</span>
                            </div>
                          )}
                          {(selectedListing.url || (typeof selectedListing.source === 'object' && selectedListing.source?.url)) && (
                            <div className="flex items-center gap-2">
                              <IconExternalLink className="h-4 w-4 text-gray-400" />
                              <a
                                href={selectedListing.url || (typeof selectedListing.source === 'object' ? selectedListing.source?.url : '')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline"
                              >
                                {t("crm.sections.database.viewOriginal")}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {selectedListing.description && (
                      <div className="mt-6">
                        <h3 className="font-semibold mb-3">{t("crm.sections.database.description")}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                          {selectedListing.description}
                        </p>
                      </div>
                    )}
                    
                    {selectedListing.features && Array.isArray(selectedListing.features) && selectedListing.features.length > 0 && (
                      <div className="mt-6">
                        <h3 className="font-semibold mb-3">{t("crm.sections.database.features")}</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedListing.features.map((feature: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm dark:bg-blue-900 dark:text-blue-200"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p>{t("crm.sections.database.notFound")}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Модальне вікно підтвердження */}
      <AnimatePresence>
        {showConfirmDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowConfirmDialog(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900">
                  <IconAlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold">
                  {showConfirmDialog.action === 'delete' ? 'Видалити оголошення' : 'Конвертувати оголошення'}
                </h3>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                {showConfirmDialog.action === 'delete' 
                  ? `Ви впевнені, що хочете видалити оголошення "${showConfirmDialog.title}"? Цю дію неможливо відмінити.`
                  : `Ви хочете конвертувати оголошення "${showConfirmDialog.title}" в повноцінний об'єкт нерухомості?`
                }
              </p>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowConfirmDialog(null)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  Скасувати
                </button>
                <button
                  onClick={() => {
                    if (showConfirmDialog.action === 'delete') {
                      handleDeleteListing(showConfirmDialog.id);
                    } else {
                      handleConvertListing(showConfirmDialog.id);
                    }
                  }}
                  disabled={isProcessing === showConfirmDialog.id}
                  className={`px-4 py-2 text-sm text-white rounded-md disabled:opacity-50 ${
                    showConfirmDialog.action === 'delete' 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  {isProcessing === showConfirmDialog.id ? 'Обробка...' : 
                   showConfirmDialog.action === 'delete' ? 'Видалити' : 'Конвертувати'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 