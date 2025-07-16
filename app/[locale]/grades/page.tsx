'use client';

import { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RegistrationWidget from '@/app/components/RegistrationWidget';
import { useTranslations } from 'next-intl';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
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

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

export default function GradesPage() {
  const t = useTranslations('grades');
  const [showNotice, setShowNotice] = useState(true);
  const [registrations, setRegistrations] = useState<any[]>([]);

  useEffect(() => {
    // Check if notice has been dismissed before
    const dismissed = localStorage.getItem('api_notice_dismissed');
    if (dismissed) {
      setShowNotice(false);
    }

    // Load registrations to calculate stats
    const savedData = localStorage.getItem('studenthub_registrations');
    if (savedData) {
      try {
        setRegistrations(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading registrations:', error);
      }
    }
  }, []);

  const getFallbackTranslation = (key: string): string => {
    const fallbacks: Record<string, string> = {
      'page_title': 'Grade Management',
      'page_description': 'Track your grades, manage modules, and monitor your progress at FHNW.',
      'total_modules': 'Total Modules',
      'average_grade': 'Average Grade',
      'ects_earned': 'ECTS Earned',
      'pass_rate': 'Pass Rate'
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

  // Calculate quick stats
  const calculateStats = () => {
    if (!registrations || registrations.length === 0) {
      return { modules: 0, average: 0, ects: 0, passRate: 0 };
    }

    const modulesWithGrades = registrations.filter(r => r.freieNote !== null);
    const totalModules = registrations.length;
    const average = modulesWithGrades.length > 0 
      ? modulesWithGrades.reduce((sum, r) => sum + r.freieNote, 0) / modulesWithGrades.length
      : 0;
    const ects = registrations
      .filter(r => r.freieNote !== null && r.freieNote >= 4)
      .reduce((sum, r) => sum + (r.moduleType?.ects || 0), 0);
    const passRate = modulesWithGrades.length > 0
      ? (modulesWithGrades.filter(r => r.freieNote >= 4).length / modulesWithGrades.length) * 100
      : 0;

    return { 
      modules: totalModules, 
      average: average, 
      ects: ects, 
      passRate: passRate 
    };
  };

  const stats = calculateStats();

  const dismissNotice = () => {
    setShowNotice(false);
    localStorage.setItem('api_notice_dismissed', 'true');
  };

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    }>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="min-h-screen"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Page Header with gradient background */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-8 sm:p-12 text-white shadow-xl"
          >
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative z-10">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                {getTranslation('page_title')}
              </h1>
              <p className="text-lg sm:text-xl opacity-90 max-w-2xl">
                {getTranslation('page_description')}
              </p>
            </div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white opacity-5 rounded-full"></div>
            <div className="absolute -top-20 -right-40 w-80 h-80 bg-white opacity-5 rounded-full"></div>
          </motion.div>

          {/* Quick Stats Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {[
              { 
                label: getTranslation('total_modules'), 
                value: stats.modules.toString(), 
                icon: '📚',
                color: 'from-purple-400 to-purple-600'
              },
              { 
                label: getTranslation('average_grade'), 
                value: stats.average.toFixed(2), 
                icon: '📊',
                color: 'from-blue-400 to-blue-600'
              },
              { 
                label: getTranslation('ects_earned'), 
                value: stats.ects.toString(), 
                icon: '🎯',
                color: 'from-green-400 to-green-600'
              },
              { 
                label: getTranslation('pass_rate'), 
                value: `${stats.passRate.toFixed(0)}%`, 
                icon: '✨',
                color: 'from-orange-400 to-orange-600'
              }
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={cardVariants}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{stat.icon}</span>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} opacity-10`}></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* API Notice - Dismissible */}
          <AnimatePresence>
            {showNotice && (
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20 }}
                className="relative bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-600"
              >
                <button
                  onClick={dismissNotice}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 pr-8">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                      {getTranslation('api_shutdown_title')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {getTranslation('api_shutdown_message')}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Grades Widget */}
          <motion.section 
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
          >
            <RegistrationWidget />
          </motion.section>
        </div>
      </motion.div>
    </Suspense>
  );
} 