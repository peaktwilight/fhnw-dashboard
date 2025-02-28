'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import RegistrationWidget from '@/app/components/RegistrationWidget';
import SectionHeader from '@/app/components/SectionHeader';

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
            Grade Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your grades, manage modules, and monitor your progress at FHNW.
          </p>
        </motion.div>

        {/* Grades Widget */}
        <motion.section variants={sectionVariants}>
          <RegistrationWidget />
        </motion.section>
      </motion.div>
    </Suspense>
  );
} 