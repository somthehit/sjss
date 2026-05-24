"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "EN" | "NP";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: <T>(en: T, np: T) => T;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("EN");

  useEffect(() => {
    const saved = localStorage.getItem("preferred_lang") as Language;
    if (saved === "EN" || saved === "NP") {
      setLanguageState(saved);
    } else {
      // Browser language check
      const locale = navigator.language.toLowerCase();
      if (locale.includes("np") || locale.includes("ne")) {
        setLanguageState("NP");
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("preferred_lang", lang);
  };

  const t = <T,>(en: T, np: T): T => {
    return language === "EN" ? en : np;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
