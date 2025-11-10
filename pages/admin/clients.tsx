import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DefaultLayout from '@/layouts/default';

interface Client {
  _id: string;
  type: 'buyer' | 'seller';
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  notes?: string;
  budget_min?: number;
  budget_max?: number;
  preferred_property_types?: string[];
  preferred_locations?: string[];
  agent_id: string;
  agent_name: string;
  created_at: string;
  updated_at: string;
}

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [filter, setFilter] = useState<'all' | 'buyer' | 'seller'>('all');
  const [adminInfo, setAdminInfo] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    type: 'buyer' as 'buyer' | 'seller',
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    notes: '',
    budget_min: 0,
    budget_max: 0,
    preferred_property_types: [] as string[],
    preferred_locations: [] as string[],
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

    fetchClients();
  }, [router]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const adminInfoStr = localStorage.getItem('admin_info');
      const admin = adminInfoStr ? JSON.parse(adminInfoStr) : null;
      
      let url = '/api/admin/clients';
      
      if (admin) {
        url += `?agent_id=${admin.id}&role=${admin.role}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setClients(data.data);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const adminInfoStr = localStorage.getItem('admin_info');
      const admin = adminInfoStr ? JSON.parse(adminInfoStr) : null;
      
      const clientData = {
        ...formData,
        agent_id: admin?.id || '',
        agent_name: `${admin?.first_name || ''} ${admin?.last_name || ''}`.trim(),
        ...(editingClient && { _id: editingClient._id }),
      };

      const response = await fetch('/api/admin/clients', {
        method: editingClient ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });

      const data = await response.json();

      if (data.success) {
        setShowModal(false);
        setEditingClient(null);
        resetForm();
        fetchClients();
      }
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      type: client.type,
      first_name: client.first_name,
      last_name: client.last_name,
      phone: client.phone,
      email: client.email || '',
      notes: client.notes || '',
      budget_min: client.budget_min || 0,
      budget_max: client.budget_max || 0,
      preferred_property_types: client.preferred_property_types || [],
      preferred_locations: client.preferred_locations || [],
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ви впевнені, що хочете видалити цього клієнта?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/clients?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchClients();
      }
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'buyer',
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      notes: '',
      budget_min: 0,
      budget_max: 0,
      preferred_property_types: [],
      preferred_locations: [],
    });
  };

  const filteredClients = filter === 'all' 
    ? clients 
    : clients.filter(c => c.type === filter);

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  👥 Клієнти
                </h1>
                <p className="text-gray-400">Управління покупцями та продавцями</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    resetForm();
                    setEditingClient(null);
                    setShowModal(true);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition"
                >
                  + Додати клієнта
                </button>
                <button
                  onClick={() => router.push('/admin/dashboard')}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition"
                >
                  ← Назад
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <div className="flex gap-4 items-center">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Всі ({clients.length})
              </button>
              <button
                onClick={() => setFilter('buyer')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'buyer'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🛒 Покупці ({clients.filter(c => c.type === 'buyer').length})
              </button>
              <button
                onClick={() => setFilter('seller')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'seller'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                💼 Продавці ({clients.filter(c => c.type === 'seller').length})
              </button>
            </div>
          </div>

          {/* Clients List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="text-gray-400 mt-4">Завантаження...</p>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="bg-gray-800 rounded-lg shadow-lg p-12 text-center">
              <p className="text-gray-400 text-lg">Клієнтів не знайдено</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredClients.map((client) => (
                <div
                  key={client._id}
                  className="bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-gray-700 hover:border-gray-600 transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-white">
                          {client.first_name} {client.last_name}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          client.type === 'buyer' 
                            ? 'bg-green-600/20 text-green-400' 
                            : 'bg-purple-600/20 text-purple-400'
                        }`}>
                          {client.type === 'buyer' ? '🛒 Покупець' : '💼 Продавець'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">📞 Телефон:</p>
                          <p className="text-white font-medium">{client.phone}</p>
                        </div>
                        {client.email && (
                          <div>
                            <p className="text-gray-400">📧 Email:</p>
                            <p className="text-white font-medium">{client.email}</p>
                          </div>
                        )}
                        {client.budget_min && client.budget_max && (
                          <div>
                            <p className="text-gray-400">💰 Бюджет:</p>
                            <p className="text-white font-medium">
                              ${client.budget_min.toLocaleString()} - ${client.budget_max.toLocaleString()}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-gray-400">👤 Рієлтор:</p>
                          <p className="text-white font-medium">{client.agent_name}</p>
                        </div>
                      </div>

                      {client.notes && (
                        <div className="mt-3 p-3 bg-gray-700/50 rounded">
                          <p className="text-xs text-gray-400 mb-1">Примітки:</p>
                          <p className="text-sm text-gray-300">{client.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(client)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm"
                      >
                        ✏️ Редагувати
                      </button>
                      <button
                        onClick={() => handleDelete(client._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition text-sm"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    {editingClient ? 'Редагувати клієнта' : 'Додати клієнта'}
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Тип *
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="type"
                            value="buyer"
                            checked={formData.type === 'buyer'}
                            onChange={(e) => setFormData({ ...formData, type: 'buyer' })}
                            className="w-4 h-4"
                          />
                          <span className="text-white">🛒 Покупець</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="type"
                            value="seller"
                            checked={formData.type === 'seller'}
                            onChange={(e) => setFormData({ ...formData, type: 'seller' })}
                            className="w-4 h-4"
                          />
                          <span className="text-white">💼 Продавець</span>
                        </label>
                      </div>
                    </div>

                    {/* Name */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Ім'я *
                        </label>
                        <input
                          type="text"
                          value={formData.first_name}
                          onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Прізвище *
                        </label>
                        <input
                          type="text"
                          value={formData.last_name}
                          onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Contacts */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Телефон *
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                          placeholder="+380..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Budget (for buyers) */}
                    {formData.type === 'buyer' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Мін. бюджет ($)
                          </label>
                          <input
                            type="number"
                            value={formData.budget_min}
                            onChange={(e) => setFormData({ ...formData, budget_min: Number(e.target.value) })}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Макс. бюджет ($)
                          </label>
                          <input
                            type="number"
                            value={formData.budget_max}
                            onChange={(e) => setFormData({ ...formData, budget_max: Number(e.target.value) })}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Примітки
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Додаткова інформація про клієнта..."
                      />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition"
                      >
                        {editingClient ? 'Зберегти зміни' : 'Додати клієнта'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowModal(false);
                          setEditingClient(null);
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
        </div>
      </div>
    </DefaultLayout>
  );
}

