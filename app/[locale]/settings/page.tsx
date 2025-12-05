'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

// Use dynamic imports to ensure client-only rendering
const ThemeSettings = dynamic(() => import('../../components/settings/ThemeSettings'), {
  ssr: false,
  loading: () => <div className="h-32 w-full animate-pulse bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
});

const LanguageSwitcher = dynamic(() => import('../../components/settings/LanguageSwitcher'), {
  ssr: false,
  loading: () => <div className="h-32 w-full animate-pulse bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
});

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

export default function SettingsPage() {
  const t = useTranslations('common');

  return (
    <div className="bg-slate-50 dark:bg-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700"
        >
          <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {t('settings')}
            </h1>
          </div>
          
          <div className="p-4 sm:p-6 space-y-8">
            <ThemeSettings />
            <LanguageSwitcher />
          </div>
        </motion.div>
      </div>
    </div>
  );
} 