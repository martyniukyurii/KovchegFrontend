"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  IconPlus,
  IconFilter,
  IconChevronLeft,
  IconChevronRight,
  IconCalendarEvent,
  IconChecks,
  IconClock,
  IconUser,
  IconMapPin,
  IconNote,
} from "@tabler/icons-react";

import { useTranslation } from "@/hooks/useTranslation";

// Типи задач та зустрічей
type EventType = "meeting" | "task" | "call" | "reminder";
type EventStatus = "pending" | "completed" | "cancelled";
type EventPriority = "high" | "medium" | "low";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  type: EventType;
  status: EventStatus;
  priority: EventPriority;
  time?: string;
  duration?: number; // minutes
  location?: string;
  participants?: string[];
}

// Тестові дані для календаря
const dummyEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Зустріч з клієнтом",
    description: "Обговорення умов покупки квартири",
    date: new Date(new Date().setDate(new Date().getDate() - 2)),
    type: "meeting",
    status: "completed",
    priority: "high",
    time: "10:00",
    duration: 60,
    location: "вул. Головна, 45",
    participants: ["Олена К.", "Михайло П."],
  },
  {
    id: "2",
    title: "Перегляд об'єкту",
    description: "Показ квартири потенційному покупцю",
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
    type: "meeting",
    status: "completed",
    priority: "medium",
    time: "14:30",
    duration: 45,
    location: "вул. Садова, 12, кв. 5",
  },
  {
    id: "3",
    title: "Дзвінок клієнту",
    description: "Уточнення деталей договору",
    date: new Date(),
    type: "call",
    status: "pending",
    priority: "medium",
    time: "11:15",
    duration: 15,
  },
  {
    id: "4",
    title: "Підготувати документи",
    description: "Підготовка договору купівлі-продажу",
    date: new Date(),
    type: "task",
    status: "pending",
    priority: "high",
  },
  {
    id: "5",
    title: "Консультація з юристом",
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    type: "meeting",
    status: "pending",
    priority: "medium",
    time: "13:00",
    duration: 30,
  },
  {
    id: "6",
    title: "Підписання договору",
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    type: "meeting",
    status: "pending",
    priority: "high",
    time: "16:00",
    duration: 90,
    location: "Офіс нотаріуса, вул. Центральна, 18",
    participants: ["Клієнт", "Нотаріус", "Юрист"],
  },
  {
    id: "7",
    title: "Нагадування про платіж",
    date: new Date(new Date().setDate(new Date().getDate() + 3)),
    type: "reminder",
    status: "pending",
    priority: "low",
  },
];

