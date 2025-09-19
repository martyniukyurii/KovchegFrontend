"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconX,
  IconMapPin,
  IconRuler,
  IconHome,
  IconCurrencyDollar,
  IconCalendar,
  IconPhoto,
  IconTag,
  IconBuildingSkyscraper,
  IconBuildingStore,
  IconBuildingWarehouse,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";

import { useTranslation } from "@/hooks/useTranslation";
import type { Property, PropertyType } from "@/types";

interface PropertyViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function PropertyViewModal({
  isOpen,
  onClose,
  property,
  onEdit,
  onDelete,
}: PropertyViewModalProps) {
  const { t } = useTranslation();

  if (!isOpen || !property) return null;

  // Функція для отримання іконки типу нерухомості
  const getTypeIcon = (type: PropertyType) => {
    switch (type) {
      case "apartment":
        return (
          <IconBuildingSkyscraper className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        );
      case "house":
        return (
          <IconHome className="h-6 w-6 text-green-600 dark:text-green-400" />
        );
      case "commercial":
        return (
          <IconBuildingStore className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        );
      case "land":
        return (
          <IconBuildingWarehouse className="h-6 w-6 text-orange-600 dark:text-orange-400" />
        );
      default:
        return <IconHome className="h-6 w-6" />;
    }
  };

  // Функція для отримання тексту типу нерухомості
  const getTypeText = (type: PropertyType) => {
    return t(`crm.properties.types.${type}`);
  };

  // Функція для форматування дати
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  // Функція для форматування ціни
  const formatPrice = (price: { amount: number; currency: string } | number) => {
    if (typeof price === 'number') {
      return `${price.toLocaleString("uk-UA")} USD`;
    }
    return `${price.amount.toLocaleString("uk-UA")} ${price.currency}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              {getTypeIcon(property.property_type)}
              <div>
                <h2 className="text-xl font-semibold">{property.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {getTypeText(property.property_type)} • {property.transaction_type === 'sale' ? 'Продаж' : 'Оренда'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400"
                  title="Редагувати"
                >
                  <IconEdit className="h-5 w-5" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500 dark:text-red-400"
                  title="Видалити"
                >
                  <IconTrash className="h-5 w-5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <IconX className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* Основна інформація */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <IconCurrencyDollar className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Ціна</span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {formatPrice(property.price)}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <IconRuler className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Площа</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {property.area} м²
                </p>
              </div>

              {property.rooms && (
                <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <IconHome className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">Кімнати</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">
                    {property.rooms}
                  </p>
                </div>
              )}
            </div>

            {/* Локація */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <IconMapPin className="h-5 w-5 text-red-600" />
                <span className="font-medium text-lg">Локація</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg">
                <p className="font-medium">{property.location.city}</p>
                <p className="text-gray-600 dark:text-gray-400">{property.location.address}</p>
                {property.location.coordinates && (
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Координати: {property.location.coordinates.lat}, {property.location.coordinates.lon}
                  </p>
                )}
              </div>
            </div>

            {/* Опис */}
            {property.description && (
              <div className="mb-6">
                <h3 className="font-medium text-lg mb-3">Опис</h3>
                <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {property.description}
                  </p>
                </div>
              </div>
            )}

            {/* Особливості */}
            {property.features && property.features.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <IconTag className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-lg">Особливості</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {property.features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Зображення */}
            {property.images && property.images.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <IconPhoto className="h-5 w-5 text-indigo-600" />
                  <span className="font-medium text-lg">Зображення ({property.images.length})</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {property.images.map((image, index) => (
                    <div key={index} className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`Зображення ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/img/placeholder.jpg";
                        }}
                        onClick={() => window.open(image, '_blank')}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Мета-інформація */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex items-center gap-2 mb-3">
                <IconCalendar className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-lg">Інформація</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">ID об'єкта:</span>
                  <p className="font-mono text-xs text-gray-600 dark:text-gray-300">{property._id}</p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Статус:</span>
                  <p className="capitalize">{property.status}</p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Дата створення:</span>
                  <p>{formatDate(property.created_at)}</p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Останнє оновлення:</span>
                  <p>{formatDate(property.updated_at)}</p>
                </div>
                {property.owner_id && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Власник:</span>
                    <p className="font-mono text-xs text-gray-600 dark:text-gray-300">{property.owner_id}</p>
                  </div>
                )}
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Рекомендований:</span>
                  <p>{property.is_featured ? 'Так' : 'Ні'}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
} 