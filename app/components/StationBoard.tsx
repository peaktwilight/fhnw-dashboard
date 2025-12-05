'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Departure {
  stop: {
    departure: string;
    platform: string;
    prognosis: {
      departure: string | null;
      platform: string | null;
    };
  };
  name: string;
  category: string;
  to: string;
  operator: string;
  number: string;
  passList?: Array<{
    station: {
      name: string;
    };
    arrival: string | null;
    departure: string | null;
  }>;
}

// Add animation variants before the component
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const departureVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 }
  },
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 }
  }
};

// Add AnimatedDigit component for individual digit animations
function AnimatedDigit({ digit, unit }: { digit: string, unit?: string }) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 25,
        opacity: { duration: 0.2 }
      }}
      className="inline-flex items-baseline relative"
    >
      <span>{digit}</span>
      {unit && (
        <span className="text-xs ml-1 opacity-50">
          {unit}
        </span>
      )}
    </motion.div>
  );
}

// Add CountdownTimer component
function CountdownTimer({ departureTime }: { departureTime: Date }) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    status: 'future' | 'imminent' | 'departed';
  }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    status: 'future'
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = departureTime.getTime() - now.getTime();
      
      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, status: 'departed' });
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({
        hours,
        minutes,
        seconds,
        status: minutes < 5 ? 'imminent' : 'future'
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [departureTime]);

  if (timeLeft.status === 'departed') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-red-600 dark:text-red-400 font-medium text-sm flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span>Departed</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center gap-1 text-sm ${
        timeLeft.status === 'imminent'
          ? 'text-red-600 dark:text-red-400 font-medium' 
          : 'text-slate-600 dark:text-slate-400'
      }`}
    >
      <svg 
        className={`w-4 h-4 ${timeLeft.status === 'imminent' ? 'animate-pulse' : ''}`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      </svg>
      <div className="font-mono flex items-baseline gap-0.5">
        <AnimatePresence mode="popLayout" initial={false}>
          {timeLeft.hours > 0 && (
            <motion.div
              key="hours-section"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="flex items-baseline"
            >
              <div key={`hours-${timeLeft.hours}`} className="mr-1">
                <AnimatedDigit 
                  digit={timeLeft.hours.toString()} 
                  unit="h" 
                />
              </div>
              <motion.span key="hours-spacer" className="mx-1 opacity-50">:</motion.span>
            </motion.div>
          )}
          <div key={`minutes-${timeLeft.minutes}`} className="mr-1">
            <AnimatedDigit 
              digit={timeLeft.minutes.toString().padStart(2, '0')} 
              unit="m" 
            />
          </div>
          <motion.span key="minutes-spacer" className="mx-1 opacity-50">:</motion.span>
          <div key={`seconds-${timeLeft.seconds}`} className="mr-1">
            <AnimatedDigit 
              digit={timeLeft.seconds.toString().padStart(2, '0')} 
              unit="s" 
            />
          </div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function StationBoard() {
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDepartures() {
      try {
        setLoading(true);
        const response = await fetch(
          'https://transport.opendata.ch/v1/stationboard?station=Brugg&limit=6&show_tracks=1&show_delays=1&show_intermediate_stops=1'
        );
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error('Failed to fetch departures');
        }
        
        setDepartures(data.stationboard);
        setError(null);
      } catch (err) {
        console.error('StationBoard error:', err);
        setError('Could not load departure information');
      } finally {
        setLoading(false);
      }
    }

    fetchDepartures();
    // Refresh every 30 seconds
    const interval = setInterval(fetchDepartures, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4 backdrop-blur-sm"
      >
        <div className="animate-pulse space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-16 h-6 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="w-8 h-6 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="flex-1 h-6 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          ))}
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

  if (!departures || departures.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4 backdrop-blur-sm"
      >
        <div className="text-center text-slate-500 dark:text-slate-400">
          No departures available
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4 backdrop-blur-sm"
    >
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <AnimatePresence>
          {departures.map((departure, index) => {
            const scheduledTime = new Date(departure.stop.departure);
            const prognosisTime = departure.stop.prognosis.departure 
              ? new Date(departure.stop.prognosis.departure)
              : null;
            
            const delay = prognosisTime 
              ? Math.round((prognosisTime.getTime() - scheduledTime.getTime()) / 60000)
              : 0;

            // Determine train type icon
            const getTrainIcon = (category: string) => {
              switch(category.toLowerCase()) {
                case 'ir':
                  return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                  );
                case 's':
                  return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  );
                default:
                  return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                  );
              }
            };

            return (
              <motion.div 
                key={index}
                variants={departureVariants}
                whileHover="hover"
                className="bg-white/30 dark:bg-slate-700/30 rounded-lg p-2 sm:p-3 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col gap-2"
                >
                  {/* Top row: Time, Countdown, and Platform */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex items-center justify-between w-full sm:w-auto">
                      {/* Time Section */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm sm:text-base font-medium whitespace-nowrap">
                            {scheduledTime.toLocaleTimeString('de-CH', { 
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Platform - Moved to top right on mobile */}
                      {departure.stop.platform && (
                        <div className="flex items-center gap-1 sm:hidden">
                          <span className="px-1.5 py-0.5 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded font-medium whitespace-nowrap">
                            {departure.stop.platform}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Countdown */}
                    <div className="flex-shrink-0">
                      <CountdownTimer departureTime={prognosisTime || scheduledTime} />
                    </div>

                    {/* Platform - Hidden on mobile, shown on desktop */}
                    {departure.stop.platform && (
                      <div className="hidden sm:flex items-center gap-1 sm:ml-auto">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded font-medium whitespace-nowrap">
                          <span className="text-slate-600 dark:text-slate-300">Gleis </span>
                          {departure.stop.platform}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bottom row: Train Category, Destination, and Delay */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Train Category */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded font-medium text-sm sm:text-base">
                        {getTrainIcon(departure.category)}
                        <span className="whitespace-nowrap">{departure.category}</span>
                      </span>
                    </div>

                    {/* Destination */}
                    <div className="flex items-center gap-1.5 text-slate-900 dark:text-white min-w-0 flex-1">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                      <span className="font-medium truncate text-sm sm:text-base">
                        {departure.to}
                      </span>
                    </div>

                    {/* Delay */}
                    {delay > 0 && (
                      <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 whitespace-nowrap flex-shrink-0 text-sm sm:text-base">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">+{delay} min</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
} 