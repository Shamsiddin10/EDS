"use client";

import { useLanguage } from "../context/LanguageContext";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-2 p-4">
      <button
        onClick={() => setLanguage('uz')}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
          language === 'uz' 
            ? 'bg-blue-600 text-white shadow-lg' 
            : 'bg-white/10 text-gray-400 hover:bg-white/20'
        }`}
      >
        UZ
      </button>
      <button
        onClick={() => setLanguage('ru')}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
          language === 'ru' 
            ? 'bg-blue-600 text-white shadow-lg' 
            : 'bg-white/10 text-gray-400 hover:bg-white/20'
        }`}
      >
        RU
      </button>
    </div>
  );
}
