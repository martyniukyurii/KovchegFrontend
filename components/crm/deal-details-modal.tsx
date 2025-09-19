import React, { useState, useEffect } from 'react';
import { IconX, IconPlus, IconPhone, IconHome, IconCalendar, IconMail, IconMessage } from '@tabler/icons-react';
import { useDeals, useActivityJournal } from '@/hooks/useDeals';
import { useUsers } from '@/hooks/useUsers';
import { useProperties } from '@/hooks/useProperties';
import { Deal, ActivityJournalEntry, CreateActivityJournalRequest } from '@/lib/api-client';

interface DealDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: Deal | null;
}

const DealDetailsModal: React.FC<DealDetailsModalProps> = ({ isOpen, onClose, deal }) => {
  const [showAddActivityForm, setShowAddActivityForm] = useState(false);
  const [activityFormData, setActivityFormData] = useState({
    code: '',
    description: '',
    notes: '',
    activity_date: new Date().toISOString().split('T')[0],
  });

  // Хуки для роботи з API
  const { users } = useUsers();
  const { properties } = useProperties();
  const { 
    entries: activityJournal, 
    activityCodes, 
    loading: activityLoading, 
    fetchActivityJournal, 
    fetchActivityCodes,
    createActivityEntry,
    clearEntries
  } = useActivityJournal();

  // Завантажуємо журнал активності та коди при відкритті модалки
  useEffect(() => {
    if (isOpen && deal) {
      const dealId = (deal as any)._id || deal.id;
      console.log('📋 Завантажуємо журнал активності для угоди:', dealId);
      console.log('🔍 Угода:', deal);
      // Очищуємо попередні записи перед завантаженням нових
      clearEntries();
      fetchActivityJournal({ deal_id: dealId });
      fetchActivityCodes();
    }
  }, [isOpen, deal, fetchActivityJournal, fetchActivityCodes, clearEntries]);

  // Функції для отримання назв
  const getUserName = (userId: string) => {
    const user = users.find((u: any) => u._id === userId || u.id === userId);
    return user ? `${user.first_name} ${user.last_name}` : 'Невідомий клієнт';
  };

  const getPropertyInfo = (propertyId: string) => {
    const property = properties.find((p: any) => p._id === propertyId || p.id === propertyId);
    return property ? {
      title: property.title,
      city: (property as any).city,
      price: (property as any).price,
      currency: (property as any).currency,
      address: (property as any).address
    } : null;
  };

  // Обробка додавання нової активності
  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deal || !activityFormData.code || !activityFormData.description) {
      alert('Заповніть усі обов\'язкові поля');
      return;
    }

    try {
      const dealId = (deal as any)._id || deal.id;
      const activityData: CreateActivityJournalRequest = {
        deal_id: dealId,
        event_type: activityFormData.code,
        description: activityFormData.description,
        notes: activityFormData.notes,
        activity_date: activityFormData.activity_date,
        related_object_id: dealId,
        related_object_type: 'deal',
        metadata: {
          contact_method: 'phone', // дефолтні метадані
          duration_minutes: 15,
          client_mood: 'neutral',
          client_interest: 'medium'
        }
      };

      console.log('📝 Відправляємо дані активності:', activityData);
      const newActivity = await createActivityEntry(activityData);
      console.log('✅ Нова активність створена:', newActivity);
      
      // Очищуємо форму
      setActivityFormData({
        code: '',
        description: '',
        notes: '',
        activity_date: new Date().toISOString().split('T')[0],
      });
      
      setShowAddActivityForm(false);
      
      // Оновлюємо журнал
      console.log('🔄 Оновлюємо журнал активності...');
      await fetchActivityJournal({ deal_id: dealId });
      
      alert('Подію додано успішно!');
    } catch (error) {
      console.error('Помилка додавання активності:', error);
      alert('Помилка при додаванні події');
    }
  };

  const handleActivityFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setActivityFormData(prev => ({ ...prev, [name]: value }));
  };

  // Форматування дати
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Іконки для різних типів активності
  const getActivityIcon = (code: string) => {
    if (!code) {
      return <IconMessage className="w-4 h-4 text-gray-500" />;
    }
    
    switch (code.toLowerCase()) {
      case 'client_call':
      case 'client_contact':
        return <IconPhone className="w-4 h-4 text-blue-500" />;
      case 'property_viewing':
      case 'property_virtual_tour':
        return <IconHome className="w-4 h-4 text-green-500" />;
      case 'client_meeting':
        return <IconCalendar className="w-4 h-4 text-purple-500" />;
      case 'client_email':
        return <IconMail className="w-4 h-4 text-orange-500" />;
      case 'payment_received':
        return <IconMessage className="w-4 h-4 text-green-600" />;
      case 'document_signed':
        return <IconMessage className="w-4 h-4 text-blue-600" />;
      case 'deal_status_changed':
        return <IconMessage className="w-4 h-4 text-yellow-600" />;
      case 'task_completed':
        return <IconMessage className="w-4 h-4 text-green-700" />;
      case 'note_added':
        return <IconMessage className="w-4 h-4 text-gray-600" />;
      default:
        return <IconMessage className="w-4 h-4 text-gray-500" />;
    }
  };

  if (!isOpen) return null;
  if (!deal) return null;

  const propertyInfo = getPropertyInfo(deal.property_id || '');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate pr-2">
            Деталі угоди: {deal.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 flex-shrink-0"
          >
            <IconX className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-80px)]">
          {/* Інформація про угоду */}
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Основна інформація */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Основна інформація</h3>
                
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Статус:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                      deal.status === 'active' ? 'bg-green-100 text-green-800' :
                      deal.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      deal.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {deal.status === 'active' ? 'Активна' :
                       deal.status === 'completed' ? 'Завершена' :
                       deal.status === 'cancelled' ? 'Скасована' :
                       deal.status === 'pending' ? 'Очікування' : 'На утриманні'}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Тип:</span>
                    <span className="ml-2 text-sm text-gray-900 dark:text-white">
                      {(deal as any).type === 'sale' ? 'Продаж' :
                       (deal as any).type === 'rent' ? 'Оренда' : 'Покупка'}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Пріоритет:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                      deal.priority === 'high' ? 'bg-red-100 text-red-800' :
                      deal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {deal.priority === 'high' ? 'Високий' :
                       deal.priority === 'medium' ? 'Середній' : 'Низький'}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Ціна:</span>
                    <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
                      {(deal as any).price?.toLocaleString()} {(deal as any).currency || 'UAH'}
                    </span>
                  </div>
                  
                  {(deal as any).commission && (
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Комісія:</span>
                      <span className="ml-2 text-sm text-gray-900 dark:text-white">
                        {(deal as any).commission}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Клієнт та нерухомість */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Клієнт та об'єкт</h3>
                
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Клієнт:</span>
                    <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                      {getUserName(deal.client_id || '')}
                    </span>
                  </div>
                  
                  {propertyInfo && (
                    <div className="space-y-1">
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Об'єкт:</span>
                        <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                          {propertyInfo.title}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Місто:</span>
                        <span className="ml-2 text-sm text-gray-900 dark:text-white">
                          {propertyInfo.city}
                        </span>
                      </div>
                      {propertyInfo.address && (
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Адреса:</span>
                          <span className="ml-2 text-sm text-gray-900 dark:text-white">
                            {propertyInfo.address}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Очікувана дата закриття:</span>
                    <span className="ml-2 text-sm text-gray-900 dark:text-white">
                      {deal.expected_close_date ? 
                        new Date(deal.expected_close_date).toLocaleDateString('uk-UA') : 
                        'Не вказано'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Опис та нотатки */}
            {(deal.description || deal.notes) && (
              <div className="mt-6 space-y-2">
                {deal.description && (
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 block">Опис:</span>
                    <p className="text-sm text-gray-900 dark:text-white mt-1">{deal.description}</p>
                  </div>
                )}
                {deal.notes && (
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 block">Нотатки:</span>
                    <p className="text-sm text-gray-900 dark:text-white mt-1">{deal.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Журнал активності */}
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Журнал активності</h3>
              <button
                onClick={() => setShowAddActivityForm(!showAddActivityForm)}
                className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm w-full sm:w-auto"
              >
                <IconPlus className="w-4 h-4 mr-1" />
                Додати подію
              </button>
            </div>

            {/* Форма додавання активності */}
            {showAddActivityForm && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <form onSubmit={handleAddActivity} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Тип події *
                      </label>
                      <select
                        name="code"
                        value={activityFormData.code}
                        onChange={handleActivityFormChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                        required
                      >
                        <option value="">Оберіть тип події</option>
                        <option value="client_call">Телефонний дзвінок</option>
                        <option value="client_contact">Контакт з клієнтом</option>
                        <option value="client_meeting">Зустріч з клієнтом</option>
                        <option value="client_email">Email листування</option>
                        <option value="property_viewing">Огляд нерухомості</option>
                        <option value="property_virtual_tour">Віртуальний тур</option>
                        <option value="payment_received">Отримання платежу</option>
                        <option value="document_signed">Підписання документа</option>
                        <option value="deal_status_changed">Зміна статусу угоди</option>
                        <option value="task_completed">Виконання завдання</option>
                        <option value="note_added">Додавання нотатки</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Дата події
                      </label>
                      <input
                        type="date"
                        name="activity_date"
                        value={activityFormData.activity_date}
                        onChange={handleActivityFormChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Опис події *
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={activityFormData.description}
                      onChange={handleActivityFormChange}
                      placeholder="Наприклад: Показав квартиру, клієнт зацікавлений"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Додаткові нотатки
                    </label>
                    <textarea
                      name="notes"
                      value={activityFormData.notes}
                      onChange={handleActivityFormChange}
                      rows={3}
                      placeholder="Додаткова інформація про подію..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddActivityForm(false)}
                      className="w-full sm:w-auto px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-center"
                    >
                      Скасувати
                    </button>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Додати подію
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Список активності */}
            {activityLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Завантаження...</p>
              </div>
            ) : activityJournal && activityJournal.length > 0 ? (
              <div className="space-y-3">
                {activityJournal.map((entry: ActivityJournalEntry, index: number) => (
                  <div
                    key={(entry as any)._id || entry.id || `activity-${index}`}
                    className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {getActivityIcon((entry as any).code || 'other')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {entry.description}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate((entry as any).activity_date || entry.created_at)}
                        </span>
                      </div>
                      {(entry as any).notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {(entry as any).notes}
                        </p>
                      )}
                      <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="capitalize">{(entry as any).code || 'Подія'}</span>
                        {entry.created_by && (
                          <>
                            <span className="mx-1">•</span>
                            <span>{getUserName(entry.created_by)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <IconMessage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ще немає записів в журналі активності
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Додайте першу подію, щоб розпочати відстеження
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealDetailsModal;