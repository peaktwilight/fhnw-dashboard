'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('settings');

  const switchLocale = async (newLocale: string) => {
    const currentPath = pathname.replace(`/${locale}`, '');
    const newPath = `/${newLocale}${currentPath}`;
    
    // Set the new URL and force a navigation
    window.location.href = newPath;
  };

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm text-gray-700 dark:text-gray-300">
        {t('language')}:
      </span>
      <div className="flex space-x-2">
        <button
          onClick={() => switchLocale('en')}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            locale === 'en'
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          English
        </button>
        <button
          onClick={() => switchLocale('de')}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            locale === 'de'
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          Deutsch
        </button>
      </div>
    </div>
  );
} 