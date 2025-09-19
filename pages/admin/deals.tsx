import React from "react";
import Head from "next/head";
import { DealsSection } from "@/components/crm/sections/deals-section";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function DealsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Угоди - CRM Система</title>
        <meta name="description" content="Управління угодами та продажами" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.back()}
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  ← Назад
                </button>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Управління угодами
                </h1>
              </div>
              <nav className="flex space-x-4">
                <a
                  href="/admin/clients"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Клієнти
                </a>
                <a
                  href="/admin/properties"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Нерухомість
                </a>
                <a
                  href="/admin/analytics"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Аналітика
                </a>
              </nav>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto">
          <DealsSection />
        </main>
      </div>
    </>
  );
} 