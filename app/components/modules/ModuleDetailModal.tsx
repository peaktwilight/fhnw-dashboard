'use client';
import React, { useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Registration, backdropVariants, modalVariants } from '../../types/modules';
import { detectModuleType } from '../../utils/moduleUtils';
import { useTranslations } from 'next-intl';

interface ModuleDetailModalProps {
  module: Registration | null;
  onClose: () => void;
}

export default function ModuleDetailModal({ module, onClose }: ModuleDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('modules');
  const gradesT = useTranslations('grades');

  // Define fallback translations
  const getFallbackTranslation = useCallback((key: string): string => {
    const fallbacks: Record<string, string> = {
      'module_details': 'Module Details',
      'number': 'Number',
      'status': 'Status',
      'type': 'Type',
      'weight': 'Weight',
      'ects': 'ECTS',
      'enrolled': 'Enrolled',
      'capacity': 'Capacity',
      'fill_rate': 'Fill Rate',
      'schedule': 'Schedule',
      'instructors': 'Instructors',
      'grade': 'Grade'
    };
    return fallbacks[key] || key;
  }, []);

  // Wrap translation calls in try-catch
  const getTranslation = useCallback((key: string): string => {
    try {
      return t(key);
    } catch {
      try {
        return gradesT(key);
      } catch {
        return getFallbackTranslation(key);
      }
    }
  }, [t, gradesT, getFallbackTranslation]);

  // Handle click outside modal
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!module) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={backdropVariants}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div 
          ref={modalRef}
          variants={modalVariants}
          className="bg-white dark:bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-start">
              <motion.h3 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xl font-bold text-slate-900 dark:text-white"
              >
                {module.modulanlass.bezeichnung}
              </motion.h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors duration-200 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 space-y-4"
          >
            <div>
              <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">{getTranslation('module_details')}</h4>
              <p className="text-slate-900 dark:text-white mt-1">{getTranslation('number')}: {module.modulanlass.nummer}</p>
              <p className="text-slate-900 dark:text-white">{getTranslation('status')}: {module.statusName}</p>
              <div className="mt-2 flex flex-wrap gap-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{getTranslation('type')}</p>
                  <p className="text-slate-900 dark:text-white font-medium">
                    {module.moduleType?.type || detectModuleType(module).type}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{getTranslation('weight')}</p>
                  <p className="text-slate-900 dark:text-white font-medium">
                    {module.moduleType?.weight || detectModuleType(module).weight}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{getTranslation('ects')}</p>
                  <p className="text-slate-900 dark:text-white font-medium">
                    {module.moduleType?.ects || detectModuleType(module).ects}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{getTranslation('enrolled')}</p>
                  <p className="text-slate-900 dark:text-white font-medium">
                    {module.modulanlass.anzahlAnmeldung}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{getTranslation('capacity')}</p>
                  <p className="text-slate-900 dark:text-white font-medium">
                    {module.modulanlass.maxTeilnehmende}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{getTranslation('fill_rate')}</p>
                  <p className="text-slate-900 dark:text-white font-medium">
                    {Math.round((module.modulanlass.anzahlAnmeldung / module.modulanlass.maxTeilnehmende) * 100)}%
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">{getTranslation('schedule')}</h4>
              <p className="text-slate-900 dark:text-white mt-1">
                {new Date(module.modulanlass.datumVon).toLocaleDateString()} — 
                {new Date(module.modulanlass.datumBis).toLocaleDateString()}
              </p>
              {module.modulanlass.wochentag && (
                <p className="text-slate-900 dark:text-white">
                  {module.modulanlass.wochentag} {module.modulanlass.zeitVon} - {module.modulanlass.zeitBis}
                </p>
              )}
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">{getTranslation('instructors')}</h4>
              <div className="mt-1 space-y-2">
                {module.modulanlass.anlassleitungen.map((leitung, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-1">
                      <p className="text-slate-900 dark:text-white">
                        {leitung.leitungsperson.vorname} {leitung.leitungsperson.nachname}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {leitung.leitungsrolleBezeichnung}
                      </p>
                      <a
                        href={`mailto:${leitung.leitungsperson.email}`}
                        className="text-sm text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300"
                      >
                        {leitung.leitungsperson.email}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {module.freieNote !== null && (
              <div>
                <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">{getTranslation('grade')}</h4>
                <div className={`inline-block mt-1 px-3 py-1 rounded-full ${
                  module.freieNote >= 4
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
                }`}>
                  {module.freieNote.toFixed(1)}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 