"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  IconPlus,
  IconFilter,
  IconSearch,
  IconEye,
  IconEdit,
  IconTrash,
  IconStar,
  IconStarFilled,
  IconPhone,
  IconMail,
  IconBrandWhatsapp,
  IconBrandTelegram,
  IconMessage,
  IconMessageCircle,
  IconMessageDots,
  IconCalendar,
  IconUser,
  IconUsers,
  IconCheck,
  IconClock,
  IconHome,
  IconBuildingStore,
  IconFile,
} from "@tabler/icons-react";

import { useTranslation } from "@/hooks/useTranslation";

// Типи комунікацій та статуси
type CommunicationType =
  | "call"
  | "email"
  | "meeting"
  | "message"
  | "telegram"
  | "whatsapp"
  | "note";
type CommunicationStatus =
  | "planned"
  | "in_progress"
  | "completed"
  | "cancelled";
type CommunicationDirection = "incoming" | "outgoing" | "internal";
type CommunicationPriority = "high" | "medium" | "low";

// Інтерфейс для комунікації
interface Communication {
  id: string;
  type: CommunicationType;
  status: CommunicationStatus;
  priority: CommunicationPriority;
  direction: CommunicationDirection;
  isFavorite: boolean;
  subject: string;
  content?: string;
  clientId?: string;
  clientName: string;
  propertyId?: string;
  propertyName?: string;
  dealId?: string;
  dealName?: string;
  createdAt: Date;
  scheduledAt?: Date;
  completedAt?: Date;
  responsibleAgent: string;
  tags: string[];
  attachments?: string[];
}

