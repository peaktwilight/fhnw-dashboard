'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export default function GradesPage() {
  const t = useTranslations('grades');

  const getFallbackTranslation = (key: string): string => {
    const fallbacks: Record<string, string> = {
      'page_title': 'Grade Management',
      'page_description': 'Track your grades, manage modules, and monitor your progress at FHNW.'
    };
    return fallbacks[key] || key;
  };

  const getTranslation = (key: string): string => {
    try {
      return t(key);
    } catch {
      return getFallbackTranslation(key);
    }
  };

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    }>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto space-y-8"
      >
        {/* Page Header */}
        <motion.div
          variants={sectionVariants}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {getTranslation('page_title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {getTranslation('page_description')}
          </p>
        </motion.div>

        {/* API Notice */}
        <motion.section variants={sectionVariants}>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Feature Temporarily Unavailable
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  The grades management feature is currently unavailable due to changes in the FHNW API that no longer support the required endpoints for module data access.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  We are monitoring for API updates and will restore this functionality once the necessary endpoints become available again.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Grades Widget - Commented out until API is fixed */}
        {/* <motion.section variants={sectionVariants}>
          <RegistrationWidget />
        </motion.section> */}
      </motion.div>
    </Suspense>
  );
} 