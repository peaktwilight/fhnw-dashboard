'use client';

import { motion } from 'framer-motion';
import {
  HomeIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  ClockIcon,
  ChartBarIcon,
  BookOpenIcon,
  BuildingOfficeIcon,
  PencilSquareIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';

const links = [
  {
    title: 'FHNW Homepage',
    description: 'Official website of FHNW',
    icon: <HomeIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    href: 'https://www.fhnw.ch'
  },
  {
    title: 'Modulplaner',
    description: 'Plan your module timetable',
    icon: <CalendarDaysIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    href: 'https://pub092.cs.technik.fhnw.ch/#/'
  },
  {
    title: 'StudentHub',
    description: 'Access modules map and more',
    icon: <AcademicCapIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    href: 'https://studenthub.technik.fhnw.ch/#/student'
  },
  {
    title: 'Auxilium Timetable',
    description: 'Check your class schedule',
    icon: <ClockIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    href: 'https://auxilium.webapps.fhnw.ch/student/timetable'
  },
  {
    title: 'Grades',
    description: 'Official grades page',
    icon: <ChartBarIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    href: 'https://auxilium.webapps.fhnw.ch/student/noten'
  },
  {
    title: 'Moodle',
    description: 'Access your course materials',
    icon: <BookOpenIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    href: 'https://moodle.fhnw.ch/login/index.php'
  },
  {
    title: 'Room Reservation',
    description: 'Book rooms and facilities',
    icon: <BuildingOfficeIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    href: 'https://raum.fhnw.ch/'
  },
  {
    title: 'ESP Registration',
    description: 'Register for courses',
    icon: <PencilSquareIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    href: 'https://esp.technik.fhnw.ch/Views/Register.aspx'
  }
];

export default function ResourcesSection() {
  return (
    <motion.section
      id="links"
      className="space-y-4 scroll-mt-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="flex flex-col gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2">
          <motion.div 
            className="text-blue-600 dark:text-blue-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <LinkIcon className="w-5 h-5" />
          </motion.div>
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white leading-none m-0">
              Quick Links
            </h2>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 ml-7 hidden sm:block">
          Frequently used FHNW resources
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {links.map((link, index) => (
          <motion.a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-blue-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-blue-500/10"
              initial={{ opacity: 0 }}
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
              <div className="mb-4">
                {link.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {link.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {link.description}
              </p>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </motion.section>
  );
} 