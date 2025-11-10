import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DefaultLayout from '@/layouts/default';

interface Property {
  _id: string;
  title: string;
  property_type: string;
  transaction_type: string;
  location: {
    city: string;
    address: string;
  };
  created_by?: {
    admin_id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  };
}

interface Agent {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

export default function ManageAgents() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [targetAgent, setTargetAgent] = useState<string>('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin_authenticated');
    const adminInfoStr = localStorage.getItem('admin_info');
    
    if (isAuthenticated !== 'true') {
      router.push('/admin');
      return;
    }

    const adminInfo = adminInfoStr ? JSON.parse(adminInfoStr) : null;
    
    // Тільки власник може заходити на цю сторінку
    if (!adminInfo || adminInfo.role !== 'owner') {
      router.push('/admin/dashboard');
      return;
    }

    fetchData();
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Отримуємо всю нерухомість
      const propertiesRes = await fetch('/api/admin/properties?showAll=true');
      const propertiesData = await propertiesRes.json();
      
      if (propertiesData.success) {
        setProperties(propertiesData.data);
      }

      // Отримуємо список агентів
      const agentsRes = await fetch('/api/admin/agents');
      const agentsData = await agentsRes.json();
      
      if (agentsData.success) {
        setAgents(agentsData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProperty = (propertyId: string) => {
    if (selectedProperties.includes(propertyId)) {
      setSelectedProperties(selectedProperties.filter(id => id !== propertyId));
    } else {
      setSelectedProperties([...selectedProperties, propertyId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedProperties.length === properties.length) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(properties.map(p => p._id));
    }
  };

  const handleTransfer = async () => {
    if (selectedProperties.length === 0) {
      setMessage('⚠️ Оберіть хоча б одну нерухомість');
      return;
    }

    if (!targetAgent) {
      setMessage('⚠️ Оберіть рієлтора');
      return;
    }

    try {
      const response = await fetch('/api/admin/transfer-properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          property_ids: selectedProperties,
          target_agent_id: targetAgent,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`✅ Успішно перенесено ${selectedProperties.length} об'єктів`);
        setSelectedProperties([]);
        setTargetAgent('');
        fetchData();
      } else {
        setMessage(`❌ Помилка: ${data.message}`);
      }
    } catch (error) {
      console.error('Transfer error:', error);
      setMessage('❌ Помилка при перенесенні');
    }
  };

  const getPropertyTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      apartment: 'Квартира',
      house: 'Будинок',
      commercial: 'Комерція',
      land: 'Земля',
    };
    return types[type] || type;
  };

  const getTransactionTypeLabel = (type: string) => {
    return type === 'sale' ? 'Продаж' : 'Оренда';
  };

  // Групуємо нерухомість за рієлторами
  const propertiesByAgent: { [key: string]: Property[] } = {};
  properties.forEach(property => {
    const agentId = property.created_by?.admin_id || 'unassigned';
    if (!propertiesByAgent[agentId]) {
      propertiesByAgent[agentId] = [];
    }
    propertiesByAgent[agentId].push(property);
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
                  👥 Керування рієлторами
                </h1>
                <p className="text-gray-400">Перенесення нерухомості між рієлторами</p>
              </div>
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition"
              >
                ← Назад
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="text-gray-400 mt-4">Завантаження...</p>
            </div>
          ) : (
            <>
              {/* Transfer Panel */}
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-xl font-bold text-white mb-4">Перенести обрані об'єкти</h2>
                
                <div className="flex gap-4 items-end">
                  <div className="flex-grow">
                    <label className="block text-gray-300 mb-2">
                      Обрано: <span className="font-bold text-blue-400">{selectedProperties.length}</span> об'єктів
                    </label>
                  </div>
                  
                  <div className="flex-grow">
                    <label className="block text-gray-300 mb-2">Перенести до рієлтора:</label>
                    <select
                      value={targetAgent}
                      onChange={(e) => setTargetAgent(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Оберіть рієлтора --</option>
                      {agents.map(agent => (
                        <option key={agent._id} value={agent._id}>
                          {agent.first_name} {agent.last_name} ({agent.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleTransfer}
                    disabled={selectedProperties.length === 0 || !targetAgent}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-lg transition"
                  >
                    ✓ Перенести
                  </button>
                </div>

                {message && (
                  <div className={`mt-4 p-3 rounded-lg ${
                    message.startsWith('✅') ? 'bg-green-600/20 text-green-400' : 'bg-orange-600/20 text-orange-400'
                  }`}>
                    {message}
                  </div>
                )}
              </div>

              {/* Properties by Agent */}
              <div className="space-y-6">
                {Object.entries(propertiesByAgent).map(([agentId, agentProperties]) => {
                  const agent = agentId === 'unassigned' 
                    ? null 
                    : agents.find(a => a._id === agentId) || agentProperties[0]?.created_by;

                  return (
                    <div key={agentId} className="bg-gray-800 rounded-lg shadow-lg p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-white">
                          {agent 
                            ? `${agent.first_name} ${agent.last_name}` 
                            : 'Без рієлтора'}
                          <span className="ml-2 text-sm text-gray-400">
                            ({agentProperties.length} об'єктів)
                          </span>
                        </h3>
                        <button
                          onClick={() => {
                            const agentPropertyIds = agentProperties.map(p => p._id);
                            const allSelected = agentPropertyIds.every(id => selectedProperties.includes(id));
                            
                            if (allSelected) {
                              setSelectedProperties(selectedProperties.filter(id => !agentPropertyIds.includes(id)));
                            } else {
                              const uniqueIds = Array.from(new Set([...selectedProperties, ...agentPropertyIds]));
                              setSelectedProperties(uniqueIds);
                            }
                          }}
                          className="text-sm text-blue-400 hover:text-blue-300"
                        >
                          {agentProperties.every(p => selectedProperties.includes(p._id)) 
                            ? '✓ Зняти все' 
                            : 'Обрати все'}
                        </button>
                      </div>

                      <div className="space-y-3">
                        {agentProperties.map(property => (
                          <div
                            key={property._id}
                            className={`flex items-center gap-4 p-4 rounded-lg border-2 transition cursor-pointer ${
                              selectedProperties.includes(property._id)
                                ? 'bg-blue-600/20 border-blue-500'
                                : 'bg-gray-700/50 border-gray-600 hover:border-gray-500'
                            }`}
                            onClick={() => handleSelectProperty(property._id)}
                          >
                            <input
                              type="checkbox"
                              checked={selectedProperties.includes(property._id)}
                              onChange={() => {}}
                              className="w-5 h-5"
                            />
                            
                            <div className="flex-grow">
                              <h4 className="text-white font-medium">{property.title}</h4>
                              <div className="flex gap-2 mt-1">
                                <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded">
                                  {getPropertyTypeLabel(property.property_type)}
                                </span>
                                <span className="text-xs bg-purple-600/20 text-purple-400 px-2 py-1 rounded">
                                  {getTransactionTypeLabel(property.transaction_type)}
                                </span>
                                <span className="text-xs text-gray-400">
                                  📍 {property.location.city}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}

