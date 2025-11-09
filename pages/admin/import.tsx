import { useState } from 'react';
import DefaultLayout from '@/layouts/default';

export default function BulkImport() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleImport = async () => {
    if (!confirm('Ви впевнені, що хочете імпортувати всі об\'єкти нерухомості?')) {
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/admin/bulk-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.message || 'Помилка імпорту');
      }
    } catch (err) {
      setError('Помилка з\'єднання з сервером');
      console.error('Import error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
            <h1 className="text-3xl font-bold text-white mb-6">
              Масовий імпорт нерухомості
            </h1>

            <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-blue-300 mb-2">
                ℹ️ Що буде імпортовано:
              </h2>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• 12 об'єктів нерухомості</li>
                <li>• 9 квартир на продаж (вул. Герцена, Горіхівський провулок, Шептицького)</li>
                <li>• 2 офісні приміщення в оренду (вул. Ясська)</li>
                <li>• 1 паркомісце на продаж (вул. Чорноморська)</li>
                <li>• Відповідальні рієлтори: Максим Голбан, Тетяна Петрусєва</li>
              </ul>
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 mb-6">
                <p className="text-red-300">❌ {error}</p>
              </div>
            )}

            {result && (
              <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-green-300 mb-2">
                  ✅ Імпорт успішний!
                </h3>
                <p className="text-gray-300">
                  Імпортовано об'єктів: <span className="font-bold">{result.insertedCount}</span>
                </p>
                {result.insertedIds && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">ID імпортованих об'єктів:</p>
                    <div className="bg-gray-900/50 rounded p-3 max-h-60 overflow-y-auto">
                      {Object.values(result.insertedIds).map((id: any, index) => (
                        <div key={index} className="text-xs text-gray-400 font-mono mb-1">
                          {index + 1}. {id}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleImport}
              disabled={loading}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all ${
                loading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Імпортую...
                </span>
              ) : (
                '🚀 Запустити імпорт'
              )}
            </button>

            <div className="mt-6 text-center">
              <a
                href="/admin/dashboard"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                ← Повернутись до панелі адміністратора
              </a>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}

