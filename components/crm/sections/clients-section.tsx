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
  IconMapPin,
  IconUser,
  IconBuilding,
  IconUserCircle,
  IconCalendar,
  IconAlertCircle,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";

import { useTranslation } from "@/hooks/useTranslation";
import { useUsers } from "@/hooks/useUsers";
import { User, UpdateUserRequest } from "@/lib/api-client";
import { CreateUserModal } from "@/components/crm/create-user-modal";

// Типи клієнтів та їх статуси (використовуємо з API)
type ClientType = "individual" | "company";
type ClientStatus = "active" | "inactive" | "potential" | "former";
type ClientPriority = "high" | "medium" | "low";

// Інтерфейс для клієнта (адаптер для User з API)
interface Client {
  id: string;
  name: string;
  type: ClientType;
  status: ClientStatus;
  priority: ClientPriority;
  isFavorite: boolean;
  phone: string;
  email: string;
  address?: string;
  createdAt: Date;
  lastContact?: Date;
  nextContact?: Date;
  responsibleAgent: string;
  notes?: string;
  tags: string[];
}

// Функція для конвертації User в Client
const userToClient = (user: User): Client => {
  // Виправляємо маппінг полів з API
  const clientStatus = (user as any).client_status || user.status || 'active';
  const userType = (user as any).user_type || user.type || 'individual';
  
  return {
    id: user.id,
    name: `${user.first_name} ${user.last_name}`,
    type: userType === 'client' ? 'individual' : userType, // client -> individual
    status: clientStatus as ClientStatus,
    priority: user.priority || 'medium',
    isFavorite: user.is_favorite || false,
    phone: user.phone || '',
    email: user.email || '',
    address: user.address || '',
    createdAt: new Date(user.created_at),
    lastContact: user.last_contact ? new Date(user.last_contact) : undefined,
    nextContact: user.next_contact ? new Date(user.next_contact) : undefined,
    responsibleAgent: user.responsible_agent || '',
    notes: user.notes || '',
    tags: user.tags || [],
  };
};

// Функція для конвертації Client в UpdateUserRequest
const clientToUpdateUser = (client: Partial<Client>): UpdateUserRequest => {
  const [first_name, ...lastNameParts] = (client.name || '').split(' ');
  const last_name = lastNameParts.join(' ');
  
  return {
    first_name: first_name || undefined,
    last_name: last_name || undefined,
    email: client.email || undefined,
    phone: client.phone,
    type: client.type,
    status: client.status,
    priority: client.priority,
    address: client.address,
    responsible_agent: client.responsibleAgent,
    notes: client.notes,
    tags: client.tags,
    is_favorite: client.isFavorite,
    last_contact: client.lastContact?.toISOString(),
    next_contact: client.nextContact?.toISOString(),
  };
};

