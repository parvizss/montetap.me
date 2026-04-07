"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Language } from "@/lib/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Language;
    if (
      savedLang &&
      translations[savedLang] &&
      ["en", "me", "ru", "tr"].includes(savedLang)
    ) {
      setLanguage(savedLang);
    } else {
      setLanguage("en");
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t: translations[language] || translations["en"] || {},
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// Hər iki adı export edirik ki, import xətası olmasın
export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useTranslation must be used within LanguageProvider");
  return context;
};

export const useLanguage = useTranslation;
