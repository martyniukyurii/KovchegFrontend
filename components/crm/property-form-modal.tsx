"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconX,
  IconLoader,
  IconMapPin,
  IconRuler,
  IconHome,
  IconCurrencyDollar,
  IconPhoto,
  IconTag,
  IconUpload,
  IconTrash,
  IconUser,
  IconPlus,
} from "@tabler/icons-react";

import { useTranslation } from "@/hooks/useTranslation";
import { useMyProperties } from "@/hooks/useProperties";
import { uploadImageWithCompression, ImageUploadResult } from "@/lib/image-upload";
import { useUsers } from "@/hooks/useUsers";
import { User } from "@/lib/api-client";
import { CreateUserModal } from "./create-user-modal";
import type { 
  Property, 
  PropertyType, 
  TransactionType, 
  CreatePropertyRequest,
  UpdatePropertyRequest 
} from "@/types";

interface PropertyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  property?: Property | null; // Якщо передано - редагування, якщо null - створення
  onSuccess?: () => void;
}

export function PropertyFormModal({
  isOpen,
  onClose,
  property = null,
  onSuccess,
}: PropertyFormModalProps) {
  const { t } = useTranslation();
  const { createProperty, updateProperty } = useMyProperties();
  const { users, fetchUsers } = useUsers();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Стани форми
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    property_type: "apartment" as PropertyType,
    transaction_type: "sale" as TransactionType,
    price: "",
    area: "",
    rooms: "",
    city: "",
    address: "",
    coordinates: {
      lat: "",
      lon: "",
    },
    features: [] as string[],
    images: [] as string[],
  });

  const [newFeature, setNewFeature] = useState("");
  const [newImage, setNewImage] = useState("");
  const [uploadingImages, setUploadingImages] = useState<boolean>(false);
  const [imageUploadProgress, setImageUploadProgress] = useState<{[key: string]: number}>({});
  const [selectedOwner, setSelectedOwner] = useState<User | null>(null);
  const [showOwnerModal, setShowOwnerModal] = useState(false);
  const [ownerSearchTerm, setOwnerSearchTerm] = useState("");
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);

  // Заповнення форми при редагуванні
  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title,
        description: property.description || "",
        property_type: property.property_type,
        transaction_type: property.transaction_type,
        price: property.price.toString(),
        area: property.area.toString(),
        rooms: property.rooms?.toString() || "",
        city: property.location.city,
        address: property.location.address,
        coordinates: {
          lat: property.location.coordinates?.lat?.toString() || "",
          lon: property.location.coordinates?.lon?.toString() || "",
        },
        features: property.features || [],
        images: property.images || [],
      });
    } else {
      // Очищення форми для нового об'єкта
      setFormData({
        title: "",
        description: "",
        property_type: "apartment",
        transaction_type: "sale",
        price: "",
        area: "",
        rooms: "",
        city: "",
        address: "",
        coordinates: { lat: "", lon: "" },
        features: [],
        images: [],
      });
    }
    setError(null);
    setSuccess(null);
  }, [property, isOpen]);

  // Завантаження користувачів при відкритті модалки власника
  useEffect(() => {
    if (showOwnerModal && users.length === 0) {
      fetchUsers();
    }
  }, [showOwnerModal, users.length, fetchUsers]);

  // Обробка зміни полів форми
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Обробка координат
  const handleCoordinateChange = (field: "lat" | "lon", value: string) => {
    setFormData(prev => ({
      ...prev,
      coordinates: {
        ...prev.coordinates,
        [field]: value,
      },
    }));
  };

  // Додавання особливості
  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  // Видалення особливості
  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature),
    }));
  };

  // Додавання зображення
  const addImage = () => {
    if (newImage.trim() && !formData.images.includes(newImage.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage.trim()],
      }));
      setNewImage("");
    }
  };

  // Видалення зображення
  const removeImage = (image: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== image),
    }));
  };

  // Функції для завантаження файлів
  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;

    setUploadingImages(true);
    const filesArray = Array.from(files);
    
    try {
      for (const file of filesArray) {
        const fileKey = `${file.name}-${Date.now()}`;
        setImageUploadProgress(prev => ({ ...prev, [fileKey]: 0 }));

        try {
          const result: ImageUploadResult = await uploadImageWithCompression(file);
          
          // Додаємо URL до списку зображень
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, result.url]
          }));

          setImageUploadProgress(prev => ({ ...prev, [fileKey]: 100 }));
          
          // Видаляємо прогрес після короткої затримки
          setTimeout(() => {
            setImageUploadProgress(prev => {
              const newProgress = { ...prev };
              delete newProgress[fileKey];
              return newProgress;
            });
          }, 1000);
          
        } catch (error: any) {
          console.error('Помилка завантаження файлу:', error);
          setError(`Помилка завантаження ${file.name}: ${error.message}`);
          
          setImageUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileKey];
            return newProgress;
          });
        }
      }
    } finally {
      setUploadingImages(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  // Валідація форми
  const validateForm = (): string | null => {
    if (!formData.title.trim()) return "Назва є обов'язковою";
    if (!formData.property_type) return "Тип нерухомості є обов'язковим";
    if (!formData.transaction_type) return "Тип операції є обов'язковим";
    if (!formData.price || isNaN(Number(formData.price))) return "Ціна повинна бути числом";
    if (!formData.area || isNaN(Number(formData.area))) return "Площа повинна бути числом";
    if (!formData.city.trim()) return "Місто є обов'язковим";
    if (!formData.address.trim()) return "Адреса є обов'язкова";
    return null;
  };

  // Підготовка даних для API
  const prepareApiData = (): CreatePropertyRequest => {
    const baseData: CreatePropertyRequest = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      property_type: formData.property_type,
      transaction_type: formData.transaction_type,
      price: {
        amount: Number(formData.price),
        currency: 'UAH'
      },
      area: Number(formData.area),
      rooms: formData.rooms ? Number(formData.rooms) : undefined,
      city: formData.city.trim(),
      address: formData.address.trim(),
      features: formData.features.length > 0 ? formData.features : undefined,
      images: formData.images.length > 0 ? formData.images : undefined,
    };

    // Додаємо координати якщо вони є
    if (formData.coordinates.lat && formData.coordinates.lon) {
      baseData.coordinates = {
        lat: Number(formData.coordinates.lat),
        lon: Number(formData.coordinates.lon),
      };
    }

    return baseData;
  };

  // Обробка відправки форми
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const apiData = prepareApiData();
      
      if (property) {
        // Оновлення існуючого об'єкта
        const updateData: UpdatePropertyRequest = {
          title: apiData.title,
          description: apiData.description,
          price: apiData.price,
          area: apiData.area,
          rooms: apiData.rooms,
          features: apiData.features,
          images: apiData.images,
        };
        
        const result = await updateProperty(property._id, updateData);
        
        if (result) {
          setSuccess("Об'єкт нерухомості успішно оновлено!");
          setTimeout(() => {
            onSuccess?.();
            onClose();
          }, 1500);
        }
      } else {
        // Створення нового об'єкта
        const result = await createProperty(apiData);
        
        if (result) {
          setSuccess("Об'єкт нерухомості успішно створено!");
          setTimeout(() => {
            onSuccess?.();
            onClose();
          }, 1500);
        }
      }
    } catch (error: any) {
      setError(error.message || "Сталася помилка при збереженні");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

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
            <h2 className="text-xl font-semibold">
              {property ? "Редагувати об'єкт" : "Додати новий об'єкт"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <IconX className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Основна інформація */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Назва об'єкта *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    placeholder="Наприклад: Сучасна 2-кімнатна квартира"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Тип нерухомості *
                  </label>
                  <select
                    value={formData.property_type}
                    onChange={(e) => handleInputChange("property_type", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  >
                    <option value="apartment">Квартира</option>
                    <option value="house">Будинок</option>
                    <option value="commercial">Комерційна</option>
                    <option value="land">Земля</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Тип операції *
                  </label>
                  <select
                    value={formData.transaction_type}
                    onChange={(e) => handleInputChange("transaction_type", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  >
                    <option value="sale">Продаж</option>
                    <option value="rent">Оренда</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <IconCurrencyDollar className="inline h-4 w-4 mr-1" />
                    Ціна * (USD)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    placeholder="150000"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <IconRuler className="inline h-4 w-4 mr-1" />
                    Площа * (м²)
                  </label>
                  <input
                    type="number"
                    value={formData.area}
                    onChange={(e) => handleInputChange("area", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    placeholder="65"
                    min="0"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <IconHome className="inline h-4 w-4 mr-1" />
                    Кількість кімнат
                  </label>
                  <input
                    type="number"
                    value={formData.rooms}
                    onChange={(e) => handleInputChange("rooms", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    placeholder="2"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <IconMapPin className="inline h-4 w-4 mr-1" />
                    Місто *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    placeholder="Чернівці"
                  />
                </div>
              </div>

              {/* Адреса */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Адреса *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  placeholder="вул. Центральна, 25"
                />
              </div>

              {/* Власник */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <IconUser className="inline h-4 w-4 mr-1" />
                  Власник
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center">
                    {selectedOwner ? (
                      <div className="flex items-center gap-2">
                        <IconUser className="h-4 w-4 text-gray-500" />
                        <span>{selectedOwner.first_name} {selectedOwner.last_name}</span>
                        <span className="text-sm text-gray-500">({selectedOwner.phone})</span>
                        <button
                          type="button"
                          onClick={() => setSelectedOwner(null)}
                          className="ml-auto text-red-500 hover:text-red-700"
                        >
                          <IconX className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500">Оберіть власника</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowOwnerModal(true)}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-2"
                  >
                    <IconUser className="h-4 w-4" />
                    Обрати
                  </button>
                </div>
              </div>

              {/* Координати */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Широта (lat)
                  </label>
                  <input
                    type="number"
                    value={formData.coordinates.lat}
                    onChange={(e) => handleCoordinateChange("lat", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    placeholder="48.2918"
                    step="any"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Довгота (lon)
                  </label>
                  <input
                    type="number"
                    value={formData.coordinates.lon}
                    onChange={(e) => handleCoordinateChange("lon", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    placeholder="25.9358"
                    step="any"
                  />
                </div>
              </div>

              {/* Опис */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Опис
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  placeholder="Детальний опис об'єкта нерухомості..."
                />
              </div>

              {/* Особливості */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <IconTag className="inline h-4 w-4 mr-1" />
                  Особливості
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    placeholder="Наприклад: балкон, ремонт, меблі"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Додати
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(feature)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <IconX className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Зображення */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <IconPhoto className="inline h-4 w-4 mr-1" />
                  Зображення
                </label>
                
                {/* Завантаження файлів */}
                <div 
                  className="mb-4 p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="text-center">
                    <IconUpload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Перетягніть зображення сюди або натисніть для вибору
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                      id="image-upload"
                      disabled={uploadingImages}
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer disabled:opacity-50"
                    >
                      <IconPhoto className="h-4 w-4" />
                      Вибрати файли
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      JPEG, PNG, GIF, WebP до 10MB
                    </p>
                  </div>
                  
                  {/* Прогрес завантаження */}
                  {Object.keys(imageUploadProgress).length > 0 && (
                    <div className="mt-4 space-y-2">
                      {Object.entries(imageUploadProgress).map(([fileKey, progress]) => (
                        <div key={fileKey} className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {progress}%
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Додавання через URL */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Або додайте через URL:</p>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                      placeholder="https://example.com/image.jpg"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
                    />
                    <button
                      type="button"
                      onClick={addImage}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Додати
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Зображення ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/img/placeholder.jpg";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <IconX className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Повідомлення */}
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200">
                  {success}
                </div>
              )}

              {/* Кнопки */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  disabled={isLoading}
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading && <IconLoader className="h-4 w-4 animate-spin" />}
                  {property ? "Зберегти зміни" : "Створити об'єкт"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Модалка вибору власника */}
        {showOwnerModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center z-10"
            onClick={() => setShowOwnerModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 max-h-96"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Оберіть власника</h3>
                <button
                  onClick={() => setShowOwnerModal(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <IconX className="h-5 w-5" />
                </button>
              </div>

              {/* Пошук */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Пошук за ім'ям або телефоном..."
                  value={ownerSearchTerm}
                  onChange={(e) => setOwnerSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                />
              </div>

              {/* Список користувачів */}
              <div className="max-h-48 overflow-y-auto">
                {users
                  .filter(user => 
                    ownerSearchTerm === '' ||
                    `${user.first_name} ${user.last_name}`.toLowerCase().includes(ownerSearchTerm.toLowerCase()) ||
                    user.phone.includes(ownerSearchTerm)
                  )
                  .map(user => (
                    <div
                      key={user.id}
                      onClick={() => {
                        setSelectedOwner(user);
                        setShowOwnerModal(false);
                        setOwnerSearchTerm('');
                      }}
                      className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                    >
                      <IconUser className="h-8 w-8 text-gray-500" />
                      <div>
                        <p className="font-medium">{user.first_name} {user.last_name}</p>
                        <p className="text-sm text-gray-500">{user.phone}</p>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Кнопка створення нового користувача */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setShowOwnerModal(false);
                    setShowCreateUserModal(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <IconPlus className="h-4 w-4" />
                  Створити нового власника
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Модалка створення користувача */}
        <CreateUserModal
          isOpen={showCreateUserModal}
          onClose={() => setShowCreateUserModal(false)}
          onBack={() => {
            setShowCreateUserModal(false);
            setShowOwnerModal(true);
          }}
          onUserCreated={(user) => {
            setSelectedOwner(user);
            setShowCreateUserModal(false);
          }}
        />
      </div>
    </AnimatePresence>
  );
} 