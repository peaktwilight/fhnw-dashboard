'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { 
  ChartBarIcon,
  MapIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import ResourcesSection from './ResourcesSection';

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

export default function Home() {
  const t = useTranslations();
  const locale = useLocale();

  const sections = [
    {
      title: t('home.sections.grades.title'),
      description: t('home.sections.grades.description'),
      icon: (
        <div className="inline-flex">
          <ChartBarIcon className="w-10 h-10 text-emerald-500/90 dark:text-emerald-400/90" />
        </div>
      ),
      features: [
        { text: t('home.sections.grades.features.moduleInfo'), color: 'emerald' },
        { text: t('home.sections.grades.features.gradeStats'), color: 'emerald' }
      ],
      href: '/grades'
    },
    {
      title: t('home.sections.campus.title'),
      description: t('home.sections.campus.description'),
      icon: (
        <div className="inline-flex">
          <MapIcon className="w-10 h-10 text-amber-500/90 dark:text-amber-400/90" />
        </div>
      ),
      features: [
        { text: t('home.sections.campus.features.mensa'), color: 'rose' },
        { text: t('home.sections.campus.features.weather'), color: 'sky' },
        { text: t('home.sections.campus.features.transport'), color: 'amber' }
      ],
      href: `/${locale}/campus`
    },
    {
      title: t('home.sections.news.title'),
      description: t('home.sections.news.description'),
      icon: (
        <div className="inline-flex">
          <CalendarIcon className="w-10 h-10 text-purple-500/90 dark:text-purple-400/90" />
        </div>
      ),
      features: [
        { text: t('home.sections.news.features.news'), color: 'violet' },
        { text: t('home.sections.news.features.updates'), color: 'fuchsia' }
      ],
      href: `/${locale}/news`
    }
  ];

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
        className="container mx-auto px-4 space-y-12 pb-8 max-w-6xl"
      >
        {/* Welcome Section */}
        <motion.div
          variants={sectionVariants}
          className="text-center py-12"
        >
          <div className="text-center py-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
              {t('home.title')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('home.subtitle')}
            </p>
            {/* Hidden SEO-friendly description - only visible to screen readers */}
            <div className="sr-only">
              <h2>{locale === 'de' ? 'Inoffizielles FHNW Studenten-Dashboard mit Campus-Tools, Notenverwaltung und aktuellen News' : 'Unofficial FHNW Student Dashboard with campus tools, grade management, and latest news'}</h2>
              <p>{locale === 'de' ? 'Entwickelt von Studenten für Studenten, um den Alltag an der FHNW zu vereinfachen. Zugriff auf Wetter, Transport, Noten und wichtige Ressourcen.' : 'Developed by students for students to simplify daily life at FHNW. Access to weather, transport, grades, and essential resources.'}</p>
            </div>
          </div>
        </motion.div>

        {/* Sections Grid */}
        <motion.div variants={sectionVariants}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sections.map((section) => (
              <Link key={section.title} href={section.href}>
                <motion.div
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="group relative overflow-hidden rounded-2xl bg-white/50 dark:bg-gray-800/50 p-8 cursor-pointer border border-gray-100/20 dark:border-gray-700/20 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300"
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
                  <div className="relative z-10">
                    <motion.div 
                      className="mb-6"
                      whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      {section.icon}
                    </motion.div>
                    <motion.h2
                      className="text-xl font-semibold text-gray-900 dark:text-white mb-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {section.title}
                    </motion.h2>
                    <motion.p 
                      className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {section.description}
                    </motion.p>
                    <motion.div 
                      className="flex flex-wrap gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {section.features.map((feature, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 text-xs font-medium bg-${feature.color}-100/30 dark:bg-${feature.color}-900/20 text-${feature.color}-700 dark:text-${feature.color}-300 rounded-full`}
                        >
                          {feature.text}
                        </span>
                      ))}
                    </motion.div>
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