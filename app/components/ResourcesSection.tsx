'use client';

import { motion } from 'framer-motion';
import {
  AcademicCapIcon,
  BookOpenIcon,
  CalendarIcon,
  EnvelopeIcon,
  UserGroupIcon,
  BuildingLibraryIcon,
} from '@heroicons/react/24/outline';

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

const resources = [
  {
    title: 'Moodle',
    description: 'Access your course materials and assignments.',
    icon: <BookOpenIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    link: 'https://moodle.fhnw.ch'
  },
  {
    title: 'Student Portal',
    description: 'Manage your student account and view important information.',
    icon: <UserGroupIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    link: 'https://portal.fhnw.ch'
  },
  {
    title: 'Webmail',
    description: 'Access your FHNW email account.',
    icon: <EnvelopeIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    link: 'https://webmail.fhnw.ch'
  },
  {
    title: 'Library',
    description: 'Search for books, journals, and other academic resources.',
    icon: <BuildingLibraryIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    link: 'https://library.fhnw.ch'
  },
  {
    title: 'Event Calendar',
    description: 'View upcoming FHNW events and important dates.',
    icon: <CalendarIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    link: 'https://www.fhnw.ch/en/events'
  },
  {
    title: 'Career Services',
    description: 'Find internships, jobs, and career development resources.',
    icon: <AcademicCapIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    link: 'https://www.fhnw.ch/en/degree-programmes/career'
  }
];

export default function ResourcesSection() {
  return (
    <motion.section variants={sectionVariants}>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resource, index) => (
            <motion.a
              key={index}
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
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
                  {resource.icon}
                </motion.div>
                <motion.h3 
                  className="text-lg font-semibold text-gray-900 dark:text-white mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {resource.title}
                </motion.h3>
                <motion.p 
                  className="text-sm text-gray-600 dark:text-gray-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {resource.description}
                </motion.p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </motion.section>
  );
} 