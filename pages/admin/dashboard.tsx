import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DefaultLayout from '@/layouts/default';

interface Property {
  _id: string;
  title: string;
  description: string;
  property_type: string;
  transaction_type: string;
  price: {
    amount: number;
    currency: string;
  };
  area: number;
  rooms: number;
  location: {
    city: string;
    address: string;
  };
  images: string[];
  status: string;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  created_by?: {
    admin_id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState<'all' | 'sale' | 'rent'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin_authenticated');
    if (isAuthenticated !== 'true') {
      router.push('/admin');
      return;
    }

    fetchProperties();
  }, [showAll, router]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/properties?showAll=${showAll}`);
      const data = await response.json();
      
      if (data.success) {
        setProperties(data.data);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_token');
    router.push('/admin');
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/admin/properties', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: id,
          is_active: !currentStatus,
        }),
      });

      if (response.ok) {
        fetchProperties();
      }
    } catch (error) {
      console.error('Error toggling property:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ви впевнені, що хочете архівувати цю нерухомість?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/properties?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchProperties();
      }
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const getPropertyTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      apartment: 'Квартира',
      house: 'Будинок',
      commercial: 'Комерційна',
      land: 'Земля',
    };
    return types[type] || type;
  };

  const getTransactionTypeLabel = (type: string) => {
    return type === 'sale' ? 'Продаж' : 'Оренда';
  };

  const filteredProperties = properties
    .filter(prop => {
      if (filter === 'all') return true;
      return prop.transaction_type === filter;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      
      if (sortOrder === 'newest') {
        return dateB - dateA; // Новіші спочатку
      } else {
        return dateA - dateB; // Старіші спочатку
      }
    });

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Адміністративна панель
                </h1>
                <p className="text-gray-400">Управління нерухомістю</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => router.push('/admin/add-property')}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition"
                >
                  + Додати нерухомість
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition"
                >
                  Вийти
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Фільтр по типу операції */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Всі
                </button>
                <button
                  onClick={() => setFilter('sale')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === 'sale'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Продаж
                </button>
                <button
                  onClick={() => setFilter('rent')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === 'rent'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Оренда
                </button>
              </div>

              {/* Розділювач */}
              <div className="h-8 w-px bg-gray-600"></div>

              {/* Сортування */}
              <div className="flex gap-2">
                <span className="text-gray-400 self-center text-sm">Сортування:</span>
                <button
                  onClick={() => setSortOrder('newest')}
                  className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                    sortOrder === 'newest'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <span>↓</span>
                  Новіші
                </button>
                <button
                  onClick={() => setSortOrder('oldest')}
                  className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                    sortOrder === 'oldest'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <span>↑</span>
                  Старіші
                </button>
              </div>

              {/* Розділювач */}
              <div className="h-8 w-px bg-gray-600"></div>

              {/* Показати архівні */}
              <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAll}
                  onChange={(e) => setShowAll(e.target.checked)}
                  className="w-5 h-5 rounded"
                />
                <span>Показати архівні</span>
              </label>

              {/* Лічильник */}
              <div className="ml-auto text-gray-300">
                Всього: <span className="font-bold text-white">{filteredProperties.length}</span>
              </div>
            </div>
          </div>

          {/* Properties List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="text-gray-400 mt-4">Завантаження...</p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="bg-gray-800 rounded-lg shadow-lg p-12 text-center">
              <p className="text-gray-400 text-lg">Нерухомість не знайдено</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredProperties.map((property) => (
                <div
                  key={property._id}
                  className={`bg-gray-800 rounded-lg shadow-lg p-6 border-2 ${
                    property.is_active ? 'border-green-500/30' : 'border-red-500/30'
                  }`}
                >
                  <div className="flex gap-6">
                    {/* Image */}
                    <div className="flex-shrink-0">
                      {property.images && property.images.length > 0 ? (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-48 h-32 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-48 h-32 bg-gray-700 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500">Без фото</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">
                            {property.title}
                          </h3>
                          <div className="flex gap-3 text-sm text-gray-400">
                            <span className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded">
                              {getPropertyTypeLabel(property.property_type)}
                            </span>
                            <span className="bg-purple-600/20 text-purple-400 px-2 py-1 rounded">
                              {getTransactionTypeLabel(property.transaction_type)}
                            </span>
                            {property.is_featured && (
                              <span className="bg-yellow-600/20 text-yellow-400 px-2 py-1 rounded">
                                ⭐ Рекомендоване
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-400">
                            ${property.price.amount.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-400">{property.price.currency}</p>
                        </div>
                      </div>

                      <p className="text-gray-300 mb-3 line-clamp-2">
                        {property.description}
                      </p>

                      <div className="flex gap-4 text-sm text-gray-400 mb-4">
                        <span>📍 {property.location.city}</span>
                        <span>📏 {property.area} м²</span>
                        {property.rooms > 0 && <span>🛏️ {property.rooms} кімнат</span>}
                      </div>

                      {/* Інформація про рієлтора */}
                      {property.created_by && (
                        <div className="mb-4 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                          <p className="text-xs text-gray-400 mb-1">Додав:</p>
                          <p className="text-sm font-medium text-white">
                            {property.created_by.first_name} {property.created_by.last_name}
                            {property.created_by.role && (
                              <span className="ml-2 text-xs text-blue-400">
                                ({property.created_by.role === 'admin' ? 'Адмін' : 'Агент'})
                              </span>
                            )}
                          </p>
                          {property.created_by.email && (
                            <p className="text-xs text-gray-400 mt-1">{property.created_by.email}</p>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => router.push(`/admin/edit-property/${property._id}`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm font-medium"
                        >
                          Редагувати
                        </button>
                        <button
                          onClick={() => handleToggleActive(property._id, property.is_active)}
                          className={`${
                            property.is_active
                              ? 'bg-orange-600 hover:bg-orange-700'
                              : 'bg-green-600 hover:bg-green-700'
                          } text-white px-4 py-2 rounded-lg transition text-sm font-medium`}
                        >
                          {property.is_active ? 'Зняти з публікації' : 'Опублікувати'}
                        </button>
                        <button
                          onClick={() => handleDelete(property._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition text-sm font-medium"
                        >
                          В архів
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}