export function ClientsSection() {
  const { t } = useTranslation();
  const { 
    users, 
    loading, 
    error, 
    fetchUsers,
    createUser,
    updateUser, 
    deleteUser,
    refreshUsers,
    totalUsers,
    totalPages,
    currentPage 
  } = useUsers();
  
  const [isMounted, setIsMounted] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<ClientStatus | "all">("all");
  const [filterType, setFilterType] = useState<ClientType | "all">("all");
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<
    "name" | "createdAt" | "lastContact" | "nextContact"
  >("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);

  // Ефект для конвертації користувачів з API в клієнтів
  useEffect(() => {
    const convertedClients = users.map(userToClient);
    setClients(convertedClients);
  }, [users]);

  // Ефект для монтування компонента
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Ефект для фільтрації та сортування клієнтів
  useEffect(() => {
    let result = [...clients];

    // Фільтрація за обраними зірочкою
    if (showFavoritesOnly) {
      result = result.filter((client) => client.isFavorite);
    }

    // Фільтрація за статусом
    if (filterStatus !== "all") {
      result = result.filter((client) => client.status === filterStatus);
    }

    // Фільтрація за типом
    if (filterType !== "all") {
      result = result.filter((client) => client.type === filterType);
    }

    // Пошук за текстом
    if (searchTerm) {
      const term = searchTerm.toLowerCase();

      result = result.filter(
        (client) =>
          client.name.toLowerCase().includes(term) ||
          client.email.toLowerCase().includes(term) ||
          client.phone.includes(term) ||
          (client.address && client.address.toLowerCase().includes(term)) ||
          client.responsibleAgent.toLowerCase().includes(term) ||
          (client.notes && client.notes.toLowerCase().includes(term)) ||
          client.tags.some((tag) => tag.toLowerCase().includes(term)),
      );
    }

    // Сортування
    result.sort((a, b) => {
      if (sortBy === "name") {
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        const aValue =
          a[sortBy] instanceof Date ? (a[sortBy] as Date)?.getTime() : 0;
        const bValue =
          b[sortBy] instanceof Date ? (b[sortBy] as Date)?.getTime() : 0;

        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined) return sortDirection === "asc" ? 1 : -1;
        if (bValue === undefined) return sortDirection === "asc" ? -1 : 1;

        return sortDirection === "asc"
          ? aValue < bValue
            ? -1
            : aValue > bValue
              ? 1
              : 0
          : aValue > bValue
            ? -1
            : aValue < bValue
              ? 1
              : 0;
      }
    });

    setFilteredClients(result);
  }, [
    clients,
    filterStatus,
    filterType,
    searchTerm,
    sortBy,
    sortDirection,
    showFavoritesOnly,
  ]);

  // Функція для отримання кольору статусу клієнта
  const getStatusColor = (status: ClientStatus) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
      case "potential":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "former":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  // Функція для отримання перекладу статусу клієнта
  const getStatusText = (status: ClientStatus) => {
    return t(`crm.clients.statuses.${status}`);
  };

  // Функція для отримання класу пріоритету
  const getPriorityClass = (priority: ClientPriority) => {
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

  // Функція для отримання іконки типу клієнта
  const getTypeIcon = (type: ClientType) => {
    switch (type) {
      case "individual":
        return (
          <IconUser className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        );
      case "company":
        return (
          <IconBuilding className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        );
      default:
        return <IconUser className="h-5 w-5" />;
    }
  };

  // Функція для отримання тексту типу клієнта
  const getTypeText = (type: ClientType) => {
    return t(`crm.clients.types.${type}`);
  };

  // Функція для форматування дати
  const formatDate = (date?: Date) => {
    if (!date) return "";

    return new Intl.DateTimeFormat("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  // Функція для форматування телефону
  const formatPhone = (phone: string) => {
    return phone.replace(
      /(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/,
      "+$1 ($2) $3-$4-$5",
    );
  };

  // Функція для зміни статусу "обраний"
  const toggleFavorite = async (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    const updateData = clientToUpdateUser({
      ...client,
      isFavorite: !client.isFavorite
    });

    const updatedUser = await updateUser(clientId, updateData);
    if (!updatedUser) {
      // Якщо оновлення не вдалося, можна показати помилку
      console.error('Не вдалося оновити користувача');
    }
  };

  // Функції для обробки дій з клієнтами
  const handleEditClient = (client: Client) => {
    console.log('Редагування клієнта:', client);
    // TODO: Відкрити модалку редагування клієнта
    alert(`Редагування клієнта: ${client.name}\nФункціонал буде доданий пізніше`);
  };

  const handleContactClient = (client: Client) => {
    console.log('Контакт з клієнтом:', client);
    // TODO: Відкрити модалку комунікації або перейти на сторінку контактів
    if (client.phone) {
      window.open(`tel:${client.phone}`, '_self');
    } else if (client.email) {
      window.open(`mailto:${client.email}`, '_self');
    } else {
      alert('Контактна інформація недоступна');
    }
  };

  const handleAddTask = (client: Client) => {
    console.log('Додавання завдання для клієнта:', client);
    // TODO: Відкрити модалку створення завдання
    alert(`Додавання завдання для: ${client.name}\nФункціонал буде доданий пізніше`);
  };



  // Компонент плашки для тегів
  const Tag = ({ text }: { text: string }) => (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
      {text}
    </span>
  );

  // Компонент для рядка клієнта
  const ClientRow = ({ client }: { client: Client }) => {
    const isSelected = selectedClient === client.id;

    return (
      <div
        className={`
        p-3 sm:p-4 mb-3 sm:mb-4 rounded-lg bg-card shadow-sm transition-all
        ${getPriorityClass(client.priority)}
        ${isSelected ? "ring-2 ring-blue-500 dark:ring-blue-400" : ""}
        hover:bg-gray-50 dark:hover:bg-gray-900/20
      `}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="flex items-start space-x-3">
            <div className="mt-0.5 flex flex-col items-center">
              {getTypeIcon(client.type)}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(client.id);
                }}
                className="mt-2 text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400"
                aria-label={
                  client.isFavorite
                    ? t("crm.clients.removeFromFavorites")
                    : t("crm.clients.addToFavorites")
                }
              >
                {client.isFavorite ? (
                  <IconStarFilled className="h-5 w-5 text-yellow-500" />
                ) : (
                  <IconStar className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-base sm:text-lg truncate">{client.name}</h3>
              <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                <span
                  className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs ${getStatusColor(client.status)}`}
                >
                  {getStatusText(client.status)}
                </span>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {getTypeText(client.type)}
                </span>
                {client.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {client.tags.slice(0, 1).map((tag, index) => (
                      <Tag key={index} text={tag} />
                    ))}
                    {client.tags.length > 1 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        +{client.tags.length - 1}
                      </span>
                    )}
                  </div>
                )}
              </div>
              {/* Контактна інформація */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {client.phone && (
                  <div className="flex items-center gap-1 min-w-0">
                    <IconPhone className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                    <span className="truncate">{formatPhone(client.phone)}</span>
                  </div>
                )}
                {client.email && (
                  <div className="flex items-center gap-1 min-w-0">
                    <IconMail className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-3 md:mt-0">
            <button
              onClick={() => setSelectedClient(isSelected ? null : client.id)}
              className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label={
                isSelected
                  ? t("crm.clients.hideDetails")
                  : t("crm.clients.viewDetails")
              }
            >
              <IconEye className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleEditClient(client)}
              className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label={t("crm.clients.edit")}
            >
              <IconEdit className="h-5 w-5" />
            </button>
            <button
              onClick={async () => {
                if (confirm(t("crm.clients.confirmDelete"))) {
                  const success = await deleteUser(client.id);
                  if (!success) {
                    alert(t("crm.clients.deleteError"));
                  }
                }
              }}
              className="p-1.5 rounded-full text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              aria-label={t("crm.clients.delete")}
            >
              <IconTrash className="h-5 w-5" />
            </button>
          </div>
        </div>

        {isSelected && (
          <div className="mt-3 sm:mt-4 border-t pt-3 sm:pt-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <p className="text-gray-500 dark:text-gray-400 mb-1">
                  {t("crm.clients.contactInfo")}
                </p>
                {client.phone && (
                  <p className="flex items-center gap-1.5">
                    <IconPhone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <a href={`tel:${client.phone}`} className="hover:underline">
                      {formatPhone(client.phone)}
                    </a>
                  </p>
                )}
                {client.email && (
                  <p className="flex items-center gap-1.5 mt-1">
                    <IconMail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <a
                      href={`mailto:${client.email}`}
                      className="hover:underline"
                    >
                      {client.email}
                    </a>
                  </p>
                )}
                {client.address && (
                  <p className="flex items-center gap-1.5 mt-1">
                    <IconMapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    {client.address}
                  </p>
                )}
              </div>

              <div>
                <p className="text-gray-500 dark:text-gray-400 mb-1">
                  {t("crm.clients.dates")}
                </p>
                <p className="flex items-center gap-1.5">
                  <IconCalendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-500 dark:text-gray-400 mr-1">
                    {t("crm.clients.createdAt")}:
                  </span>
                  {formatDate(client.createdAt)}
                </p>
                {client.lastContact && (
                  <p className="flex items-center gap-1.5 mt-1">
                    <IconCalendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-500 dark:text-gray-400 mr-1">
                      {t("crm.clients.lastContact")}:
                    </span>
                    {formatDate(client.lastContact)}
                  </p>
                )}
                {client.nextContact && (
                  <p className="flex items-center gap-1.5 mt-1">
                    <IconCalendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-500 dark:text-gray-400 mr-1">
                      {t("crm.clients.nextContact")}:
                    </span>
                    {formatDate(client.nextContact)}
                  </p>
                )}
              </div>

              <div>
                <p className="text-gray-500 dark:text-gray-400 mb-1">
                  {t("crm.clients.responsibleAgent")}
                </p>
                <p className="flex items-center gap-1.5">
                  <IconUserCircle className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  {client.responsibleAgent}
                </p>
              </div>
            </div>

            {client.notes && (
              <div className="mt-4">
                <p className="text-gray-500 dark:text-gray-400 mb-1">
                  {t("crm.clients.notes")}
                </p>
                <p className="bg-gray-50 dark:bg-gray-900/30 p-3 rounded-md">
                  {client.notes}
                </p>
              </div>
            )}

            {client.tags.length > 0 && (
              <div className="mt-4">
                <p className="text-gray-500 dark:text-gray-400 mb-1">
                  {t("crm.clients.tags")}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {client.tags.map((tag, index) => (
                    <Tag key={index} text={tag} />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <button 
                onClick={() => handleEditClient(client)}
                className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
              >
                {t("crm.clients.editClient")}
              </button>
              <button 
                onClick={() => handleContactClient(client)}
                className="px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
              >
                {t("crm.clients.contactClient")}
              </button>
              <button 
                onClick={() => handleAddTask(client)}
                className="px-3 py-1.5 bg-purple-500 text-white rounded-md hover:bg-purple-600 text-sm"
              >
                {t("crm.clients.addTask")}
              </button>
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label
              className="text-sm font-medium block mb-1.5"
              htmlFor="status-filter"
            >
              {t("crm.clients.filterByStatus")}
            </label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as ClientStatus | "all")
              }
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <option value="all">{t("crm.clients.allStatuses")}</option>
              <option value="active">{t("crm.clients.statuses.active")}</option>
              <option value="inactive">
                {t("crm.clients.statuses.inactive")}
              </option>
              <option value="potential">
                {t("crm.clients.statuses.potential")}
              </option>
              <option value="former">{t("crm.clients.statuses.former")}</option>
            </select>
          </div>

          <div>
            <label
              className="text-sm font-medium block mb-1.5"
              htmlFor="type-filter"
            >
              {t("crm.clients.filterByType")}
            </label>
            <select
              id="type-filter"
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value as ClientType | "all")
              }
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <option value="all">{t("crm.clients.allTypes")}</option>
              <option value="individual">
                {t("crm.clients.types.individual")}
              </option>
              <option value="company">{t("crm.clients.types.company")}</option>
            </select>
          </div>

          <div>
            <label
              className="text-sm font-medium block mb-1.5"
              htmlFor="sort-by"
            >
              {t("crm.clients.sortBy")}
            </label>
            <div className="flex gap-2">
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="flex-grow px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <option value="name">{t("crm.clients.name")}</option>
                <option value="createdAt">{t("crm.clients.createdAt")}</option>
                <option value="lastContact">
                  {t("crm.clients.lastContact")}
                </option>
                <option value="nextContact">
                  {t("crm.clients.nextContact")}
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
              {t("crm.clients.showFavoritesOnly")}
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

  return (
    <motion.div
      className="w-full p-4 sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >

      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">
              {t("crm.sections.clients.title")}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground hidden sm:block">{t("crm.clients.subtitle")}</p>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center gap-1.5"
            >
              <IconFilter className="h-5 w-5" />
              <span className="hidden sm:inline">
                {t("crm.clients.filters")}
              </span>
            </button>

            <button 
              onClick={() => setShowCreateUserModal(true)}
              className="px-3 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-1.5"
            >
              <IconPlus className="h-5 w-5" />
              <span className="hidden sm:inline">
                {t("crm.clients.newClient")}
              </span>
            </button>
          </div>
        </div>
        
        {/* Мобільний підзаголовок */}
        <div className="sm:hidden mb-3">
          <p className="text-sm text-muted-foreground">{t("crm.clients.subtitle")}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <div className="relative flex-grow max-w-md w-full sm:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IconSearch className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={t("crm.clients.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 sm:pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
          />
        </div>
      </div>

      <FiltersPanel />

      <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-sm p-2 sm:p-4">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">
              {t("common.loading")}
            </span>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-8 text-red-600 dark:text-red-400">
            <IconAlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && filteredClients.length > 0 && (
          <div className="space-y-1">
            {filteredClients.map((client) => (
              <ClientRow key={client.id} client={client} />
            ))}
          </div>
        )}

        {!loading && !error && filteredClients.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <IconUserCircle className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>{t("crm.clients.noClientsFound")}</p>
            <button className="mt-4 px-4 py-2 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600">
              {t("crm.clients.createFirstClient")}
            </button>
          </div>
        )}
      </div>

      {/* Пагінація */}
      {(totalPages > 1 || (totalUsers > 0 && filteredClients.length > 0)) && (
        <div className="mt-4 sm:mt-6">
          {/* Мобільна версія пагінації */}
          <div className="flex flex-col sm:hidden space-y-3">
            <div className="text-center text-xs text-gray-600 dark:text-gray-400">
              Сторінка {currentPage} з {totalPages} ({totalUsers} клієнтів)
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={() => fetchUsers({ page: currentPage - 1 })}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:hover:bg-gray-800 text-sm"
              >
                <IconChevronLeft className="h-4 w-4" />
                Попередня
              </button>
              
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const newPage = parseInt(e.target.value);
                    if (newPage >= 1 && newPage <= totalPages) {
                      fetchUsers({ page: newPage });
                    }
                  }}
                  className="w-16 px-2 py-1 text-center border border-gray-300 rounded text-sm dark:border-gray-700 dark:bg-gray-800"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">/ {totalPages}</span>
              </div>
              
              <button
                onClick={() => fetchUsers({ page: currentPage + 1 })}
                disabled={currentPage === Math.max(1, totalPages)}
                className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:hover:bg-gray-800 text-sm"
              >
                Наступна
                <IconChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Десктопна версія пагінації */}
          <div className="hidden sm:flex justify-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchUsers({ page: currentPage - 1 })}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <IconChevronLeft className="h-4 w-4" />
                Попередня
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => fetchUsers({ page: pageNum })}
                    className={`px-3 py-2 border rounded-md ${
                      pageNum === currentPage
                        ? "bg-blue-500 text-white border-blue-500"
                        : "border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => fetchUsers({ page: currentPage + 1 })}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:hover:bg-gray-800"
              >
                Наступна
                <IconChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модалка створення нового користувача */}
      <CreateUserModal
        isOpen={showCreateUserModal}
        onClose={() => setShowCreateUserModal(false)}
        onUserCreated={(user) => {
          setShowCreateUserModal(false);
          refreshUsers();
        }}
      />
    </motion.div>
  );
}
