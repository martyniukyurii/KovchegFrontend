import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DefaultLayout from '@/layouts/default';

interface CalendarEvent {
  _id: string;
  title: string;
  description?: string;
  type: 'meeting' | 'viewing' | 'call' | 'reminder' | 'other';
  start_date: string;
  end_date: string;
  property_id?: string;
  client_id?: string;
  created_by: {
    admin_id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  };
  attendees?: string[]; // ID інших рієлторів
  created_at: string;
  updated_at: string;
}

interface Agent {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

export default function CalendarPage() {
  const router = useRouter();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'meeting' as CalendarEvent['type'],
    start_date: '',
    end_date: '',
    attendees: [] as string[],
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
  }, [router, currentDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const adminInfoStr = localStorage.getItem('admin_info');
      const admin = adminInfoStr ? JSON.parse(adminInfoStr) : null;
      
      // Отримуємо події
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      let eventsUrl = `/api/admin/calendar?start_date=${startOfMonth.toISOString()}&end_date=${endOfMonth.toISOString()}`;
      if (admin) {
        eventsUrl += `&agent_id=${admin.id}&role=${admin.role}`;
      }
      
      const eventsRes = await fetch(eventsUrl);
      const eventsData = await eventsRes.json();
      if (eventsData.success) {
        setEvents(eventsData.data);
      }

      // Отримуємо список рієлторів (для власника)
      if (admin && admin.role === 'owner') {
        const agentsRes = await fetch('/api/admin/agents');
        const agentsData = await agentsRes.json();
        if (agentsData.success) {
          setAgents(agentsData.data);
        }
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
      
      const eventData = {
        ...formData,
        created_by: admin ? {
          admin_id: admin.id,
          first_name: admin.first_name,
          last_name: admin.last_name || '',
          email: admin.email || '',
          role: admin.role,
        } : undefined,
        ...(editingEvent && { _id: editingEvent._id }),
      };

      const response = await fetch('/api/admin/calendar', {
        method: editingEvent ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      const data = await response.json();

      if (data.success) {
        setShowModal(false);
        setEditingEvent(null);
        resetForm();
        fetchData();
      }
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ви впевнені, що хочете видалити цю подію?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/calendar?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'meeting',
      start_date: '',
      end_date: '',
      attendees: [],
    });
  };

  const getEventIcon = (type: CalendarEvent['type']) => {
    const icons = {
      meeting: '🤝',
      viewing: '🏠',
      call: '📞',
      reminder: '⏰',
      other: '📌',
    };
    return icons[type] || '📌';
  };

  const getEventColor = (type: CalendarEvent['type']) => {
    const colors = {
      meeting: 'bg-blue-600',
      viewing: 'bg-green-600',
      call: 'bg-orange-600',
      reminder: 'bg-yellow-600',
      other: 'bg-gray-600',
    };
    return colors[type] || 'bg-gray-600';
  };

  const getEventTypeLabel = (type: CalendarEvent['type']) => {
    const labels = {
      meeting: 'Зустріч',
      viewing: 'Огляд нерухомості',
      call: 'Дзвінок',
      reminder: 'Нагадування',
      other: 'Інше',
    };
    return labels[type] || type;
  };

  // Генеруємо календарну сітку
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Попередні дні з минулого місяця
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Дні поточного місяця
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getEventsForDay = (date: Date | null) => {
    if (!date) return [];
    
    // Створюємо початок та кінець дня для порівняння
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    
    return events.filter(event => {
      const eventStart = new Date(event.start_date);
      const eventEnd = new Date(event.end_date);
      
      // Подія показується якщо перетинається з цим днем:
      // - початок події <= кінець дня
      // - кінець події >= початок дня
      return eventStart <= dayEnd && eventEnd >= dayStart;
    });
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const monthNames = [
    'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
    'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
  ];

  const dayNames = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-6">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  📅 Календар подій
                </h1>
                <button
                  onClick={() => router.push('/admin/dashboard')}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition text-sm sm:text-base"
                >
                  ← Назад
                </button>
              </div>
              
              {/* Navigation */}
              <div className="flex flex-wrap gap-3 items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={goToPreviousMonth}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    ←
                  </button>
                  <button
                    onClick={goToToday}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Сьогодні
                  </button>
                  <button
                    onClick={goToNextMonth}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    →
                  </button>
                </div>
                
                <h2 className="text-xl font-bold text-white">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                
                <button
                  onClick={() => {
                    resetForm();
                    setEditingEvent(null);
                    setShowModal(true);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition"
                >
                  + Додати подію
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="text-gray-400 mt-4">Завантаження...</p>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-gray-400 font-medium py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {getDaysInMonth().map((date, index) => {
                  const dayEvents = getEventsForDay(date);
                  const isToday = date && 
                    date.getDate() === new Date().getDate() &&
                    date.getMonth() === new Date().getMonth() &&
                    date.getFullYear() === new Date().getFullYear();

                  return (
                    <div
                      key={index}
                      className={`min-h-[120px] p-2 rounded-lg border ${
                        date
                          ? isToday
                            ? 'bg-blue-900/20 border-blue-500'
                            : 'bg-gray-700 border-gray-600'
                          : 'bg-gray-800/50 border-transparent'
                      }`}
                    >
                      {date && (
                        <>
                          <div className="text-sm font-medium text-white mb-1">
                            {date.getDate()}
                          </div>
                          <div className="space-y-1">
                            {dayEvents.slice(0, 3).map(event => (
                              <div
                                key={event._id}
                                className={`${getEventColor(event.type)} text-white text-xs p-1 rounded cursor-pointer hover:opacity-80 transition`}
                                onClick={() => {
                                  setEditingEvent(event);
                                  setFormData({
                                    title: event.title,
                                    description: event.description || '',
                                    type: event.type,
                                    start_date: event.start_date,
                                    end_date: event.end_date,
                                    attendees: event.attendees || [],
                                  });
                                  setShowModal(true);
                                }}
                              >
                                {getEventIcon(event.type)} {event.title}
                              </div>
                            ))}
                            {dayEvents.length > 3 && (
                              <div className="text-xs text-gray-400 pl-1">
                                +{dayEvents.length - 3} більше
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">
                      {editingEvent ? 'Редагувати подію' : 'Нова подія'}
                    </h2>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setEditingEvent(null);
                        resetForm();
                      }}
                      className="text-gray-400 hover:text-white text-2xl"
                    >
                      ×
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Назва події *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        placeholder="Зустріч з клієнтом"
                      />
                    </div>

                    {/* Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Тип події *
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as CalendarEvent['type'] })}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="meeting">🤝 Зустріч</option>
                        <option value="viewing">🏠 Огляд нерухомості</option>
                        <option value="call">📞 Дзвінок</option>
                        <option value="reminder">⏰ Нагадування</option>
                        <option value="other">📌 Інше</option>
                      </select>
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Початок *
                        </label>
                        <input
                          type="datetime-local"
                          value={formData.start_date}
                          onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Кінець *
                        </label>
                        <input
                          type="datetime-local"
                          value={formData.end_date}
                          onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                          min={formData.start_date} // Кінець не може бути раніше початку
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Опис
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Додаткова інформація про подію"
                      />
                    </div>

                    {/* Attendees (only for owner) */}
                    {adminInfo && adminInfo.role === 'owner' && agents.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Додати рієлторів
                        </label>
                        <div className="space-y-2 max-h-40 overflow-y-auto bg-gray-700 rounded-lg p-3">
                          {agents.map(agent => (
                            <label key={agent._id} className="flex items-center gap-2 text-white cursor-pointer hover:bg-gray-600 p-2 rounded">
                              <input
                                type="checkbox"
                                checked={formData.attendees.includes(agent._id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFormData({
                                      ...formData,
                                      attendees: [...formData.attendees, agent._id],
                                    });
                                  } else {
                                    setFormData({
                                      ...formData,
                                      attendees: formData.attendees.filter(id => id !== agent._id),
                                    });
                                  }
                                }}
                                className="w-4 h-4"
                              />
                              <span>{agent.first_name} {agent.last_name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
                      >
                        {editingEvent ? 'Зберегти' : 'Створити'}
                      </button>
                      {editingEvent && (
                        <button
                          type="button"
                          onClick={() => {
                            handleDelete(editingEvent._id);
                            setShowModal(false);
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition"
                        >
                          Видалити
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setShowModal(false);
                          setEditingEvent(null);
                          resetForm();
                        }}
                        className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition"
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

