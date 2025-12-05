'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../providers/ThemeProvider';
import { useTranslations } from 'next-intl';

export default function ThemeSettings() {
  const { theme, setTheme } = useTheme();
  
  // Move hooks outside try-catch
  const t = useTranslations('theme');
  const commonT = useTranslations('common');
  
  // Define fallback functions
  const getFallbackTranslation = (key: string): string => {
    const fallbacks: Record<string, string> = {
      'title': 'Theme Settings',
      'description': 'Choose your preferred theme for FHNW Dashboard',
      'dark_description': 'Use dark mode for the interface',
      'light_description': 'Use light mode for the interface',
      'system_description': 'Follow your system\'s theme settings'
    };
    return fallbacks[key] || key;
  };
  
  const getCommonFallbackTranslation = (key: string): string => {
    const fallbacks: Record<string, string> = {
      'light': 'Light',
      'dark': 'Dark',
      'system': 'System'
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

  const getCommonTranslation = (key: string): string => {
    try {
      return commonT(key);
    } catch {
      return getCommonFallbackTranslation(key);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          {getTranslation('title')}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {getTranslation('description')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Light Theme Option */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setTheme('light')}
          className={`p-4 rounded-lg border ${
            theme === 'light'
              ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
              : 'border-slate-200 dark:border-slate-700 hover:border-orange-500'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
            <div className={`h-4 w-4 rounded-full border ${
              theme === 'light' ? 'border-orange-500 bg-orange-500' : 'border-slate-300 dark:border-slate-600'
            }`}>
              {theme === 'light' && (
                <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
          <h3 className="font-medium text-slate-900 dark:text-white">{getCommonTranslation('light')}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {getTranslation('light_description')}
          </p>
        </motion.button>

        {/* Dark Theme Option */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setTheme('dark')}
          className={`p-4 rounded-lg border ${
            theme === 'dark'
              ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
              : 'border-slate-200 dark:border-slate-700 hover:border-orange-500'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <svg className="w-6 h-6 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
            <div className={`h-4 w-4 rounded-full border ${
              theme === 'dark' ? 'border-orange-500 bg-orange-500' : 'border-slate-300 dark:border-slate-600'
            }`}>
              {theme === 'dark' && (
                <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
          <h3 className="font-medium text-slate-900 dark:text-white">{getCommonTranslation('dark')}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {getTranslation('dark_description')}
          </p>
        </motion.button>

        {/* System Theme Option */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setTheme('system')}
          className={`p-4 rounded-lg border ${
            theme === 'system'
              ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
              : 'border-slate-200 dark:border-slate-700 hover:border-orange-500'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div className={`h-4 w-4 rounded-full border ${
              theme === 'system' ? 'border-orange-500 bg-orange-500' : 'border-slate-300 dark:border-slate-600'
            }`}>
              {theme === 'system' && (
                <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
          <h3 className="font-medium text-slate-900 dark:text-white">{getCommonTranslation('system')}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {getTranslation('system_description')}
          </p>
        </motion.button>
      </div>
    </div>
  );
} 