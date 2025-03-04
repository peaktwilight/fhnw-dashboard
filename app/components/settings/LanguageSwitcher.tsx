'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

export default function LanguageSwitcher() {
  // Move hook outside try-catch
  const t = useTranslations('common');
  
  // Define fallback function
  const getFallbackTranslation = (key: string): string => {
    const fallbacks: Record<string, string> = {
      'language_settings': 'Language Settings',
      'choose_language_description': 'Choose your preferred language for FHNW Dashboard',
      'english_description': 'Use English for all interface elements',
      'german_description': 'Use German for all interface elements'
    };
    return fallbacks[key] || key;
  };

  // Wrap translation calls in try-catch instead of the hook
  const getTranslation = (key: string): string => {
    try {
      return t(key);
    } catch {
      return getFallbackTranslation(key);
    }
  };
  
  const locale = useLocale();
  const pathname = usePathname();

  const switchLocale = async (newLocale: string) => {
    const currentPath = pathname.replace(`/${locale}`, '');
    const newPath = `/${newLocale}${currentPath}`;
    
    // Set the new URL and force a navigation
    window.location.href = newPath;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {getTranslation('language_settings')}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {getTranslation('choose_language_description')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* English Option */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => switchLocale('en')}
          className={`relative p-4 rounded-lg border cursor-pointer transition-all ${
            locale === 'en'
              ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800'
              : 'border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`flex items-center justify-center h-8 w-8 rounded-md ${
                locale === 'en' ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-gray-100 dark:bg-gray-800'
              }`}>
                <span className={`font-semibold text-sm ${
                  locale === 'en' ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                }`}>EN</span>
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-gray-900 dark:text-white">English</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {getTranslation('english_description')}
                </p>
              </div>
            </div>

            {locale === 'en' && (
              <div className="ml-4">
                <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* German Option */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => switchLocale('de')}
          className={`relative p-4 rounded-lg border cursor-pointer transition-all ${
            locale === 'de'
              ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800'
              : 'border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`flex items-center justify-center h-8 w-8 rounded-md ${
                locale === 'de' ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-gray-100 dark:bg-gray-800'
              }`}>
                <span className={`font-semibold text-sm ${
                  locale === 'de' ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                }`}>DE</span>
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-gray-900 dark:text-white">Deutsch</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {getTranslation('german_description')}
                </p>
              </div>
            </div>

            {locale === 'de' && (
              <div className="ml-4">
                <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 