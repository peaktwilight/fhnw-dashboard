'use client';
import React, { Fragment, useState, useCallback } from 'react';
import { Dialog, Transition } from '@headlessui/react';
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

  // Define fallback functions
  const getFallbackTranslation = useCallback((key: string): string => {
    const fallbacks: Record<string, string> = {
      'edit_module': 'Edit Module',
      'save': 'Save',
      'cancel': 'Cancel'
    };
    return fallbacks[key] || key;
  }, []);

  const getCommonFallbackTranslation = useCallback((key: string): string => {
    const fallbacks: Record<string, string> = {
      'error': 'An error occurred'
    };
    return fallbacks[key] || key;
  }, []);

  // Wrap translation calls in try-catch
  const getTranslation = useCallback((key: string): string => {
    try {
      return t(key);
    } catch {
      return getFallbackTranslation(key);
    }
  }, [t, getFallbackTranslation]);

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
          <div className="fixed inset-0 bg-black/25" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                  >
                    {getTranslation('edit_module')}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Module Name
                    </label>
                    <div className="mt-1 text-gray-900 dark:text-gray-100">
                      {module.modulanlass.bezeichnung}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Module Number
                    </label>
                    <div className="mt-1 text-gray-900 dark:text-gray-100">
                      {module.modulanlass.nummer}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="ects" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {getTranslation('ects')}
                    </label>
                    <input
                      type="number"
                      id="ects"
                      min="0"
                      max="15"
                      value={ects}
                      onChange={(e) => setEcts(parseInt(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                    />
                  </div>

                  {module.moduleType?.type !== 'MAIN' && (
                    <div>
                      <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {getTranslation('grade_weight')}
                      </label>
                      <input
                        type="number"
                        id="weight"
                        min="0"
                        max="100"
                        value={weight}
                        onChange={(e) => setWeight(parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    {getCommonTranslation('cancel')}
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    {getCommonTranslation('save')}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 