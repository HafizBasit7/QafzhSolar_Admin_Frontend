import React, { createContext, useContext, useState, useEffect } from "react";
import i18n from "../i18n";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("ar"); // Default to Arabic
  const [isRTL, setIsRTL] = useState(true); // Default to RTL

  useEffect(() => {
    // Set initial language to Arabic
    i18n.changeLanguage("ar");
    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";
  }, []);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    setIsRTL(newLanguage === "ar");
    i18n.changeLanguage(newLanguage);
    document.documentElement.lang = newLanguage;
    document.documentElement.dir = newLanguage === "ar" ? "rtl" : "ltr";
  };

  const value = {
    language,
    isRTL,
    changeLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
