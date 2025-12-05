'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import NewsWidget from '@/app/components/NewsWidget';
import SectionHeader from '@/app/components/SectionHeader';
import { useTranslations } from 'next-intl';
import PageTransition from '@/app/components/PageTransition';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { containerVariants, sectionVariants } from '@/app/utils/animationUtils';

// Live indicator component
const LiveIndicator = () => {
  const commonT = useTranslations('common');

  const getFallbackTranslation = (key: string): string => {
    const fallbacks: Record<string, string> = {
      'live': 'Live'
    };
    return fallbacks[key] || key;
  };

  const getTranslation = (key: string): string => {
    try {
      return commonT(key);
    } catch {
      return getFallbackTranslation(key);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center h-5 px-1.5 text-[10px] font-medium tracking-wide uppercase rounded-full bg-green-100 dark:bg-green-900/30 ml-2 text-green-700 dark:text-green-300"
    >
      <motion.div
        className="w-1.5 h-1.5 mr-1 rounded-full bg-green-500 dark:bg-green-400"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.7, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      {getTranslation('live')}
    </motion.div>
  );
};

export default function NewsPage() {
  const t = useTranslations('news');

  const getFallbackTranslation = (key: string): string => {
    const fallbacks: Record<string, string> = {
      'page_title': 'News & Events',
      'page_description': 'Stay updated with the latest FHNW news and upcoming events.',
      'fhnw_news': 'FHNW News',
      'latest_updates': 'Latest updates and announcements',
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
    <PageTransition>
      <Suspense fallback={<LoadingSpinner size="large" className="min-h-screen" />}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container mx-auto space-y-8"
        >
          {/* Page Header */}
          <motion.div
            variants={sectionVariants}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-100 dark:border-slate-700"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {getTranslation('page_title')}
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              {getTranslation('page_description')}
            </p>
          </motion.div>

          {/* News Section */}
          <motion.section variants={sectionVariants} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <SectionHeader
                title={getTranslation('fhnw_news')}
                subtitle={getTranslation('latest_updates')}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                }
                rightElement={<LiveIndicator />}
              />
            </div>
            <div className="p-4">
              <NewsWidget />
            </div>
          </motion.section>
        </motion.div>
      </Suspense>
    </PageTransition>
  );
}