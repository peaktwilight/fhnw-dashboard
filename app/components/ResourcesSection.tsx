'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
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

export default function ResourcesSection() {
  // Move hook outside try-catch
  const t = useTranslations('resources');
  
  // Define fallback function
  const getFallbackTranslation = (key: string): string => {
    const fallbacks: Record<string, string> = {
      'quick_links': 'Quick Links',
      'description': 'Frequently used FHNW resources',
      'fhnw_homepage': 'FHNW Homepage',
      'fhnw_homepage_desc': 'Official website of FHNW',
      'modulplaner': 'Modulplaner',
      'modulplaner_desc': 'Plan your module timetable',
      'studenthub': 'StudentHub',
      'studenthub_desc': 'Access modules map and more',
      'auxilium_timetable': 'Auxilium Timetable',
      'auxilium_timetable_desc': 'Check your class schedule',
      'grades': 'Grades',
      'grades_desc': 'Official grades page',
      'moodle': 'Moodle',
      'moodle_desc': 'Access your course materials',
      'room_reservation': 'Room Reservation',
      'room_reservation_desc': 'Book rooms and facilities',
      'esp_registration': 'ESP Registration',
      'esp_registration_desc': 'Register for courses'
    };
    return fallbacks[key] || key;
  };

  // Wrap translation calls in try-catch instead of the hook
  const getTranslation = (key: string): string => {
    try {
      return t(key);
    } catch {
      return getFallbackTranslation(key);
    }
  };

  const links = [
    {
      title: getTranslation('fhnw_homepage'),
      description: getTranslation('fhnw_homepage_desc'),
      icon: <HomeIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
      href: 'https://www.fhnw.ch'
    },
    {
      title: getTranslation('modulplaner'),
      description: getTranslation('modulplaner_desc'),
      icon: <CalendarDaysIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
      href: 'https://pub092.cs.technik.fhnw.ch/#/'
    },
    {
      title: getTranslation('studenthub'),
      description: getTranslation('studenthub_desc'),
      icon: <AcademicCapIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
      href: 'https://studenthub.technik.fhnw.ch/#/student'
    },
    {
      title: getTranslation('auxilium_timetable'),
      description: getTranslation('auxilium_timetable_desc'),
      icon: <ClockIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
      href: 'https://auxilium.webapps.fhnw.ch/student/timetable'
    },
    {
      title: getTranslation('grades'),
      description: getTranslation('grades_desc'),
      icon: <ChartBarIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
      href: 'https://auxilium.webapps.fhnw.ch/student/noten'
    },
    {
      title: getTranslation('moodle'),
      description: getTranslation('moodle_desc'),
      icon: <BookOpenIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
      href: 'https://moodle.fhnw.ch/login/index.php'
    },
    {
      title: getTranslation('room_reservation'),
      description: getTranslation('room_reservation_desc'),
      icon: <BuildingOfficeIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
      href: 'https://raum.fhnw.ch/'
    },
    {
      title: getTranslation('esp_registration'),
      description: getTranslation('esp_registration_desc'),
      icon: <PencilSquareIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
      href: 'https://esp.technik.fhnw.ch/Views/Register.aspx'
    }
  ];

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
              {getTranslation('quick_links')}
            </h2>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 ml-7 hidden sm:block">
          {getTranslation('description')}
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