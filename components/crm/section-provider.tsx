"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type CrmSectionType =
  | "analytics"
  | "calendar"
  | "deals"
  | "clients"
  | "properties"
  | "communications"
  | "documents"
  | "marketing"
  | "database";

interface CrmSectionContextType {
  activeSection: CrmSectionType;
  setActiveSection: (section: CrmSectionType) => void;
}

const CrmSectionContext = createContext<CrmSectionContextType>({
  activeSection: "analytics",
  setActiveSection: () => {},
});

export const useCrmSection = () => useContext(CrmSectionContext);

export function CrmSectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeSection, setActiveSection] =
    useState<CrmSectionType>("analytics");

  // Синхронізація стану з хешем URL
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");

      if (hash) {
        const isValidSection = (section: string): section is CrmSectionType => {
          return [
            "analytics",
            "calendar",
            "deals",
            "clients",
            "properties",
            "communications",
            "documents",
            "marketing",
            "database",
          ].includes(section);
        };

        if (isValidSection(hash)) {
          setActiveSection(hash);
        }
      }
    };

    handleHashChange(); // Перевірка хешу при завантаженні
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <CrmSectionContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </CrmSectionContext.Provider>
  );
}
