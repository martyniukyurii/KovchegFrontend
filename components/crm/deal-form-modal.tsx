'use client';

import React, { useState, useEffect } from 'react';
import { IconX, IconLoader } from '@tabler/icons-react';
import { Deal, CreateDealRequest, UpdateDealRequest } from '@/lib/api-client';
import { useUsers } from '@/hooks/useUsers';
import { useProperties } from '@/hooks/useProperties';

interface DealFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (deal: CreateDealRequest | UpdateDealRequest) => void;
  deal?: Deal | null;
  isLoading?: boolean;
}

export default function DealFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  deal = null, 
  isLoading = false 
}: DealFormModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'sale' as 'sale' | 'rent' | 'purchase',
    status: 'active' as 'active' | 'pending' | 'completed' | 'cancelled' | 'on_hold',
    priority: 'medium' as 'low' | 'medium' | 'high',
    client_id: '',
    property_id: '',
    price: '',
    commission: '',
    description: '',
    notes: '',
    expected_close_date: '',
    responsible_agent: ''
  });

  const { users, fetchUsers } = useUsers();
  const { properties, fetchProperties } = useProperties();

  useEffect(() => {
    if (isOpen) {
      // Завантажуємо користувачів та об'єкти при відкритті модалки
      if (users.length === 0) {
        fetchUsers();
      }
      if (properties.length === 0) {
        console.log('🏠 Завантажуємо нерухомість агента...');
        fetchProperties();
      } else {
        console.log('✅ Нерухомість вже завантажена:', properties.length, 'об\'єктів');
      }

      // Якщо редагуємо існуючу угоду
      if (deal) {
        const apiDeal = deal as any;
        setFormData({
          title: deal.title || '',
          type: apiDeal.type || deal.deal_type || 'sale',
          status: deal.status || 'active',
          priority: deal.priority || 'medium',
          client_id: deal.client_id || '',
          property_id: deal.property_id || '',
          price: (apiDeal.price || deal.value || 0).toString(),
          commission: (apiDeal.commission || '').toString(),
          description: deal.description || '',
          notes: apiDeal.notes || '',
          expected_close_date: apiDeal.expected_close_date || deal.expected_close_date || '',
          responsible_agent: deal.responsible_agent || ''
        });
      } else {
        // Скидаємо форму для нової угоди
        setFormData({
          title: '',
          type: 'sale',
          status: 'active',
          priority: 'medium',
          client_id: '',
          property_id: '',
          price: '',
          commission: '',
          description: '',
          notes: '',
          expected_close_date: '',
          responsible_agent: ''
        });
      }
    }
  }, [isOpen, deal, users.length, properties.length, fetchUsers, fetchProperties]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валідація
    if (!formData.type) {
      alert("Поле 'Тип угоди' є обов'язковим");
      return;
    }
    
    if (!formData.client_id) {
      alert("Поле 'Клієнт' є обов'язковим");
      return;
    }
    
    if (!formData.property_id) {
      alert("Поле 'Об'єкт нерухомості' є обов'язковим");
      return;
    }
    
    const dealData = {
      title: formData.title,
      type: formData.type, // Змінюємо deal_type на type
      status: formData.status,
      priority: formData.priority,
      client_id: formData.client_id,
      property_id: formData.property_id,
      price: parseFloat(formData.price) || 0, // Змінюємо value на price
      commission: parseFloat(formData.commission) || 0,
      description: formData.description,
      notes: formData.notes,
      expected_close_date: formData.expected_close_date,
      // Не передаємо responsible_agent - він встановлюється автоматично з токена
    };

    console.log('🚀 Відправляємо дані угоди:', dealData);
    console.log('📋 Доступні об\'єкти нерухомості:', properties);
    console.log('👥 Доступні клієнти:', users);
    console.log('💡 Form data before submit:', formData);

    onSubmit(dealData as CreateDealRequest);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Заголовок */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            {deal ? 'Редагувати угоду' : 'Нова угода'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
          >
            <IconX className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {/* Назва угоди */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Назва угоди
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Тип та статус */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Тип угоди
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option key="sale" value="sale">Продаж</option>
                <option key="rent" value="rent">Оренда</option>
                <option key="purchase" value="purchase">Покупка</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Статус
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option key="active" value="active">Активна</option>
                <option key="pending" value="pending">Очікування</option>
                <option key="completed" value="completed">Завершена</option>
                <option key="cancelled" value="cancelled">Скасована</option>
              </select>
            </div>
          </div>

          {/* Пріоритет */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Пріоритет
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option key="low" value="low">Низький</option>
              <option key="medium" value="medium">Середній</option>
              <option key="high" value="high">Високий</option>
            </select>
          </div>

          {/* Клієнт */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Клієнт
            </label>
            <select
              name="client_id"
              value={formData.client_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            >
              <option key="" value="">Оберіть клієнта</option>
              {users.map((user: any) => (
                <option key={user._id} value={user._id}>
                  {user.first_name} {user.last_name} ({user.phone})
                </option>
              ))}
            </select>
          </div>

          {/* Нерухомість */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Об'єкт нерухомості
            </label>
            <select
              name="property_id"
              value={formData.property_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            >
              <option key="" value="">Оберіть об'єкт</option>
              {properties.map((property: any) => (
                <option key={property._id} value={property._id}>
                  {property.title} - {property.city} ({property.price} {property.currency})
                </option>
              ))}
            </select>
          </div>

          {/* Ціна та комісія */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ціна (UAH)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Комісія (UAH)
              </label>
              <input
                type="number"
                name="commission"
                value={formData.commission}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Очікувана дата закриття */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Очікувана дата закриття
            </label>
            <input
              type="date"
              name="expected_close_date"
              value={formData.expected_close_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Опис */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Опис
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Примітки */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Примітки
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Кнопки */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 text-center"
            >
              Скасувати
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <IconLoader className="h-4 w-4 animate-spin" />}
              {deal ? 'Зберегти' : 'Створити'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}