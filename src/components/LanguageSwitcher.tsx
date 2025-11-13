'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">{t.nav.language}:</span>
      <div className="flex bg-gray-100 rounded-md p-1">
        <button
          onClick={() => setLanguage('de')}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            language === 'de'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          DE
        </button>
        <button
          onClick={() => setLanguage('en')}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            language === 'en'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          EN
        </button>
      </div>
    </div>
  );
}