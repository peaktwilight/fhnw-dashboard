'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import ResourcesSection from './ResourcesSection';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Home() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-orange-200 border-t-orange-500 animate-spin" />
      </div>
    }>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative"
      >
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-16 sm:pt-20 sm:pb-24">
            <div className="relative text-center">
              {/* Badge */}
              <motion.div variants={itemVariants} className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/50">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {locale === 'de' ? 'Inoffizielles Studierenden-Tool' : 'Unofficial Student Tool'}
                  </span>
                </div>
              </motion.div>

              {/* Main heading */}
              <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
                  {locale === 'de' ? (
                    <>
                      Deine <span className="text-orange-500">FHNW</span> Tools
                      <br className="hidden sm:block" />
                      <span className="text-slate-500 dark:text-slate-400"> an einem Ort</span>
                    </>
                  ) : (
                    <>
                      Your <span className="text-orange-500">FHNW</span> Tools
                      <br className="hidden sm:block" />
                      <span className="text-slate-500 dark:text-slate-400"> in One Place</span>
                    </>
                  )}
                </h1>
                <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
                  {t('home.subtitle')}
                </p>
              </motion.div>

              {/* CTA buttons */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Link
                  href={`/${locale}/grades`}
                  className="group flex items-center gap-2 px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-300 hover:-translate-y-0.5"
                >
                  {locale === 'de' ? 'Noten verwalten' : 'Manage Grades'}
                  <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href={`/${locale}/campus`}
                  className="group flex items-center gap-2 px-6 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-xl transition-all duration-300"
                >
                  {locale === 'de' ? 'Campus erkunden' : 'Explore Campus'}
                  <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div variants={itemVariants} className="flex items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {locale === 'de' ? '100% Kostenlos' : '100% Free'}
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  Open Source
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                  {locale === 'de' ? '2 Sprachen' : '2 Languages'}
                </span>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Resources Section */}
        <section className="py-16 sm:py-24 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <ResourcesSection />
          </div>
        </section>
      </motion.div>
    </Suspense>
  );
}
