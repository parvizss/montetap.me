"use client";

import { languages, Language } from "@/lib/translations";
import { useLanguage } from "@/lib/LanguageContext";
import { cn } from "@/lib/utils";

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className='flex gap-2 p-2 bg-white rounded-lg shadow-sm border'>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code as Language)}
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-md transition-all text-sm",
            language === lang.code
              ? "bg-blue-100 text-blue-700 font-medium"
              : "hover:bg-gray-100 text-gray-600",
          )}
        >
          <span>{lang.flag}</span>
          <span className='hidden md:inline'>{lang.label}</span>
          <span className='md:hidden text-xs uppercase'>{lang.code}</span>
        </button>
      ))}
    </div>
  );
};