export function CommunicationsSection() {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [filteredCommunications, setFilteredCommunications] = useState<
    Communication[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<CommunicationStatus | "all">(
    "all",
  );
  const [filterType, setFilterType] = useState<CommunicationType | "all">(
    "all",
  );
  const [filterDirection, setFilterDirection] = useState<
    CommunicationDirection | "all"
  >("all");
  const [selectedCommunication, setSelectedCommunication] = useState<
    string | null
  >(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<
    "subject" | "clientName" | "createdAt" | "scheduledAt" | "completedAt"
  >("scheduledAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Тестові дані комунікацій
  const dummyCommunications: Communication[] = [
    {
      id: "1",
      type: "call",
      status: "completed",
      priority: "high",
      direction: "outgoing",
      isFavorite: true,
      subject: "Обговорення умов угоди",
      content:
        "Клієнт погодився на запропоновану ціну. Домовились про зустріч для підписання попереднього договору.",
      clientId: "1",
      clientName: "Іван Петренко",
      dealId: "1",
      dealName: "Продаж квартири по вул. Європейська, 15",
      createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
      scheduledAt: new Date(new Date().setDate(new Date().getDate() - 2)),
      completedAt: new Date(new Date().setDate(new Date().getDate() - 2)),
      responsibleAgent: "Марія Шевченко",
      tags: ["важливо", "успішно"],
    },
    {
      id: "2",
      type: "meeting",
      status: "planned",
      priority: "high",
      direction: "outgoing",
      isFavorite: true,
      subject: "Підписання попереднього договору",
      content:
        "Зустріч з клієнтом для підписання попереднього договору та внесення авансу.",
      clientId: "1",
      clientName: "Іван Петренко",
      dealId: "1",
      dealName: "Продаж квартири по вул. Європейська, 15",
      createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
      scheduledAt: new Date(new Date().setDate(new Date().getDate() + 1)),
      responsibleAgent: "Марія Шевченко",
      tags: ["зустріч", "договір"],
    },
    {
      id: "3",
      type: "email",
      status: "completed",
      priority: "medium",
      direction: "outgoing",
      isFavorite: false,
      subject: "Комерційна пропозиція",
      content:
        "Надіслано комерційну пропозицію з варіантами приміщень та умовами оренди.",
      clientId: "2",
      clientName: "ТОВ 'Горизонт'",
      propertyId: "2",
      propertyName: "Комерційне приміщення в центрі міста",
      createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
      scheduledAt: new Date(new Date().setDate(new Date().getDate() - 5)),
      completedAt: new Date(new Date().setDate(new Date().getDate() - 5)),
      responsibleAgent: "Василь Коваль",
      tags: ["пропозиція", "комерційна нерухомість"],
      attachments: ["proposition_horizont.pdf"],
    },
    {
      id: "4",
      type: "whatsapp",
      status: "completed",
      priority: "low",
      direction: "incoming",
      isFavorite: false,
      subject: "Питання по об'єкту",
      content: "Клієнт цікавиться наявністю опалення в будинку і станом даху.",
      clientId: "3",
      clientName: "Олександр Іваненко",
      propertyId: "3",
      propertyName: "Будинок з ділянкою на околиці",
      createdAt: new Date(new Date().setDate(new Date().getDate() - 3)),
      completedAt: new Date(new Date().setDate(new Date().getDate() - 3)),
      responsibleAgent: "Олександр Мельник",
      tags: ["консультація"],
    },
    {
      id: "5",
      type: "telegram",
      status: "planned",
      priority: "medium",
      direction: "outgoing",
      isFavorite: false,
      subject: "Відправка фото об'єкта",
      clientId: "4",
      clientName: "Наталія Литвин",
      propertyId: "1",
      propertyName: "Сучасна 2-кімнатна квартира з ремонтом",
      createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
      scheduledAt: new Date(new Date().setDate(new Date().getDate() + 2)),
      responsibleAgent: "Марія Шевченко",
      tags: ["фото", "додаткова інформація"],
    },
    {
      id: "6",
      type: "note",
      status: "completed",
      priority: "low",
      direction: "internal",
      isFavorite: false,
      subject: "Нотатка щодо ремонту",
      content:
        "Потрібно уточнити статус ремонту сантехніки перед показом об'єкта клієнту.",
      propertyId: "1",
      propertyName: "Сучасна 2-кімнатна квартира з ремонтом",
      clientName: "Внутрішня нотатка",
      createdAt: new Date(new Date().setDate(new Date().getDate() - 7)),
      completedAt: new Date(new Date().setDate(new Date().getDate() - 7)),
      responsibleAgent: "Марія Шевченко",
      tags: ["внутрішня", "підготовка"],
    },
    {
      id: "7",
      type: "message",
      status: "in_progress",
      priority: "high",
      direction: "incoming",
      isFavorite: true,
      subject: "Запит на зниження ціни",
      content: "Клієнт просить розглянути можливість зниження ціни на 5%.",
      clientId: "3",
      clientName: "Олександр Іваненко",
      propertyId: "3",
      propertyName: "Будинок з ділянкою на околиці",
      dealId: "3",
      dealName: "Продаж будинку в Коровії",
      createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
      responsibleAgent: "Олександр Мельник",
      tags: ["переговори", "ціна"],
    },
  ];

  // Ефект для монтування компонента і завантаження даних
  useEffect(() => {
    setIsMounted(true);
    setCommunications(dummyCommunications);
    setFilteredCommunications(dummyCommunications);
  }, []);

  // Ефект для фільтрації та сортування комунікацій
  useEffect(() => {
    let result = [...communications];

    // Фільтрація за обраними
    if (showFavoritesOnly) {
      result = result.filter((communication) => communication.isFavorite);
    }

    // Фільтрація за статусом
    if (filterStatus !== "all") {
      result = result.filter(
        (communication) => communication.status === filterStatus,
      );
    }

    // Фільтрація за типом
    if (filterType !== "all") {
      result = result.filter(
        (communication) => communication.type === filterType,
      );
    }

    // Фільтрація за напрямком
    if (filterDirection !== "all") {
      result = result.filter(
        (communication) => communication.direction === filterDirection,
      );
    }

    // Пошук за текстом
    if (searchTerm) {
      const term = searchTerm.toLowerCase();

      result = result.filter(
        (communication) =>
          communication.subject.toLowerCase().includes(term) ||
          communication.content?.toLowerCase().includes(term) ||
          communication.clientName.toLowerCase().includes(term) ||
          communication.propertyName?.toLowerCase().includes(term) ||
          communication.dealName?.toLowerCase().includes(term) ||
          communication.responsibleAgent.toLowerCase().includes(term) ||
          communication.tags.some((tag) => tag.toLowerCase().includes(term)),
      );
    }

    // Сортування
    result.sort((a, b) => {
      if (sortBy === "subject" || sortBy === "clientName") {
        const aVal = a[sortBy] || "";
        const bVal = b[sortBy] || "";

        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      } else {
        // Для дат
        const aDate = a[sortBy] || new Date(0);
        const bDate = b[sortBy] || new Date(0);
        const aTime = aDate.getTime();
        const bTime = bDate.getTime();

        return sortDirection === "asc" ? aTime - bTime : bTime - aTime;
      }
    });

    setFilteredCommunications(result);
  }, [
    communications,
    filterStatus,
    filterType,
    filterDirection,
    searchTerm,
    sortBy,
    sortDirection,
    showFavoritesOnly,
  ]);

  // Функція для отримання кольору статусу комунікації
  const getStatusColor = (status: CommunicationStatus) => {
    switch (status) {
      case "planned":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  // Функція для отримання перекладу статусу комунікації
  const getStatusText = (status: CommunicationStatus) => {
    return t(`crm.communications.statuses.${status}`);
  };

  // Функція для отримання класу пріоритету
  const getPriorityClass = (priority: CommunicationPriority) => {
    switch (priority) {
      case "high":
        return "border-l-4 border-red-500";
      case "medium":
        return "border-l-4 border-yellow-500";
      case "low":
        return "border-l-4 border-green-500";
      default:
        return "";
    }
  };

  // Функція для отримання кольору напрямку комунікації
  const getDirectionColor = (direction: CommunicationDirection) => {
    switch (direction) {
      case "incoming":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "outgoing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "internal":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  // Функція для отримання перекладу напрямку комунікації
  const getDirectionText = (direction: CommunicationDirection) => {
    return t(`crm.communications.directions.${direction}`);
  };

  // Функція для отримання іконки типу комунікації
  const getTypeIcon = (type: CommunicationType) => {
    switch (type) {
      case "call":
        return (
          <IconPhone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        );
      case "email":
        return (
          <IconMail className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        );
      case "meeting":
        return (
          <IconUsers className="h-5 w-5 text-green-600 dark:text-green-400" />
        );
      case "message":
        return (
          <IconMessage className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
        );
      case "telegram":
        return (
          <IconBrandTelegram className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        );
      case "whatsapp":
        return (
          <IconBrandWhatsapp className="h-5 w-5 text-green-600 dark:text-green-400" />
        );
      case "note":
        return (
          <IconMessageDots className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        );
      default:
        return <IconMessageCircle className="h-5 w-5" />;
    }
  };

  // Функція для отримання тексту типу комунікації
  const getTypeText = (type: CommunicationType) => {
    return t(`crm.communications.types.${type}`);
  };

  // Функція для форматування дати
  const formatDate = (date?: Date) => {
    if (!date) return "";

    return new Intl.DateTimeFormat("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Функція для зміни статусу "обраний"
  const toggleFavorite = (communicationId: string) => {
    setCommunications((prev) =>
      prev.map((communication) =>
        communication.id === communicationId
          ? { ...communication, isFavorite: !communication.isFavorite }
          : communication,
      ),
    );
  };

  // Функція для зміни статусу комунікації
  const updateCommunicationStatus = (
    communicationId: string,
    newStatus: CommunicationStatus,
  ) => {
    setCommunications((prev) =>
      prev.map((communication) => {
        if (communication.id === communicationId) {
          const updatedCommunication = { ...communication, status: newStatus };

          // Оновлюємо дату завершення, якщо статус змінено на "completed"
          if (newStatus === "completed" && !communication.completedAt) {
            updatedCommunication.completedAt = new Date();
          }

          return updatedCommunication;
        }

        return communication;
      }),
    );
  };

  // Компонент плашки для тегів
  const Tag = ({ text }: { text: string }) => (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
      {text}
    </span>
  );

  // Компонент для рядка комунікацій
  const CommunicationRow = ({
    communication,
  }: {
    communication: Communication;
  }) => {
    const isSelected = selectedCommunication === communication.id;

    return (
      <div
        className={`
        p-4 mb-4 rounded-lg bg-card shadow-sm transition-all
        ${getPriorityClass(communication.priority)}
        ${isSelected ? "ring-2 ring-blue-500 dark:ring-blue-400" : ""}
        hover:bg-gray-50 dark:hover:bg-gray-900/20
      `}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-start space-x-3">
            <div className="mt-0.5 flex flex-col items-center">
              {getTypeIcon(communication.type)}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(communication.id);
                }}
                className="mt-2 text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400"
                aria-label={
                  communication.isFavorite
                    ? t("crm.communications.removeFromFavorites")
                    : t("crm.communications.addToFavorites")
                }
              >
                {communication.isFavorite ? (
                  <IconStarFilled className="h-5 w-5 text-yellow-500" />
                ) : (
                  <IconStar className="h-5 w-5" />
                )}
              </button>
            </div>
            <div>
              <h3 className="font-medium text-lg">{communication.subject}</h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${getStatusColor(communication.status)}`}
                >
                  {getStatusText(communication.status)}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${getDirectionColor(communication.direction)}`}
                >
                  {getDirectionText(communication.direction)}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {getTypeText(communication.type)}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                <IconUser className="h-3.5 w-3.5 mr-1" />
                {communication.clientName}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-3 md:mt-0">
            <div className="text-sm text-gray-600 dark:text-gray-400 mr-2">
              {communication.scheduledAt ? (
                <span className="whitespace-nowrap flex items-center">
                  <IconCalendar className="h-3.5 w-3.5 mr-1" />
                  {formatDate(communication.scheduledAt)}
                </span>
              ) : (
                <span className="whitespace-nowrap flex items-center">
                  <IconClock className="h-3.5 w-3.5 mr-1" />
                  {formatDate(communication.createdAt)}
                </span>
              )}
            </div>
            <button
              onClick={() =>
                setSelectedCommunication(isSelected ? null : communication.id)
              }
              className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label={
                isSelected
                  ? t("crm.communications.hideDetails")
                  : t("crm.communications.viewDetails")
              }
            >
              <IconEye className="h-5 w-5" />
            </button>
            <button
              className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label={t("crm.communications.edit")}
            >
              <IconEdit className="h-5 w-5" />
            </button>
            <button
              className="p-1.5 rounded-full text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              aria-label={t("crm.communications.delete")}
            >
              <IconTrash className="h-5 w-5" />
            </button>
          </div>
        </div>

        {isSelected && (
          <div className="mt-4 border-t pt-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 dark:text-gray-400 mb-1">
                  {t("crm.communications.details")}
                </p>
                <p className="flex flex-col">
                  <span className="flex items-center gap-1.5">
                    <IconUser className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-500 dark:text-gray-400 mr-1">
                      {t("crm.communications.client")}:
                    </span>
                    {communication.clientName}
                  </span>

                  {communication.propertyName && (
                    <span className="flex items-center gap-1.5 mt-1">
                      <IconHome className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-500 dark:text-gray-400 mr-1">
                        {t("crm.communications.property")}:
                      </span>
                      {communication.propertyName}
                    </span>
                  )}

                  {communication.dealName && (
                    <span className="flex items-center gap-1.5 mt-1">
                      <IconBuildingStore className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-500 dark:text-gray-400 mr-1">
                        {t("crm.communications.deal")}:
                      </span>
                      {communication.dealName}
                    </span>
                  )}

                  <span className="flex items-center gap-1.5 mt-1">
                    <IconUser className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-500 dark:text-gray-400 mr-1">
                      {t("crm.communications.responsibleAgent")}:
                    </span>
                    {communication.responsibleAgent}
                  </span>
                </p>
              </div>

              <div>
                <p className="text-gray-500 dark:text-gray-400 mb-1">
                  {t("crm.communications.dates")}
                </p>
                <p className="flex flex-col">
                  <span className="flex items-center gap-1.5">
                    <IconCalendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-500 dark:text-gray-400 mr-1">
                      {t("crm.communications.createdAt")}:
                    </span>
                    {formatDate(communication.createdAt)}
                  </span>

                  {communication.scheduledAt && (
                    <span className="flex items-center gap-1.5 mt-1">
                      <IconCalendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-500 dark:text-gray-400 mr-1">
                        {t("crm.communications.scheduledAt")}:
                      </span>
                      {formatDate(communication.scheduledAt)}
                    </span>
                  )}

                  {communication.completedAt && (
                    <span className="flex items-center gap-1.5 mt-1">
                      <IconCheck className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-500 dark:text-gray-400 mr-1">
                        {t("crm.communications.completedAt")}:
                      </span>
                      {formatDate(communication.completedAt)}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {communication.content && (
              <div className="mt-4">
                <p className="text-gray-500 dark:text-gray-400 mb-1">
                  {t("crm.communications.content")}
                </p>
                <p className="bg-gray-50 dark:bg-gray-900/30 p-3 rounded-md">
                  {communication.content}
                </p>
              </div>
            )}

            {communication.tags.length > 0 && (
              <div className="mt-4">
                <p className="text-gray-500 dark:text-gray-400 mb-1">
                  {t("crm.communications.tags")}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {communication.tags.map((tag, index) => (
                    <Tag key={index} text={tag} />
                  ))}
                </div>
              </div>
            )}

            {communication.attachments &&
              communication.attachments.length > 0 && (
                <div className="mt-4">
                  <p className="text-gray-500 dark:text-gray-400 mb-1">
                    {t("crm.communications.attachments")}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {communication.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="px-3 py-1.5 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 rounded-md text-sm flex items-center"
                      >
                        <IconFile className="h-4 w-4 mr-1.5" />
                        {attachment}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            <div className="mt-4 flex flex-wrap gap-2">
              <button className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm">
                {t("crm.communications.editCommunication")}
              </button>

              {communication.status !== "completed" && (
                <button
                  className="px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                  onClick={() =>
                    updateCommunicationStatus(communication.id, "completed")
                  }
                >
                  {t("crm.communications.markAsCompleted")}
                </button>
              )}

              {communication.status === "planned" && (
                <button
                  className="px-3 py-1.5 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 text-sm"
                  onClick={() =>
                    updateCommunicationStatus(communication.id, "in_progress")
                  }
                >
                  {t("crm.communications.startNow")}
                </button>
              )}

              {communication.status !== "cancelled" && (
                <button
                  className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                  onClick={() =>
                    updateCommunicationStatus(communication.id, "cancelled")
                  }
                >
                  {t("crm.communications.cancel")}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Компонент для фільтрів
  const FiltersPanel = () => {
    return (
      <div
        className={`
        p-4 mb-4 rounded-lg bg-gray-50 dark:bg-gray-900/30 transition-all
        ${showFilters ? "block" : "hidden"}
      `}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label
              className="text-sm font-medium block mb-1.5"
              htmlFor="status-filter"
            >
              {t("crm.communications.filterByStatus")}
            </label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as CommunicationStatus | "all")
              }
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <option value="all">{t("crm.communications.allStatuses")}</option>
              <option value="planned">
                {t("crm.communications.statuses.planned")}
              </option>
              <option value="in_progress">
                {t("crm.communications.statuses.in_progress")}
              </option>
              <option value="completed">
                {t("crm.communications.statuses.completed")}
              </option>
              <option value="cancelled">
                {t("crm.communications.statuses.cancelled")}
              </option>
            </select>
          </div>

          <div>
            <label
              className="text-sm font-medium block mb-1.5"
              htmlFor="type-filter"
            >
              {t("crm.communications.filterByType")}
            </label>
            <select
              id="type-filter"
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value as CommunicationType | "all")
              }
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <option value="all">{t("crm.communications.allTypes")}</option>
              <option value="call">{t("crm.communications.types.call")}</option>
              <option value="email">
                {t("crm.communications.types.email")}
              </option>
              <option value="meeting">
                {t("crm.communications.types.meeting")}
              </option>
              <option value="message">
                {t("crm.communications.types.message")}
              </option>
              <option value="telegram">
                {t("crm.communications.types.telegram")}
              </option>
              <option value="whatsapp">
                {t("crm.communications.types.whatsapp")}
              </option>
              <option value="note">{t("crm.communications.types.note")}</option>
            </select>
          </div>

          <div>
            <label
              className="text-sm font-medium block mb-1.5"
              htmlFor="direction-filter"
            >
              {t("crm.communications.filterByDirection")}
            </label>
            <select
              id="direction-filter"
              value={filterDirection}
              onChange={(e) =>
                setFilterDirection(
                  e.target.value as CommunicationDirection | "all",
                )
              }
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <option value="all">
                {t("crm.communications.allDirections")}
              </option>
              <option value="incoming">
                {t("crm.communications.directions.incoming")}
              </option>
              <option value="outgoing">
                {t("crm.communications.directions.outgoing")}
              </option>
              <option value="internal">
                {t("crm.communications.directions.internal")}
              </option>
            </select>
          </div>

          <div>
            <label
              className="text-sm font-medium block mb-1.5"
              htmlFor="sort-by"
            >
              {t("crm.communications.sortBy")}
            </label>
            <div className="flex gap-2">
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="flex-grow px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <option value="subject">
                  {t("crm.communications.subject")}
                </option>
                <option value="clientName">
                  {t("crm.communications.client")}
                </option>
                <option value="createdAt">
                  {t("crm.communications.createdAt")}
                </option>
                <option value="scheduledAt">
                  {t("crm.communications.scheduledAt")}
                </option>
                <option value="completedAt">
                  {t("crm.communications.completedAt")}
                </option>
              </select>

              <button
                onClick={() =>
                  setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                }
                className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                {sortDirection === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showFavoritesOnly}
              onChange={(e) => setShowFavoritesOnly(e.target.checked)}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
            <span className="ms-3 text-sm font-medium">
              {t("crm.communications.showFavoritesOnly")}
            </span>
          </label>
        </div>
      </div>
    );
  };

  // Показуємо заглушку до монтування компонента
  if (!isMounted) {
    return <div className="w-full p-4 h-64" />;
  }

  // Рендеримо компонент
  return (
    <motion.div
      className="w-full p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {t("crm.sections.communications.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("crm.communications.subtitle")}
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IconSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={t("crm.communications.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center gap-1.5"
          >
            <IconFilter className="h-5 w-5" />
            <span className="hidden sm:inline">
              {t("crm.communications.filters")}
            </span>
          </button>

          <button className="px-3 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-1.5">
            <IconPlus className="h-5 w-5" />
            <span className="hidden sm:inline">
              {t("crm.communications.newCommunication")}
            </span>
          </button>
        </div>
      </div>

      <FiltersPanel />

      <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-sm p-1 md:p-4">
        {filteredCommunications.length > 0 ? (
          <div className="space-y-1">
            {filteredCommunications.map((communication) => (
              <CommunicationRow
                key={communication.id}
                communication={communication}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <IconMessageCircle className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>{t("crm.communications.noCommunicationsFound")}</p>
            <div className="flex justify-center mt-4 space-x-2">
              <button className="px-4 py-2 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600">
                {t("crm.communications.createFirstCommunication")}
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