export function CalendarSection() {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showEventDetails, setShowEventDetails] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<EventType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<EventStatus | "all">("all");

  // Ефект для відстеження монтування компонента і завантаження даних
  useEffect(() => {
    setIsMounted(true);
    setEvents(dummyEvents);
  }, []);

  // Показуємо заглушку до монтування компонента
  if (!isMounted) {
    return <div className="w-full p-4 h-64" />;
  }

  // Функції для навігації по календарю
  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  const goToToday = () => {
    const today = new Date();

    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
  };

  // Отримання днів для поточного місяця
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Визначення першого дня місяця (0 - Неділя, 1 - Понеділок, ...)
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Корегуємо, оскільки наш тиждень починається з понеділка

    // Останній день попереднього місяця
    const lastDayOfLastMonth = new Date(year, month, 0).getDate();

    // Дні з попереднього місяця
    const prevMonthDays = Array.from({ length: adjustedFirstDay }, (_, i) => ({
      date: new Date(
        year,
        month - 1,
        lastDayOfLastMonth - adjustedFirstDay + i + 1,
      ),
      isCurrentMonth: false,
    }));

    // Дні поточного місяця
    const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => ({
      date: new Date(year, month, i + 1),
      isCurrentMonth: true,
    }));

    // Дні з наступного місяця
    const nextMonthDays = Array.from(
      { length: 42 - prevMonthDays.length - currentMonthDays.length },
      (_, i) => ({
        date: new Date(year, month + 1, i + 1),
        isCurrentMonth: false,
      }),
    );

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  // Отримання подій для обраної дати
  const getEventsForDate = (date: Date) => {
    return events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear() &&
        (filterType === "all" || event.type === filterType) &&
        (filterStatus === "all" || event.status === filterStatus),
    );
  };

  // Функція для перевірки, чи є події у цей день
  const hasEvents = (date: Date) => {
    return events.some(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear() &&
        (filterType === "all" || event.type === filterType) &&
        (filterStatus === "all" || event.status === filterStatus),
    );
  };

  // Функція для форматування дати
  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleString("uk-UA", { month: "long" });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  // Функція для отримання CSS класу на основі пріоритету та статусу події
  const getEventClass = (event: CalendarEvent) => {
    let baseClass = "rounded-lg p-3 mb-2 transition-all hover:translate-x-1";

    // Класи в залежності від статусу
    if (event.status === "completed") {
      return `${baseClass} bg-green-100 dark:bg-green-900/30 border-l-4 border-green-500`;
    } else if (event.status === "cancelled") {
      return `${baseClass} bg-gray-100 dark:bg-gray-800 border-l-4 border-gray-500 opacity-60`;
    }

    // Класи в залежності від пріоритету
    switch (event.priority) {
      case "high":
        return `${baseClass} bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500`;
      case "medium":
        return `${baseClass} bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500`;
      case "low":
        return `${baseClass} bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500`;
      default:
        return baseClass;
    }
  };

  // Функція для отримання іконки події в залежності від типу
  const getEventIcon = (type: EventType) => {
    switch (type) {
      case "meeting":
        return <IconCalendarEvent className="h-5 w-5" />;
      case "task":
        return <IconChecks className="h-5 w-5" />;
      case "call":
        return <IconUser className="h-5 w-5" />;
      case "reminder":
        return <IconClock className="h-5 w-5" />;
      default:
        return <IconCalendarEvent className="h-5 w-5" />;
    }
  };

  // Функція для форматування часу події
  const formatEventTime = (event: CalendarEvent) => {
    if (!event.time) return null;

    const startTime = event.time;

    if (!event.duration) return startTime;

    // Розрахунок кінцевого часу
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const totalMinutes = startHour * 60 + startMinute + event.duration;
    const endHour = Math.floor(totalMinutes / 60);
    const endMinute = totalMinutes % 60;
    const endTime = `${endHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`;

    return `${startTime} - ${endTime}`;
  };

  // Відображення днів тижня
  const weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

  return (
    <motion.div
      className="w-full p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {t("crm.sections.calendar.title")}
        </h1>
        <p className="text-muted-foreground">{t("crm.calendar.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Календар */}
        <motion.div
          className="lg:col-span-2 rounded-xl border bg-card p-4 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-medium">
                {currentMonth.toLocaleString("uk-UA", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={previousMonth}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800"
                >
                  <IconChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800"
                >
                  <IconChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={goToToday}
                className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700"
              >
                {t("crm.calendar.today")}
              </button>
              <div className="relative">
                <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800">
                  <IconFilter className="h-5 w-5" />
                </button>
                {/* Тут можна додати випадаюче меню фільтрів */}
              </div>
            </div>
          </div>

          {/* Сітка календаря */}
          <div className="grid grid-cols-7 gap-1">
            {/* Заголовки днів тижня */}
            {weekdays.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
              >
                {day}
              </div>
            ))}

            {/* Дні календаря */}
            {getDaysInMonth().map((day, index) => {
              const isToday =
                day.date.toDateString() === new Date().toDateString();
              const isSelected =
                day.date.toDateString() === selectedDate.toDateString();
              const hasEventsOnDay = hasEvents(day.date);

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(day.date)}
                  className={`
                    aspect-square p-1 relative rounded-md transition-all
                    ${day.isCurrentMonth ? "text-foreground" : "text-gray-400 dark:text-gray-600"}
                    ${isSelected ? "bg-blue-100 dark:bg-blue-900/30" : "hover:bg-gray-100 dark:hover:bg-neutral-800"}
                    ${isToday ? "font-bold" : ""}
                  `}
                >
                  <span>{day.date.getDate()}</span>
                  {hasEventsOnDay && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-500" />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Події на обрану дату */}
        <motion.div
          className="rounded-xl border bg-card p-4 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">{formatDate(selectedDate)}</h2>
            <button className="p-1 rounded-full bg-blue-500 text-white hover:bg-blue-600">
              <IconPlus className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-1">
            {getEventsForDate(selectedDate).length > 0 ? (
              getEventsForDate(selectedDate).map((event) => (
                <div key={event.id} className={getEventClass(event)}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-2">
                      <div className="mt-1">{getEventIcon(event.type)}</div>
                      <div>
                        <h3 className="font-medium">{event.title}</h3>
                        {event.time && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <IconClock className="h-3.5 w-3.5" />
                            {formatEventTime(event)}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setShowEventDetails(
                          showEventDetails === event.id ? null : event.id,
                        )
                      }
                      className="text-xs px-2 py-1 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-800"
                    >
                      {showEventDetails === event.id
                        ? t("crm.calendar.hide")
                        : t("crm.calendar.details")}
                    </button>
                  </div>

                  {showEventDetails === event.id && (
                    <div className="mt-3 pl-7 text-sm space-y-2 text-gray-700 dark:text-gray-300">
                      {event.description && (
                        <p className="flex items-start gap-2">
                          <IconNote className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{event.description}</span>
                        </p>
                      )}
                      {event.location && (
                        <p className="flex items-start gap-2">
                          <IconMapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{event.location}</span>
                        </p>
                      )}
                      {event.participants && event.participants.length > 0 && (
                        <p className="flex items-start gap-2">
                          <IconUser className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{event.participants.join(", ")}</span>
                        </p>
                      )}
                      <div className="flex gap-2 pt-2">
                        <button className="px-3 py-1 text-xs rounded-md bg-blue-500 text-white hover:bg-blue-600">
                          {t("crm.calendar.edit")}
                        </button>
                        {event.status !== "completed" && (
                          <button className="px-3 py-1 text-xs rounded-md bg-green-500 text-white hover:bg-green-600">
                            {t("crm.calendar.complete")}
                          </button>
                        )}
                        <button className="px-3 py-1 text-xs rounded-md bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50">
                          {event.status === "cancelled"
                            ? t("crm.calendar.restore")
                            : t("crm.calendar.cancel")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <IconCalendarEvent className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>{t("crm.calendar.noEvents")}</p>
                <button className="mt-4 px-4 py-2 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600">
                  {t("crm.calendar.addEvent")}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
