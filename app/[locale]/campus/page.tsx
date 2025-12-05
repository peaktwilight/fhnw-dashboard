'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import WeatherWidget from '@/app/components/WeatherWidget';
import StationBoard from '@/app/components/StationBoard';
import MenuDisplay from '@/app/components/MenuDisplay';
import MapWidget from '@/app/components/MapWidget';
import SectionHeader from '@/app/components/SectionHeader';
import { useTranslations } from 'next-intl';

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

// Live indicator component
const LiveIndicator = () => {
  const t = useTranslations('common');

  const getFallbackTranslation = (key: string): string => {
    const fallbacks: Record<string, string> = {
      'live': 'Live'
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

export default function CampusPage() {
  // Move all hooks outside try-catch
  const t = useTranslations('campus');
  const transportT = useTranslations('transport');
  const mensaT = useTranslations('mensa');
  const weatherT = useTranslations('weather');

  // Define fallback functions
  const getFallbackTranslation = (key: string, namespace: string): string => {
    const fallbacks: Record<string, Record<string, string>> = {
      campus: {
        'title': 'Student Campus Tools',
        'description': 'Everything you need to know about daily campus life at FHNW Brugg-Windisch.',
        'campus_map': 'Campus Map',
        'map_description': 'FHNW Campus Brugg-Windisch location'
      },
      transport: {
        'title': 'Transport',
        'train_departures': 'Train departures from Brugg station'
      },
      mensa: {
        'title': 'Today\'s Menu',
        'daily_offerings': 'FHNW Mensa daily offerings'
      },
      weather: {
        'title': 'Weather',
        'weather_in_brugg': 'Current weather in Brugg'
      }
    };
    return fallbacks[namespace]?.[key] || key;
  };

  // Wrap translation calls in try-catch
  const getTranslation = (key: string, translator: ReturnType<typeof useTranslations>, namespace: string): string => {
    try {
      return translator(key);
    } catch {
      return getFallbackTranslation(key, namespace);
    }
  };

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
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
          className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-100 dark:border-slate-700"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {getTranslation('title', t, 'campus')}
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            {getTranslation('description', t, 'campus')}
          </p>
        </motion.div>

        {/* Transport Section */}
        <motion.section variants={sectionVariants} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <SectionHeader
              title={getTranslation('title', transportT, 'transport')}
              subtitle={getTranslation('train_departures', transportT, 'transport')}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16v-4a2 2 0 00-2-2H6l3.47-3.47a4 4 0 015.66 0L18.59 10H14a2 2 0 00-2 2v4m-5 0v1a2 2 0 002 2h6a2 2 0 002-2v-1m-5 0h5" />
                </svg>
              }
              rightElement={<LiveIndicator />}
            />
          </div>
          <div className="p-4">
            <StationBoard />
          </div>
        </motion.section>

        {/* Menu Section */}
        <motion.section variants={sectionVariants} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <SectionHeader
              title={getTranslation('title', mensaT, 'mensa')}
              subtitle={getTranslation('daily_offerings', mensaT, 'mensa')}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
              rightElement={<LiveIndicator />}
            />
          </div>
          <div className="p-4">
            <MenuDisplay />
          </div>
        </motion.section>

        {/* Weather Section */}
        <motion.section variants={sectionVariants} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <SectionHeader
              title={getTranslation('title', weatherT, 'weather')}
              subtitle={getTranslation('weather_in_brugg', weatherT, 'weather')}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              }
              rightElement={<LiveIndicator />}
            />
          </div>
          <div className="p-4">
            <WeatherWidget />
          </div>
        </motion.section>

        {/* Campus Map Section */}
        <motion.section variants={sectionVariants} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <SectionHeader
              title={getTranslation('campus_map', t, 'campus')}
              subtitle={getTranslation('map_description', t, 'campus')}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              }
            />
          </div>
          <div className="p-4">
            <MapWidget />
          </div>
        </motion.section>
      </motion.div>
    </Suspense>
  );
} 