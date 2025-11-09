import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DefaultLayout from '@/layouts/default';

export default function EditProperty() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    _id: '',
    title: '',
    description: '',
    property_type: 'apartment',
    transaction_type: 'sale',
    price: {
      amount: 0,
      currency: 'USD',
    },
    area: 0,
    rooms: 0,
    location: {
      city: '',
      address: '',
      coordinates: {},
    },
    images: [] as string[],
    features: [] as string[],
    is_active: true,
    is_featured: false,
    status: 'approved',
  });

  const [newFeature, setNewFeature] = useState('');
  const [imageUrls, setImageUrls] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [geolocating, setGeolocating] = useState(false);
  const [coordinatesFound, setCoordinatesFound] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin_authenticated');
    if (isAuthenticated !== 'true') {
      router.push('/admin');
      return;
    }

    if (id) {
      fetchProperty();
    }
  }, [id, router]);

  const fetchProperty = async () => {
    try {
      const response = await fetch('/api/admin/properties');
      const data = await response.json();
      
      if (data.success) {
        const property = data.data.find((p: any) => p._id === id);
        if (property) {
          setFormData(property);
        } else {
          alert('Нерухомість не знайдено');
          router.push('/admin/dashboard');
        }
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      alert('Помилка завантаження даних');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: type === 'number' ? parseFloat(value) || 0 : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : value,
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleAddImages = () => {
    const urls = imageUrls
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => {
        // Фільтруємо тільки валідні URL
        return url.length > 0 && (url.startsWith('http://') || url.startsWith('https://'));
      });

    if (urls.length === 0) {
      alert('Будь ласка, введіть валідні URL (повинні починатися з http:// або https://)');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...urls],
    }));
    setImageUrls('');
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleGeocodeAddress = async () => {
    const { city, address } = formData.location;

    if (!city || !address) {
      alert('Будь ласка, спочатку заповніть місто та адресу');
      return;
    }

    setGeolocating(true);
    setCoordinatesFound(false);

    try {
      const response = await fetch(
        `/api/geocode?city=${encodeURIComponent(city)}&address=${encodeURIComponent(address)}`
      );
      const data = await response.json();

      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            coordinates: data.coordinates,
          },
        }));
        setCoordinatesFound(true);
        
        if (data.warning) {
          alert(`⚠️ ${data.warning}\n\nКоординати: ${data.coordinates.lat}, ${data.coordinates.lng}`);
        } else {
          alert(`✅ Координати знайдено!\n\n${data.displayName}\n\nКоординати: ${data.coordinates.lat}, ${data.coordinates.lng}`);
        }
      } else {
        alert(`❌ ${data.message}\n\nСпробуйте:\n- Перевірити правильність адреси\n- Вказати адресу українською\n- Додати номер будинку`);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      alert('Помилка визначення координат');
    } finally {
      setGeolocating(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('/api/upload-to-imgbb', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          uploadedUrls.push(data.url);
        } else {
          alert(`Помилка завантаження ${file.name}: ${data.message}`);
        }
      }

      if (uploadedUrls.length > 0) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...uploadedUrls],
        }));
        alert(`Успішно завантажено ${uploadedUrls.length} зображень!`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Помилка завантаження зображень');
    } finally {
      setUploadingImage(false);
      event.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/admin/properties', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Нерухомість успішно оновлено!');
        router.push('/admin/dashboard');
      } else {
        alert(data.message || 'Помилка при оновленні нерухомості');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Помилка з\'єднання з сервером');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="text-gray-400 mt-4">Завантаження...</p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-white">Редагувати нерухомість</h1>
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="text-gray-400 hover:text-white transition"
              >
                ← Назад
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
                  Основна інформація
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Назва *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Опис *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Тип нерухомості *
                    </label>
                    <select
                      name="property_type"
                      value={formData.property_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="apartment">Квартира</option>
                      <option value="house">Будинок</option>
                      <option value="commercial">Комерційна</option>
                      <option value="land">Земля</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Тип операції *
                    </label>
                    <select
                      name="transaction_type"
                      value={formData.transaction_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="sale">Продаж</option>
                      <option value="rent">Оренда</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Price & Details */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
                  Ціна та характеристики
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Ціна *
                    </label>
                    <input
                      type="number"
                      name="price.amount"
                      value={formData.price.amount}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Валюта *
                    </label>
                    <select
                      name="price.currency"
                      value={formData.price.currency}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="USD">USD</option>
                      <option value="UAH">UAH</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Площа (м²) *
                    </label>
                    <input
                      type="number"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Кількість кімнат
                    </label>
                    <input
                      type="number"
                      name="rooms"
                      value={formData.rooms}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
                  Локація
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Місто *
                    </label>
                    <input
                      type="text"
                      name="location.city"
                      value={formData.location.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      placeholder="Чернівці"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Адреса *
                    </label>
                    <input
                      type="text"
                      name="location.address"
                      value={formData.location.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      placeholder="вул. Головна, 25"
                    />
                  </div>
                </div>

                {/* Кнопка визначення координат */}
                <div>
                  <button
                    type="button"
                    onClick={handleGeocodeAddress}
                    disabled={geolocating}
                    className={`w-full px-4 py-3 rounded-lg font-medium transition ${
                      coordinatesFound
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    } ${geolocating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {geolocating ? (
                      '🔍 Визначення координат...'
                    ) : coordinatesFound ? (
                      '✅ Координати визначено! (Клікніть щоб оновити)'
                    ) : (
                      '📍 Визначити координати за адресою'
                    )}
                  </button>
                  <p className="text-xs text-gray-400 mt-2">
                    {coordinatesFound ? (
                      <span className="text-green-400">
                        ✓ Координати: {formData.location.coordinates?.lat?.toFixed(4)}, {formData.location.coordinates?.lng?.toFixed(4)}
                      </span>
                    ) : formData.location.coordinates?.lat && formData.location.coordinates?.lng ? (
                      <span className="text-yellow-400">
                        Поточні координати: {formData.location.coordinates.lat.toFixed(4)}, {formData.location.coordinates.lng.toFixed(4)}
                      </span>
                    ) : (
                      'Координати не обов\'язкові, але потрібні для відображення на карті'
                    )}
                  </p>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
                  Зображення
                </h2>

                {/* Завантаження файлів */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Завантажити зображення з комп'ютера
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      multiple
                      onChange={handleFileUpload}
                      disabled={uploadingImage}
                      className="hidden"
                      id="file-upload-edit"
                    />
                    <label
                      htmlFor="file-upload-edit"
                      className={`flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition text-center cursor-pointer font-medium ${
                        uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {uploadingImage ? 'Завантаження...' : '📤 Вибрати файли для завантаження'}
                    </label>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Підтримуються: JPG, PNG, GIF, WebP. Максимум 32MB на файл.
                  </p>
                </div>

                {/* Або URL */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-800 text-gray-400">або вставте посилання</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    URL зображень (по одному на рядок)
                  </label>
                  <textarea
                    value={imageUrls}
                    onChange={(e) => setImageUrls(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://i.ibb.co/example1.jpg&#10;https://i.ibb.co/example2.jpg"
                  />
                  <button
                    type="button"
                    onClick={handleAddImages}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm"
                  >
                    Додати з URL
                  </button>
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {formData.images.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
                  Особливості
                </h2>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="flex-grow px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Наприклад: Паркінг, Балкон, Ремонт"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Додати
                  </button>
                </div>

                {formData.features.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, index) => (
                      <span
                        key={index}
                        className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Settings */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
                  Налаштування
                </h2>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleCheckboxChange}
                      className="w-5 h-5 rounded"
                    />
                    <span>Опублікувати на сайті</span>
                  </label>

                  <label className="flex items-center gap-3 text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={formData.is_featured}
                      onChange={handleCheckboxChange}
                      className="w-5 h-5 rounded"
                    />
                    <span>Рекомендоване оголошення</span>
                  </label>
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Збереження...' : 'Зберегти зміни'}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/admin/dashboard')}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition"
                >
                  Скасувати
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}

