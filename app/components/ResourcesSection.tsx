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
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function ResourcesSection() {
  const t = useTranslations('resources');

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

  const getTranslation = (key: string): string => {
    try { return t(key); } catch { return getFallbackTranslation(key); }
  };

  const links = [
    { title: getTranslation('fhnw_homepage'), description: getTranslation('fhnw_homepage_desc'), icon: HomeIcon, href: 'https://www.fhnw.ch', color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { title: getTranslation('modulplaner'), description: getTranslation('modulplaner_desc'), icon: CalendarDaysIcon, href: 'https://pub092.cs.technik.fhnw.ch/#/', color: 'text-teal-500', bg: 'bg-teal-500/10' },
    { title: getTranslation('studenthub'), description: getTranslation('studenthub_desc'), icon: AcademicCapIcon, href: 'https://studenthub.technik.fhnw.ch/#/student', color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { title: getTranslation('auxilium_timetable'), description: getTranslation('auxilium_timetable_desc'), icon: ClockIcon, href: 'https://auxilium.webapps.fhnw.ch/student/timetable', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { title: getTranslation('grades'), description: getTranslation('grades_desc'), icon: ChartBarIcon, href: 'https://auxilium.webapps.fhnw.ch/student/noten', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: getTranslation('moodle'), description: getTranslation('moodle_desc'), icon: BookOpenIcon, href: 'https://moodle.fhnw.ch/login/index.php', color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { title: getTranslation('room_reservation'), description: getTranslation('room_reservation_desc'), icon: BuildingOfficeIcon, href: 'https://raum.fhnw.ch/', color: 'text-sky-500', bg: 'bg-sky-500/10' },
    { title: getTranslation('esp_registration'), description: getTranslation('esp_registration_desc'), icon: PencilSquareIcon, href: 'https://esp.technik.fhnw.ch/Views/Register.aspx', color: 'text-purple-500', bg: 'bg-purple-500/10' }
  ];

  return (
    <motion.section
      id="links"
      className="scroll-mt-20 text-center"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <motion.div variants={itemVariants} className="mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
          {getTranslation('quick_links')}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          {getTranslation('description')}
        </p>
      </motion.div>

      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" variants={containerVariants}>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <motion.a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="group flex flex-col items-center text-center p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-lg transition-all"
            >
              <div className={`inline-flex p-2.5 rounded-lg ${link.bg} mb-4`}>
                <Icon className={`w-5 h-5 ${link.color}`} />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1.5 group-hover:text-orange-500 transition-colors flex items-center gap-2">
                {link.title}
                <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50 transition-opacity" />
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {link.description}
              </p>
            </motion.a>
          );
        })}
      </motion.div>
    </motion.section>
  );
}
