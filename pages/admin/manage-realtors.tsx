import { useState, useEffect } from 'react';
import DefaultLayout from '@/layouts/default';
import { useRouter } from 'next/router';

interface Admin {
  _id: string;
  first_name: string;
  last_name?: string;
  email: string;
  role: string;
  telegram_id?: number;
  phone?: string;
  photo?: string;
}

export default function ManageRealtorsPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    photo: '',
  });

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin_authenticated');
    const storedAdminInfo = localStorage.getItem('admin_info');
    if (isAuthenticated !== 'true' || !storedAdminInfo) {
      router.push('/admin');
      return;
    }
    const parsedAdminInfo = JSON.parse(storedAdminInfo);
    if (parsedAdminInfo.role !== 'owner') {
      router.push('/admin/dashboard');
      return;
    }
    setAdminInfo(parsedAdminInfo);
    fetchAdmins();
  }, [router]);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/agents');
      const data = await response.json();
      if (data.success) {
        setAdmins(data.data);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (admin: Admin) => {
    setSelectedAdmin(admin);
    setFormData({
      first_name: admin.first_name || '',
      last_name: admin.last_name || '',
      phone: admin.phone || '',
      photo: admin.photo || '',
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Валідація типу файлу
    if (!file.type.startsWith('image/')) {
      setMessage('Будь ласка, виберіть файл зображення');
      return;
    }

    // Валідація розміру (макс 32MB для ImgBB)
    if (file.size > 32 * 1024 * 1024) {
      setMessage('Розмір файлу не повинен перевищувати 32 MB');
      return;
    }

    setUploading(true);
    setMessage('Завантаження фото...');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.url) {
        setFormData((prev) => ({ ...prev, photo: data.url }));
        setMessage('Фото успішно завантажено!');
      } else {
        setMessage(`Помилка завантаження: ${data.message || 'Невідома помилка'}`);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setMessage(`Помилка завантаження: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedAdmin) return;

    setMessage('Збереження...');
    try {
      const response = await fetch('/api/admin/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          admin_id: selectedAdmin._id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          photo: formData.photo,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage('Профіль успішно оновлено!');
        fetchAdmins();
        setTimeout(() => {
          setIsModalOpen(false);
          setMessage('');
        }, 1500);
      } else {
        setMessage(`Помилка: ${result.message}`);
      }
    } catch (error: any) {
      console.error('Save error:', error);
      setMessage(`Помилка збереження: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="min-h-screen bg-gray-900 py-8 flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-400 ml-4">Завантаження...</p>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">Управління профілями рієлторів</h1>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              ← Назад
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {admins.map((admin) => (
                <div key={admin._id} className="bg-gray-700 rounded-lg p-6 flex flex-col items-center">
                  {/* Фото або аватар */}
                  <div className="w-32 h-32 mb-4 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    {admin.photo ? (
                      <img src={admin.photo} alt={admin.first_name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-4xl font-bold">
                        {admin.first_name[0]}{admin.last_name?.[0] || ''}
                      </span>
                    )}
                  </div>

                  {/* Інформація */}
                  <h3 className="text-xl font-bold text-white mb-1 text-center">
                    {admin.first_name} {admin.last_name || ''}
                  </h3>
                  <p className="text-sm text-blue-400 mb-2">{admin.role === 'admin' ? 'Адміністратор' : 'Рієлтор'}</p>
                  
                  <div className="text-gray-300 text-sm mb-4 w-full">
                    <p className="mb-1">📧 {admin.email}</p>
                    {admin.phone && <p className="mb-1">📞 {admin.phone}</p>}
                    {admin.telegram_id && <p className="mb-1">💬 TG: {admin.telegram_id}</p>}
                  </div>

                  {/* Кнопка редагування */}
                  <button
                    onClick={() => openEditModal(admin)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Редагувати профіль
                  </button>
                </div>
              ))}
            </div>

            {admins.length === 0 && (
              <p className="text-gray-400 text-center py-8">Рієлторів не знайдено.</p>
            )}
          </div>
        </div>
      </div>

      {/* Модальне вікно редагування */}
      {isModalOpen && selectedAdmin && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              Редагувати профіль: {selectedAdmin.first_name}
            </h2>

            <div className="space-y-4">
              {/* Поточне фото */}
              <div className="flex justify-center mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  {formData.photo ? (
                    <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-4xl font-bold">
                      {formData.first_name[0]}{formData.last_name?.[0] || ''}
                    </span>
                  )}
                </div>
              </div>

              {/* Завантаження фото */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Фото рієлтора
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 disabled:opacity-50"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Або вставте URL фото нижче
                </p>
              </div>

              {/* URL фото */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL фото
                </label>
                <input
                  type="text"
                  name="photo"
                  value={formData.photo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  placeholder="https://..."
                />
              </div>

              {/* Ім'я */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ім'я *
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  required
                />
              </div>

              {/* Прізвище */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Прізвище
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>

              {/* Телефон */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Телефон
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  placeholder="+380..."
                />
              </div>

              {/* Повідомлення */}
              {message && (
                <p className={`text-sm font-medium ${message.startsWith('Помилка') ? 'text-red-500' : 'text-green-500'}`}>
                  {message}
                </p>
              )}

              {/* Кнопки */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setMessage('');
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
                >
                  Скасувати
                </button>
                <button
                  onClick={handleSave}
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
                >
                  {uploading ? 'Завантаження...' : 'Зберегти'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}

