'use client';
import React, { Fragment, useState, useCallback } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { Registration } from '../../types/modules';
import { useTranslations } from 'next-intl';
import { XMarkIcon } from '@heroicons/react/24/outline';

export interface ModuleEditModalProps {
  module: Registration;
  onSave: (module: Registration) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function ModuleEditModal({ module, isOpen, onClose, onSave }: ModuleEditModalProps) {
  // Move hooks to the top level
  const t = useTranslations('modules');
  const commonT = useTranslations('common');
  const gradesT = useTranslations('grades');

  // Define fallback functions
  const getFallbackTranslation = useCallback((key: string): string => {
    const fallbacks: Record<string, string> = {
      'edit_module': 'Edit Module',
      'save': 'Save',
      'cancel': 'Cancel',
      'module_name': 'Module Name',
      'module_number': 'Module Number',
      'ects': 'ECTS Credits',
      'grade_weight': 'Grade Weight (%)'
    };
    return fallbacks[key] || key;
  }, []);

  const getCommonFallbackTranslation = useCallback((key: string): string => {
    const fallbacks: Record<string, string> = {
      'error': 'An error occurred',
      'save': 'Save',
      'cancel': 'Cancel'
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

  const getCommonTranslation = useCallback((key: string): string => {
    try {
      return commonT(key);
    } catch {
      return getCommonFallbackTranslation(key);
    }
  }, [commonT, getCommonFallbackTranslation]);

  const [ects, setEcts] = useState(module.moduleType?.ects || 0);
  const [weight, setWeight] = useState(module.moduleType?.weight || 0);

  const handleSave = () => {
    const updatedModule = {
      ...module,
      moduleType: module.moduleType 
        ? {
            ...module.moduleType,
            ects: ects,
            weight: weight
          }
        : {
            ects: ects,
            weight: weight,
            type: 'MAIN' as 'MAIN' | 'MSP' | 'EN'
          }
    };
    onSave(updatedModule);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-slate-800 text-left align-middle shadow-2xl transition-all">
                {/* Header with gradient background */}
                <div className="relative bg-gradient-to-r from-orange-500 to-amber-600 p-6 pb-8">
                  <div className="absolute inset-0 bg-black opacity-10"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start">
                      <Dialog.Title
                        as="h3"
                        className="text-2xl font-bold text-white"
                      >
                        {getTranslation('edit_module')}
                      </Dialog.Title>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="text-white/80 hover:text-white bg-white/20 rounded-lg p-1"
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </motion.button>
                    </div>
                    <p className="mt-2 text-orange-100">
                      Manage module settings and credits
                    </p>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white opacity-5 rounded-full"></div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Module Info Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                        {getTranslation('module_name')}
                      </label>
                      <div className="text-base font-semibold text-slate-900 dark:text-white">
                        {module.modulanlass.bezeichnung}
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                        {getTranslation('module_number')}
                      </label>
                      <div className="text-base font-semibold text-slate-900 dark:text-white">
                        {module.modulanlass.nummer}
                      </div>
                    </div>
                  </div>

                  {/* Editable Fields */}
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="ects" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                        {getTranslation('ects')}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          id="ects"
                          min="0"
                          max="15"
                          value={ects}
                          onChange={(e) => setEcts(parseInt(e.target.value) || 0)}
                          className="block w-full pl-4 pr-12 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-slate-500 dark:text-slate-400 font-medium">ECTS</span>
                        </div>
                      </div>
                    </div>

                    {module.moduleType?.type !== 'MAIN' && (
                      <div>
                        <label htmlFor="weight" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                          {getTranslation('grade_weight')}
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            id="weight"
                            min="0"
                            max="100"
                            value={weight}
                            onChange={(e) => setWeight(parseInt(e.target.value) || 0)}
                            className="block w-full pl-4 pr-12 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">%</span>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                          Weight of this grade type in the final module grade calculation
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 flex justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                  >
                    {getCommonTranslation('cancel')}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleSave}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-medium hover:from-orange-600 hover:to-amber-700 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {getCommonTranslation('save')}
                  </motion.button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 