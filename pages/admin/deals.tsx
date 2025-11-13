import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DefaultLayout from '@/layouts/default';

interface Client {
  _id: string;
  first_name: string;
  last_name: string;
  phone: string;
  type: 'buyer' | 'seller';
}

interface Property {
  _id: string;
  title: string;
  property_type: string;
  location: { city: string; address: string };
  price: { amount: number; currency: string };
}

interface DealEvent {
  type: 'call' | 'meeting' | 'viewing' | 'payment' | 'note';
  description: string;
  created_at: string;
}

interface Deal {
  _id: string;
  buyer_id: string;
  buyer_name: string;
  seller_id?: string;
  seller_name?: string;
  property_id: string;
  property_title: string;
  status: 'lead' | 'viewing' | 'negotiation' | 'payment' | 'closed' | 'cancelled';
  created_by?: {
    admin_id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  };
  events: DealEvent[];
  created_at: string;
  updated_at: string;
}

export default function DealsPage() {
  const router = useRouter();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [adminInfo, setAdminInfo] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    buyer_id: '',
    seller_id: '',
    property_id: '',
    status: 'lead' as Deal['status'],
  });

  const [eventData, setEventData] = useState({
    type: 'call' as DealEvent['type'],
    description: '',
  });

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin_authenticated');
    if (isAuthenticated !== 'true') {
      router.push('/admin');
      return;
    }

    const adminInfoStr = localStorage.getItem('admin_info');
    if (adminInfoStr) {
      setAdminInfo(JSON.parse(adminInfoStr));
    }

    fetchData();
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const adminInfoStr = localStorage.getItem('admin_info');
      const admin = adminInfoStr ? JSON.parse(adminInfoStr) : null;
      
      // Отримуємо угоди
      let dealsUrl = '/api/admin/deals';
      if (admin) {
        dealsUrl += `?agent_id=${admin.id}&role=${admin.role}`;
      }
      const dealsRes = await fetch(dealsUrl);
      const dealsData = await dealsRes.json();
      if (dealsData.success) {
        setDeals(dealsData.data);
      }

      // Отримуємо клієнтів
      let clientsUrl = '/api/admin/clients';
      if (admin) {
        clientsUrl += `?agent_id=${admin.id}&role=${admin.role}`;
      }
      const clientsRes = await fetch(clientsUrl);
      const clientsData = await clientsRes.json();
      if (clientsData.success) {
        setClients(clientsData.data);
      }

      // Отримуємо нерухомість
      let propertiesUrl = '/api/admin/properties?showAll=true';
      if (admin) {
        propertiesUrl += `&admin_id=${admin.id}&role=${admin.role}`;
      }
      const propertiesRes = await fetch(propertiesUrl);
      const propertiesData = await propertiesRes.json();
      if (propertiesData.success) {
        setProperties(propertiesData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const adminInfoStr = localStorage.getItem('admin_info');
      const admin = adminInfoStr ? JSON.parse(adminInfoStr) : null;
      
      const buyer = clients.find(c => c._id === formData.buyer_id);
      const seller = clients.find(c => c._id === formData.seller_id);
      const property = properties.find(p => p._id === formData.property_id);

      const dealData = {
        ...formData,
        buyer_name: buyer ? `${buyer.first_name} ${buyer.last_name}` : '',
        seller_name: seller ? `${seller.first_name} ${seller.last_name}` : '',
        property_title: property?.title || '',
        // Додаємо інформацію про рієлтора (як у нерухомості)
        created_by: admin ? {
          admin_id: admin.id,
          first_name: admin.first_name,
          last_name: admin.last_name || '',
          email: admin.email || '',
          role: admin.role,
        } : undefined,
        events: [],
      };

      const response = await fetch('/api/admin/deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dealData),
      });

      const data = await response.json();

      if (data.success) {
        setShowModal(false);
        resetForm();
        fetchData();
      }
    } catch (error) {
      console.error('Error saving deal:', error);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDeal) return;

    try {
      const response = await fetch('/api/admin/deal-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deal_id: selectedDeal._id,
          event: eventData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowEventModal(false);
        setEventData({ type: 'call', description: '' });
        fetchData();
      }
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleUpdateStatus = async (dealId: string, newStatus: Deal['status']) => {
    try {
      const deal = deals.find(d => d._id === dealId);
      if (!deal) return;

      const response = await fetch('/api/admin/deals', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: dealId,
          status: newStatus,
        }),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      buyer_id: '',
      seller_id: '',
      property_id: '',
      status: 'lead',
    });
  };

  const getStatusColor = (status: Deal['status']) => {
    const colors = {
      lead: 'bg-gray-600',
      viewing: 'bg-blue-600',
      negotiation: 'bg-yellow-600',
      payment: 'bg-orange-600',
      closed: 'bg-green-600',
      cancelled: 'bg-red-600',
    };
    return colors[status] || 'bg-gray-600';
  };

  const getStatusLabel = (status: Deal['status']) => {
    const labels = {
      lead: '📋 Лід',
      viewing: '👁️ Огляд',
      negotiation: '💬 Переговори',
      payment: '💰 Оплата',
      closed: '✅ Закрито',
      cancelled: '❌ Скасовано',
    };
    return labels[status] || status;
  };

  const getEventIcon = (type: DealEvent['type']) => {
    const icons = {
      call: '📞',
      meeting: '🤝',
      viewing: '🏠',
      payment: '💵',
      note: '📝',
    };
    return icons[type] || '📝';
  };

  const buyers = clients.filter(c => c.type === 'buyer');
  const sellers = clients.filter(c => c.type === 'seller');

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-6">
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  🤝 Угоди та події
                </h1>
                <p className="text-gray-400 text-sm sm:text-base">Управління угодами та відстеження подій</p>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition text-sm sm:text-base flex-1 sm:flex-initial"
                >
                  + Нова угода
                </button>
                <button
                  onClick={() => router.push('/admin/dashboard')}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition text-sm sm:text-base flex-1 sm:flex-initial"
                >
                  ← Назад
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-6 gap-4 mb-6">
            <div className="bg-gray-600 rounded-lg p-4 text-center">
              <p className="text-gray-300 text-sm">Всього</p>
              <p className="text-2xl font-bold text-white">{deals.length}</p>
            </div>
            <div className="bg-blue-600 rounded-lg p-4 text-center">
              <p className="text-white text-sm">Огляди</p>
              <p className="text-2xl font-bold text-white">
                {deals.filter(d => d.status === 'viewing').length}
              </p>
            </div>
            <div className="bg-yellow-600 rounded-lg p-4 text-center">
              <p className="text-white text-sm">Переговори</p>
              <p className="text-2xl font-bold text-white">
                {deals.filter(d => d.status === 'negotiation').length}
              </p>
            </div>
            <div className="bg-orange-600 rounded-lg p-4 text-center">
              <p className="text-white text-sm">Оплата</p>
              <p className="text-2xl font-bold text-white">
                {deals.filter(d => d.status === 'payment').length}
              </p>
            </div>
            <div className="bg-green-600 rounded-lg p-4 text-center">
              <p className="text-white text-sm">Закрито</p>
              <p className="text-2xl font-bold text-white">
                {deals.filter(d => d.status === 'closed').length}
              </p>
            </div>
            <div className="bg-red-600 rounded-lg p-4 text-center">
              <p className="text-white text-sm">Скасовано</p>
              <p className="text-2xl font-bold text-white">
                {deals.filter(d => d.status === 'cancelled').length}
              </p>
            </div>
          </div>

          {/* Deals List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="text-gray-400 mt-4">Завантаження...</p>
            </div>
          ) : deals.length === 0 ? (
            <div className="bg-gray-800 rounded-lg shadow-lg p-12 text-center">
              <p className="text-gray-400 text-lg">Угод поки немає</p>
              <p className="text-gray-500 text-sm mt-2">Створіть першу угоду, щоб почати відстежувати процес продажу</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {deals.map((deal) => (
                <div
                  key={deal._id}
                  className="bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-gray-700"
                >
                  {/* Deal Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">
                          {deal.property_title}
                        </h3>
                        <span className={`${getStatusColor(deal.status)} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                          {getStatusLabel(deal.status)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">🛒 Покупець:</p>
                          <p className="text-white font-medium">{deal.buyer_name}</p>
                        </div>
                        {deal.seller_name && (
                          <div>
                            <p className="text-gray-400">💼 Продавець:</p>
                            <p className="text-white font-medium">{deal.seller_name}</p>
                          </div>
                        )}
                        {deal.created_by && (
                          <div>
                            <p className="text-gray-400">👤 Рієлтор:</p>
                            <p className="text-white font-medium">
                              {deal.created_by.first_name} {deal.created_by.last_name}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => {
                          setSelectedDeal(deal);
                          setShowEventModal(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm"
                      >
                        ➕ Подія
                      </button>
                    </div>
                  </div>

                  {/* Status Buttons */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs text-gray-400">Змінити статус:</span>
                    {(['lead', 'viewing', 'negotiation', 'payment', 'closed', 'cancelled'] as Deal['status'][]).map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateStatus(deal._id, status)}
                        disabled={deal.status === status}
                        className={`text-xs px-3 py-1 rounded transition ${
                          deal.status === status
                            ? `${getStatusColor(status)} text-white cursor-default`
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {getStatusLabel(status)}
                      </button>
                    ))}
                  </div>

                  {/* Events Timeline */}
                  {deal.events && deal.events.length > 0 && (
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-3">📅 Історія подій:</h4>
                      <div className="space-y-2">
                        {deal.events.slice().reverse().map((event, index) => (
                          <div key={index} className="flex gap-3 text-sm">
                            <span className="text-xl">{getEventIcon(event.type)}</span>
                            <div className="flex-grow">
                              <p className="text-white">{event.description}</p>
                              <p className="text-xs text-gray-400">
                                {new Date(event.created_at).toLocaleString('uk-UA')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Create Deal Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Нова угода</h2>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Buyer */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Покупець *
                      </label>
                      <select
                        value={formData.buyer_id}
                        onChange={(e) => setFormData({ ...formData, buyer_id: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">-- Оберіть покупця --</option>
                        {buyers.map(buyer => (
                          <option key={buyer._id} value={buyer._id}>
                            {buyer.first_name} {buyer.last_name} ({buyer.phone})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Property */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Нерухомість *
                      </label>
                      <select
                        value={formData.property_id}
                        onChange={(e) => setFormData({ ...formData, property_id: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">-- Оберіть нерухомість --</option>
                        {properties.map(property => (
                          <option key={property._id} value={property._id}>
                            {property.title} - {property.location.city} (${property.price.amount.toLocaleString()})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Seller */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Продавець (опціонально)
                      </label>
                      <select
                        value={formData.seller_id}
                        onChange={(e) => setFormData({ ...formData, seller_id: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">-- Оберіть продавця --</option>
                        {sellers.map(seller => (
                          <option key={seller._id} value={seller._id}>
                            {seller.first_name} {seller.last_name} ({seller.phone})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Початковий статус *
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as Deal['status'] })}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="lead">📋 Лід</option>
                        <option value="viewing">👁️ Огляд</option>
                        <option value="negotiation">💬 Переговори</option>
                        <option value="payment">💰 Оплата</option>
                      </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition"
                      >
                        Створити угоду
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowModal(false);
                          resetForm();
                        }}
                        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition"
                      >
                        Скасувати
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Add Event Modal */}
          {showEventModal && selectedDeal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 rounded-lg shadow-2xl max-w-xl w-full">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Додати подію до угоди
                  </h2>
                  <p className="text-gray-400 mb-4">
                    Угода: <span className="text-white font-medium">{selectedDeal.property_title}</span>
                  </p>

                  <form onSubmit={handleAddEvent} className="space-y-4">
                    {/* Event Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Тип події *
                      </label>
                      <select
                        value={eventData.type}
                        onChange={(e) => setEventData({ ...eventData, type: e.target.value as DealEvent['type'] })}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="call">📞 Дзвінок</option>
                        <option value="meeting">🤝 Зустріч</option>
                        <option value="viewing">🏠 Огляд нерухомості</option>
                        <option value="payment">💵 Оплата</option>
                        <option value="note">📝 Примітка</option>
                      </select>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Опис події *
                      </label>
                      <textarea
                        value={eventData.description}
                        onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        placeholder="Наприклад: Подзвонив клієнту, домовились про огляд на завтра о 14:00"
                      />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition"
                      >
                        Додати подію
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowEventModal(false);
                          setSelectedDeal(null);
                          setEventData({ type: 'call', description: '' });
                        }}
                        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition"
                      >
                        Скасувати
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}

