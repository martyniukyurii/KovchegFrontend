"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IconArrowUpRight, IconArrowDownRight } from "@tabler/icons-react";

import { useTranslation } from "@/hooks/useTranslation";

export function AnalyticsSection() {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  // Ефект для відстеження монтування компонента
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const stats = [
    {
      title: t("crm.analytics.totalSales"),
      value: "₴2.5M",
      change: "+12.5%",
      isPositive: true,
    },
    {
      title: t("crm.analytics.newClients"),
      value: "48",
      change: "+7.2%",
      isPositive: true,
    },
    {
      title: t("crm.analytics.activeProperties"),
      value: "138",
      change: "+3.1%",
      isPositive: true,
    },
    {
      title: t("crm.analytics.conversionRate"),
      value: "6.8%",
      change: "-1.2%",
      isPositive: false,
    },
  ];

  // Показуємо заглушку до монтування компонента
  if (!isMounted) {
    return <div className="w-full p-4 h-64" />;
  }

  return (
    <motion.div
      className="w-full p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t("crm.analytics.title")}</h1>
        <p className="text-muted-foreground">{t("crm.analytics.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="rounded-xl border bg-card p-4 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <div
                className={`flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-medium ${
                  stat.isPositive
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {stat.isPositive ? (
                  <IconArrowUpRight className="h-3 w-3" />
                ) : (
                  <IconArrowDownRight className="h-3 w-3" />
                )}
                {stat.change}
              </div>
            </div>
            <p className="mt-3 text-3xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Графік продажів */}
        <motion.div
          className="rounded-xl border bg-card p-4 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="mb-4 text-lg font-medium">
            {t("crm.analytics.salesChart")}
          </h2>
          <div className="h-64 w-full rounded-lg bg-muted/30 p-4 flex items-center justify-center">
            <p className="text-muted-foreground">
              {t("crm.analytics.chartPlaceholder")}
            </p>
          </div>
        </motion.div>

        {/* Топ угод */}
        <motion.div
          className="rounded-xl border bg-card p-4 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="mb-4 text-lg font-medium">
            {t("crm.analytics.topDeals")}
          </h2>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">
                    {t("crm.analytics.dealName")} #{i}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("crm.analytics.clientName")} #{i}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">
                    ₴{(Math.random() * 500000 + 100000).toFixed(0)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(
                      Date.now() - i * 24 * 60 * 60 * 1000,
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
