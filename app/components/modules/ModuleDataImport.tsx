'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { buttonVariants, tutorialStepVariants, Registration } from '../../types/modules';

interface ModuleDataImportProps {
  onDataImported: (data: Registration[]) => void;
}

export default function ModuleDataImport({ onDataImported }: ModuleDataImportProps) {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    window.open('https://studenthub.technik.fhnw.ch/#/student', '_blank');
  };

  const handleOpenAnmeldungen = () => {
    window.open('https://studenthub.technik.fhnw.ch/api/studenthub/anmeldungen', '_blank');
  };

  const handleParseJSON = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (Array.isArray(parsed)) {
        // Save to localStorage
        localStorage.setItem('studenthub_registrations', JSON.stringify(parsed));
        const timestamp = new Date().toISOString();
        localStorage.setItem('studenthub_last_updated', timestamp);
        
        onDataImported(parsed);
        setError(null);
      } else {
        setError('Invalid JSON: Expected an array of registrations.');
      }
    } catch {
      setError('Invalid JSON format.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-6 rounded-lg mb-6 shadow-sm"
        >
          <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How to Get Your Module Data
          </h3>
          <div className="space-y-6">
            {[
              {
                step: 1,
                title: "Log in to StudentHub",
                description: "First, click the button below to open StudentHub in a new tab. Log in with your FHNW account if you're not already logged in.",
                action: (
                  <motion.button
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={handleLogin}
                    className="mt-2 inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm shadow-md hover:shadow-lg"
                  >
                    <span>Open StudentHub</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </motion.button>
                )
              },
              {
                step: 2,
                title: "Get Your Module Data",
                description: "After logging in, click the button below to view your module data in a new tab:",
                action: (
                  <motion.button
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={handleOpenAnmeldungen}
                    className="mt-2 inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm shadow-md hover:shadow-lg"
                  >
                    <span>View Module Data</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </motion.button>
                ),
                note: (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-3 bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800"
                  >
                    <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                      <span className="font-medium">Important:</span> You should see a page with a lot of text that starts with <code className="bg-yellow-100 dark:bg-yellow-800 px-1 py-0.5 rounded">[{"{"}...</code> and ends with <code className="bg-yellow-100 dark:bg-yellow-800 px-1 py-0.5 rounded">...{"}"}]</code>
                    </p>
                    <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                      If you see an error message instead, go back to step 1 and make sure you&apos;re logged in.
                    </p>
                  </motion.div>
                )
              },
              {
                step: 3,
                title: "Copy Everything",
                description: "Select all the text on the page using:",
                shortcuts: [
                  { os: "Windows", keys: ["Ctrl", "A"] },
                  { os: "Mac", keys: ["⌘", "A"] }
                ]
              },
              {
                step: 4,
                title: "Paste & Load",
                description: "Paste the copied data in the box below using:",
                shortcuts: [
                  { os: "Windows", keys: ["Ctrl", "V"] },
                  { os: "Mac", keys: ["⌘", "V"] }
                ]
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                variants={tutorialStepVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3 relative"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold shadow-sm">
                  {step.step}
                </div>
                <div className="flex-1">
                  <p className="text-blue-800 dark:text-blue-200 font-medium">{step.title}</p>
                  <p className="text-blue-600 dark:text-blue-300 text-sm mt-1">
                    {step.description}
                  </p>
                  {step.shortcuts && (
                    <div className="mt-2 flex flex-wrap gap-3">
                      {step.shortcuts.map(shortcut => (
                        <div key={shortcut.os} className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300">
                          <span>{shortcut.os}:</span>
                          {shortcut.keys.map((key, keyIndex) => (
                            <React.Fragment key={key}>
                              <kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-600 rounded shadow">
                                {key}
                              </kbd>
                              {keyIndex < shortcut.keys.length - 1 && <span>+</span>}
                            </React.Fragment>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                  {step.action}
                  {step.note}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="relative">
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono text-sm"
              rows={8}
              placeholder="Paste your module data here..."
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
            />
            <motion.button
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              onClick={handleParseJSON}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <span>Load Data</span>
            </motion.button>
          </div>
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 p-4 rounded-lg border border-red-200 dark:border-red-800"
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
} 