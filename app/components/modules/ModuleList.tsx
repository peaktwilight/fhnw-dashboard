'use client';
import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Registration } from '../../types/modules';
import { filterModules } from '../../utils/moduleUtils';
import { useTranslations } from 'next-intl';

interface ModuleListProps {
  modules: Registration[];
  searchTerm: string;
  onSelectModule: (module: Registration) => void;
}

export default function ModuleList({ modules, searchTerm, onSelectModule }: ModuleListProps) {
  const t = useTranslations('modules');
  const commonT = useTranslations('common');
  
  const getFallbackTranslation = useCallback((key: string): string => {
    const fallbacks: Record<string, string> = {
      'no_modules_found': 'No modules found matching your search.',
      'registered': 'Registered:'
    };
    return fallbacks[key] || key;
  }, []);
  
  const getTranslation = useCallback((key: string): string => {
    try {
      return t(key);
    } catch (error) {
      return getFallbackTranslation(key);
    }
  }, [t, getFallbackTranslation]);
  
  const filteredModules = filterModules(modules, searchTerm);

  return (
    <div className="p-6">
      <div className="space-y-3">
        {filteredModules.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">{getTranslation('no_modules_found')}</p>
          </div>
        ) : (
          filteredModules.map((reg, index) => (
            <motion.button
              key={reg.modulanlassAnmeldungId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectModule(reg)}
              className="w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
            >
              <motion.div 
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors shadow-sm hover:shadow-md"
                layoutId={`module-${reg.modulanlassAnmeldungId}`}
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {reg.modulanlass.bezeichnung}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {reg.modulanlass.anlassleitungen[0]?.leitungsperson.vorname}{' '}
                    {reg.modulanlass.anlassleitungen[0]?.leitungsperson.nachname}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {reg.freieNote === null ? (
                      <>
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{getTranslation('registered')} {new Date(reg.anmeldungsDatum).toLocaleDateString()}</span>
                      </>
                    ) : (
                      <>
                        <span>{new Date(reg.modulanlass.datumVon).toLocaleDateString()}</span>
                        <span className="mx-2">—</span>
                        <span>{new Date(reg.modulanlass.datumBis).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                  {reg.modulanlass.wochentag && reg.freieNote === null && (
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{reg.modulanlass.wochentag} {reg.modulanlass.zeitVon} - {reg.modulanlass.zeitBis}</span>
                    </div>
                  )}
                </div>
                {reg.freieNote !== null && (
                  <motion.div 
                    className={`ml-4 px-3 py-1 rounded-full ${
                      reg.freieNote && reg.freieNote >= 4
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                        : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {reg.freieNote?.toFixed(1)}
                  </motion.div>
                )}
              </motion.div>
            </motion.button>
          ))
        )}
      </div>
    </div>
  );
} 