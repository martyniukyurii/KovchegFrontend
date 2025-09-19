"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  IconSearch,
  IconPlus,
  IconFile,
  IconFileDots,
  IconFileZip,
  IconFileSpreadsheet,
  IconDownload,
  IconTrash,
  IconEye,
  IconPencil,
  IconFilter,
  IconFolder,
} from "@tabler/icons-react";

import { useTranslation } from "@/hooks/useTranslation";

// Приклад типу документу
interface Document {
  id: string;
  name: string;
  type: "pdf" | "doc" | "xls" | "zip" | "folder";
  size: string;
  updatedAt: string;
  createdBy: string;
}

export function DocumentsSection() {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFolder, setCurrentFolder] = useState("root");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  // Приклад даних для демонстрації
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "Договір оренди.pdf",
      type: "pdf",
      size: "1.2 MB",
      updatedAt: "2023-05-15",
      createdBy: "Олександр Ковальчук",
    },
    {
      id: "2",
      name: "Комерційна пропозиція.doc",
      type: "doc",
      size: "540 KB",
      updatedAt: "2023-05-12",
      createdBy: "Марія Шевченко",
    },
    {
      id: "3",
      name: "Фінансовий звіт Q2.xls",
      type: "xls",
      size: "780 KB",
      updatedAt: "2023-05-10",
      createdBy: "Іван Петренко",
    },
    {
      id: "4",
      name: "Фотографії об'єкту.zip",
      type: "zip",
      size: "15.4 MB",
      updatedAt: "2023-05-08",
      createdBy: "Наталія Іваненко",
    },
    {
      id: "5",
      name: "Проекти договорів",
      type: "folder",
      size: "—",
      updatedAt: "2023-05-05",
      createdBy: "Олександр Ковальчук",
    },
  ]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Закриття випадного меню при кліку поза ним
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(event.target as Node)
      ) {
        setIsFilterMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterMenuRef]);

  if (!isMounted) {
    return (
      <div className="h-96 w-full animate-pulse bg-gray-100 dark:bg-neutral-800 rounded-xl" />
    );
  }

  // Функції для роботи з документами
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (type: string | null) => {
    setFilterType(type);
  };

  const handleSelectDocument = (id: string) => {
    if (selectedDocuments.includes(id)) {
      setSelectedDocuments(selectedDocuments.filter((docId) => docId !== id));
    } else {
      setSelectedDocuments([...selectedDocuments, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedDocuments.length === documents.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(documents.map((doc) => doc.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedDocuments.length === 0) return;
    setDocuments(
      documents.filter((doc) => !selectedDocuments.includes(doc.id)),
    );
    setSelectedDocuments([]);
  };

  const handleOpenFolder = (folderId: string) => {
    setCurrentFolder(folderId);
    // Тут буде логіка для завантаження вмісту папки
  };

  // Фільтруємо документи
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = filterType ? doc.type === filterType : true;

    return matchesSearch && matchesType;
  });

  // Іконка відповідно до типу документа
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <IconFile className="h-6 w-6 text-red-500" />;
      case "doc":
        return <IconFileDots className="h-6 w-6 text-blue-500" />;
      case "xls":
        return <IconFileSpreadsheet className="h-6 w-6 text-green-500" />;
      case "zip":
        return <IconFileZip className="h-6 w-6 text-purple-500" />;
      case "folder":
        return <IconFolder className="h-6 w-6 text-yellow-500" />;
      default:
        return <IconFile className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {t("crm.sections.documents.title")}
        </h2>
        <div className="flex items-center gap-2">
          <button className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors">
            <IconPlus className="mr-2 h-4 w-4 inline" />
            {t("crm.sections.documents.uploadNew")}
          </button>
        </div>
      </div>

      {/* Пошук і фільтрація */}
      <div className="mb-4 flex flex-wrap gap-3 items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-neutral-800">
        <div className="relative flex-grow max-w-md">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t("crm.sections.documents.searchPlaceholder")}
            className="w-full rounded-md border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative" ref={filterMenuRef}>
            <button
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium flex items-center gap-1 dark:border-neutral-700 dark:bg-neutral-900"
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            >
              <IconFilter className="h-4 w-4" />
              {t("crm.sections.documents.filter")}
            </button>
            {isFilterMenuOpen && (
              <div className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 dark:bg-neutral-800 dark:ring-neutral-700">
                <div className="py-1">
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-neutral-700"
                    onClick={() => {
                      handleFilterChange(null);
                      setIsFilterMenuOpen(false);
                    }}
                  >
                    {t("crm.sections.documents.allTypes")}
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-neutral-700"
                    onClick={() => {
                      handleFilterChange("pdf");
                      setIsFilterMenuOpen(false);
                    }}
                  >
                    PDF
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-neutral-700"
                    onClick={() => {
                      handleFilterChange("doc");
                      setIsFilterMenuOpen(false);
                    }}
                  >
                    DOC
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-neutral-700"
                    onClick={() => {
                      handleFilterChange("xls");
                      setIsFilterMenuOpen(false);
                    }}
                  >
                    XLS
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-neutral-700"
                    onClick={() => {
                      handleFilterChange("zip");
                      setIsFilterMenuOpen(false);
                    }}
                  >
                    ZIP
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-neutral-700"
                    onClick={() => {
                      handleFilterChange("folder");
                      setIsFilterMenuOpen(false);
                    }}
                  >
                    {t("crm.sections.documents.folders")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Таблиця документів */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-neutral-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
          <thead className="bg-gray-50 dark:bg-neutral-800">
            <tr>
              <th className="w-12 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  checked={
                    selectedDocuments.length === documents.length &&
                    documents.length > 0
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                {t("crm.sections.documents.name")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                {t("crm.sections.documents.size")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                {t("crm.sections.documents.updatedAt")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                {t("crm.sections.documents.createdBy")}
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                {t("crm.sections.documents.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-neutral-700 dark:bg-neutral-900">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <tr
                  key={doc.id}
                  className="hover:bg-gray-50 dark:hover:bg-neutral-800"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedDocuments.includes(doc.id)}
                      onChange={() => handleSelectDocument(doc.id)}
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      {getDocumentIcon(doc.type)}
                      <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {doc.type === "folder" ? (
                          <button
                            onClick={() => handleOpenFolder(doc.id)}
                            className="hover:underline text-left"
                          >
                            {doc.name}
                          </button>
                        ) : (
                          doc.name
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {doc.size}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {doc.updatedAt}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {doc.createdBy}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      {doc.type !== "folder" && (
                        <>
                          <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                            <IconEye className="h-4 w-4" />
                          </button>
                          <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                            <IconDownload className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                        <IconPencil className="h-4 w-4" />
                      </button>
                      <button className="text-red-500 hover:text-red-700">
                        <IconTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  {t("crm.sections.documents.noDocuments")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Панель дій з вибраними документами */}
      {selectedDocuments.length > 0 && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
          <span className="text-sm font-medium">
            {t("crm.sections.documents.selected").replace(
              "{count}",
              selectedDocuments.length.toString(),
            )}
          </span>
          <div className="flex-grow" />
          <button className="rounded-md bg-blue-500 px-3 py-1 text-sm font-medium text-white hover:bg-blue-600">
            <IconDownload className="mr-1 h-4 w-4 inline" />
            {t("crm.sections.documents.download")}
          </button>
          <button
            className="rounded-md bg-red-500 px-3 py-1 text-sm font-medium text-white hover:bg-red-600"
            onClick={handleDeleteSelected}
          >
            <IconTrash className="mr-1 h-4 w-4 inline" />
            {t("crm.sections.documents.delete")}
          </button>
        </div>
      )}
    </motion.div>
  );
}
