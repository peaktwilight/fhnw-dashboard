'use client';
import React, { useCallback } from 'react';
import { useTranslations } from 'next-intl';

export default function MenuDisplay() {
  const mensaUrl = 'https://web.sv-restaurant.ch/menu/FHNW,%20Windisch/Mittagsmen%C3%BC';

  const t = useTranslations('mensa');
  const getFallbackTranslation = useCallback((key: string): string => {
    const fallbacks: Record<string, string> = {
      'title': 'Mensa Menu (Brugg-Windisch)',
      'description': 'View the current daily menu offerings on the official SV Restaurant website.',
      'view_menu_button': 'View Brugg-Windisch Menu'
    };
    return fallbacks[key] || key;
  }, []);

  const getTranslation = useCallback((key: string): string => {
    try {
      return t(key);
    } catch {
      return getFallbackTranslation(key);
    }
  }, [t, getFallbackTranslation]);

  return (
    <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm p-6 text-center">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        {getTranslation('title')}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        {getTranslation('description')}
      </p>
      <a
        href={mensaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
      >
        <span className="text-white">{getTranslation('view_menu_button')}</span>
        <svg
          className="w-4 h-4 ml-2 stroke-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </a>
    </div>
  );
} 