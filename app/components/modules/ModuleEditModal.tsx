import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Registration } from '../../types/modules';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModuleEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  module: Registration;
  onSave: (updatedModule: Registration) => void;
}

export const ModuleEditModal: React.FC<ModuleEditModalProps> = ({
  isOpen,
  onClose,
  module,
  onSave,
}) => {
  const [ects, setEcts] = React.useState(module.moduleType?.ects || 3);
  const [weight, setWeight] = React.useState(module.moduleType?.weight || 100);

  const handleSave = () => {
    const updatedModule = {
      ...module,
      moduleType: {
        ...module.moduleType,
        type: module.moduleType?.type || 'MAIN',
        ects,
        weight,
      },
    };
    onSave(updatedModule);
    onClose();
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
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                    Edit Module Details
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
                      ECTS Credits
                    </label>
                    <input
                      type="number"
                      id="ects"
                      min="0"
                      max="30"
                      step="0.5"
                      value={ects}
                      onChange={(e) => setEcts(parseFloat(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                    />
                  </div>

                  {module.moduleType?.type !== 'MAIN' && (
                    <div>
                      <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Grade Weight (%)
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
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Save Changes
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}; 