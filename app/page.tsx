'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  AcademicCapIcon,
  BuildingLibraryIcon,
  NewspaperIcon,
} from '@heroicons/react/24/outline';
import ResourcesSection from './components/ResourcesSection';

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

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1
    }
  }
};

const sections = [
  {
    title: 'Academic',
    description: 'Track your grades, manage modules, and monitor your academic journey.',
    icon: <AcademicCapIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    href: '/academic'
  },
  {
    title: 'Campus',
    description: 'Check weather, transport schedules, and find your way around campus.',
    icon: <BuildingLibraryIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    href: '/campus'
  },
  {
    title: 'News & Events',
    description: 'Stay updated with the latest FHNW news and upcoming events.',
    icon: <NewspaperIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    href: '/news'
  }
];

export default function Home() {
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
        className="container mx-auto space-y-8 pb-8"
      >
        {/* Welcome Section */}
        <motion.div
          variants={sectionVariants}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to FHNW Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Your unofficial student hub for campus resources, daily updates, and academic tracking.
          </p>
        </motion.div>

        {/* Sections Grid */}
        <motion.div variants={sectionVariants}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sections.map((section) => (
              <Link key={section.title} href={section.href}>
                <motion.div
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 cursor-pointer border border-gray-100 dark:border-gray-700"
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-blue-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-blue-500/10"
                    initial={{ opacity: 0, backgroundPosition: '0% 50%' }}
                    whileHover={{ 
                      opacity: 1,
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  <div className="flex flex-col items-center text-center relative z-10">
                    <motion.div 
                      className="mb-4"
                      whileHover={{ scale: 1.2, rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      {section.icon}
                    </motion.div>
                    <motion.h3 
                      className="text-lg font-semibold text-gray-900 dark:text-white mb-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {section.title}
                    </motion.h3>
                    <motion.p 
                      className="text-sm text-gray-600 dark:text-gray-300"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {section.description}
                    </motion.p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Resources Section */}
        <ResourcesSection />
      </motion.div>
    </Suspense>
  );
} 