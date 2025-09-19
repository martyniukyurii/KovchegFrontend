"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconX,
  IconLoader,
  IconUser,
  IconPhone,
  IconMail,
  IconMapPin,
  IconNotes,
  IconArrowLeft,
} from "@tabler/icons-react";

import { useTranslation } from "@/hooks/useTranslation";
import { useUsers } from "@/hooks/useUsers";
import { CreateUserRequest, User } from "@/lib/api-client";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated?: (user: User) => void;
  onBack?: () => void;
}

export function CreateUserModal({
  isOpen,
  onClose,
  onUserCreated,
  onBack,
}: CreateUserModalProps) {
  const { t } = useTranslation();
  const { createUser } = useUsers();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Стани форми
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    type: "individual" as "individual" | "company",
    address: "",
    notes: "",
    tags: [] as string[],
  });

  const [newTag, setNewTag] = useState("");

  // Обробка зміни полів форми
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Додавання тегу
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  // Видалення тегу
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  // Валідація форми
  const validateForm = (): string | null => {
    if (!formData.first_name.trim()) return "Ім'я є обов'язковим";
    if (!formData.last_name.trim()) return "Прізвище є обов'язковим";
    if (!formData.phone.trim()) return "Телефон є обов'язковим";
    
    // Проста валідація телефону
    const phoneRegex = /^\+380\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      return "Телефон повинен бути у форматі +380XXXXXXXXX";
    }
    
    // Валідація email якщо він вказаний
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return "Невірний формат email";
    }
    
    return null;
  };

  // Очищення форми
  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      type: "individual",
      address: "",
      notes: "",
      tags: [],
    });
    setNewTag("");
    setError(null);
    setSuccess(null);
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
      const userData: CreateUserRequest = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim(),
        type: formData.type,
        address: formData.address.trim() || undefined,
        notes: formData.notes.trim() || undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        status: "active",
        priority: "medium",
      };
      
      const result = await createUser(userData);
      
      if (result) {
        setSuccess("Користувач успішно створений!");
        setTimeout(() => {
          onUserCreated?.(result);
          resetForm();
          onClose();
        }, 1500);
      }
    } catch (error: any) {
      setError(error.message || "Сталася помилка при створенні користувача");
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
          className="relative w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] mx-2 sm:mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <IconArrowLeft className="h-5 w-5" />
                </button>
              )}
              <h2 className="text-lg sm:text-xl font-semibold">Створити користувача</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <IconX className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-140px)] sm:max-h-[calc(90vh-140px)]">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Основна інформація */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Ім'я *
                  </label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange("first_name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    placeholder="Олександр"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Прізвище *
                  </label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange("last_name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    placeholder="Ковальчук"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <IconPhone className="inline h-4 w-4 mr-1" />
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    placeholder="+380501234567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <IconMail className="inline h-4 w-4 mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    placeholder="example@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Тип клієнта
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  >
                    <option value="individual">Фізична особа</option>
                    <option value="company">Юридична особа</option>
                  </select>
                </div>
              </div>

              {/* Адреса */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <IconMapPin className="inline h-4 w-4 mr-1" />
                  Адреса
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  placeholder="вул. Хрещатик, 10, кв. 5, Київ"
                />
              </div>

              {/* Нотатки */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <IconNotes className="inline h-4 w-4 mr-1" />
                  Нотатки
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  placeholder="Додаткова інформація про клієнта..."
                />
              </div>

              {/* Теги */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Теги
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    placeholder="Наприклад: покупець, преміум"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Додати
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <IconX className="h-3 w-3" />
                      </button>
                    </span>
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
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-center"
                  disabled={isLoading}
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  className="w-full sm:flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading && <IconLoader className="h-4 w-4 animate-spin" />}
                  <span className="hidden sm:inline">Створити користувача</span>
                  <span className="sm:hidden">Створити</span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}