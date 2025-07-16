'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import RegistrationWidget from '@/app/components/RegistrationWidget';
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

        {/* API Shutdown Notice */}
        <motion.div
          variants={sectionVariants}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-start space-x-3">
            <svg className="w-6 h-6 text-gray-500 dark:text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {getTranslation('api_shutdown_title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {getTranslation('api_shutdown_message')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Grades Widget */}
        <motion.section variants={sectionVariants}>
          <RegistrationWidget />
        </motion.section>
      </motion.div>
    </Suspense>
  );
} 