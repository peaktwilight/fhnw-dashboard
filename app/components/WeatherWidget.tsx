'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  SunIcon,
  MoonIcon,
  CloudIcon,
  CloudArrowDownIcon,
  SparklesIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import {
  containerVariants as weatherContainerVariants,
  cardVariants as weatherItemVariants,
  iconVariants as weatherIconVariants
} from '../utils/animationUtils';

interface WeatherData {
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    description: string;
    icon: string;
  };
  forecast: Array<{
    date: number;
    temp: {
      min: number;
      max: number;
    };
    description: string;
    icon: string;
  }>;
}

// Weather icon components using Heroicons
const WeatherIcons = {
  ClearDay: () => <SunIcon className="w-full h-full text-yellow-400" />,
  ClearNight: () => <MoonIcon className="w-full h-full text-blue-300" />,
  Clouds: () => <CloudIcon className="w-full h-full text-gray-400 dark:text-gray-500" />,
  Rain: () => <CloudArrowDownIcon className="w-full h-full text-blue-400" />,
  Snow: () => <SparklesIcon className="w-full h-full text-blue-200" />,
  Thunder: () => <BoltIcon className="w-full h-full text-yellow-400" />
};

function getWeatherIcon(code: string) {
  // Map OpenWeather icon codes to Heroicons
  if (code.startsWith('01')) {
    return code.endsWith('d') ? <WeatherIcons.ClearDay /> : <WeatherIcons.ClearNight />;
  }
  if (code.startsWith('02') || code.startsWith('03') || code.startsWith('04')) {
    return <WeatherIcons.Clouds />;
  }
  if (code.startsWith('09') || code.startsWith('10')) {
    return <WeatherIcons.Rain />;
  }
  if (code.startsWith('11')) {
    return <WeatherIcons.Thunder />;
  }
  if (code.startsWith('13')) {
    return <WeatherIcons.Snow />;
  }
  // Default to clear day if unknown
  return <WeatherIcons.ClearDay />;
}

export default function WeatherWidget() {
  // Move hooks outside try-catch
  const t = useTranslations('weather');
  // Only used for future reference
  // const commonT = useTranslations('common');

  // Define fallback functions
  const getFallbackTranslation = useCallback((key: string): string => {
    const fallbacks: Record<string, string> = {
      'error_fetching': 'Error fetching weather data',
      'feels_like': 'Feels like',
      'humidity': 'Humidity',
      'today': 'Today',
      'tomorrow': 'Tomorrow'
    };
    return fallbacks[key] || key;
  }, []);

  // Wrap translation calls in try-catch instead of the hook
  const getTranslation = useCallback((key: string): string => {
    try {
      return t(key);
    } catch {
      return getFallbackTranslation(key);
    }
  }, [t, getFallbackTranslation]);

  /* Commented out for future use
  const getCommonFallbackTranslation = useCallback((key: string): string => {
    const fallbacks: Record<string, string> = {
      'error': 'An error occurred',
      'loading': 'Loading...'
    };
    return fallbacks[key] || key;
  }, []);

  const getCommonTranslation = useCallback((key: string): string => {
    try {
      return commonT(key);
    } catch {
      return getCommonFallbackTranslation(key);
    }
  }, [commonT, getCommonFallbackTranslation]);
  */
  
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoading(true);
        // Brugg coordinates
        const lat = 47.4814;
        const lon = 8.2079;
        const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || getTranslation('error_fetching'));
        }
        
        setWeather(data);
        setError(null);
        setRetryCount(0);
      } catch (err) {
        console.error('Weather widget error:', err);
        setError(err instanceof Error ? err.message : getTranslation('error_fetching'));
        if (retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, Math.pow(2, retryCount) * 1000);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
  }, [getTranslation, retryCount]);

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm"
      >
        <div className="animate-pulse flex flex-col gap-4">
          {/* Current Weather Loading */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div>
                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>

          {/* Forecast Loading */}
          <div className="grid grid-cols-3 gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/30 dark:bg-gray-700/30 rounded-lg p-2">
                <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 w-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-red-50 dark:bg-red-900/50 rounded-lg p-4"
      >
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-sm font-medium">{error}</span>
        </div>
      </motion.div>
    );
  }

  if (!weather) return null;

  return (
    <motion.div 
      variants={weatherContainerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm"
    >
      <motion.div variants={weatherContainerVariants} className="flex flex-col gap-4">
        {/* Current Weather */}
        <motion.div variants={weatherItemVariants} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div 
              variants={weatherIconVariants}
              whileHover="hover"
              className="w-14 h-14"
            >
              {getWeatherIcon(weather.current.icon)}
            </motion.div>
            <motion.div variants={weatherItemVariants}>
              <motion.div 
                className="text-3xl font-bold text-gray-900 dark:text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {Math.round(weather.current.temp)}°C
              </motion.div>
              <motion.div 
                className="text-sm text-gray-600 dark:text-gray-300 capitalize"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {weather.current.description}
              </motion.div>
            </motion.div>
          </div>
          <motion.div 
            variants={weatherItemVariants}
            className="flex flex-col items-end gap-1"
          >
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>{getTranslation('feels_like')} {Math.round(weather.current.feels_like)}°C</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <span>{getTranslation('humidity')} {weather.current.humidity}%</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Forecast */}
        {weather.forecast.length > 0 && (
          <motion.div 
            variants={weatherContainerVariants}
            className="grid grid-cols-6 md:grid-cols-5 gap-2"
          >
            {weather.forecast.map((day, index) => (
              <motion.div
                key={index}
                variants={weatherItemVariants}
                whileHover={{ scale: 1.05 }}
                className={`bg-white/30 dark:bg-gray-700/30 rounded-lg p-2 ${
                  index < 2 ? 'col-span-3 md:col-span-1' : 'col-span-2 md:col-span-1'
                }`}
              >
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {index === 0 ? getTranslation('today') : 
                   index === 1 ? getTranslation('tomorrow') : 
                   new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {Math.round(day.temp.max)}°
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {Math.round(day.temp.min)}°
                    </span>
                  </div>
                  <div className="w-8 h-8">
                    {getWeatherIcon(day.icon)}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}