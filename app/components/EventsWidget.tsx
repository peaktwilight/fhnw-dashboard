'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  CalendarIcon, 
  ClockIcon,
  MapPinIcon,
  ArrowTopRightOnSquareIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/outline';

interface EventItem {
  title: string;
  link: string;
  date: string;
  time: string;
  description: string;
  location: string;
  school: string;
  image?: {
    src: string;
    alt: string;
  };
}

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

const itemVariants = {
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
    y: -4,
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

const ITEMS_PER_PAGE = 6;

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-4"
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <motion.div 
              className="h-5 w-24 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"
            />
            <motion.div 
              className="h-5 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 animate-pulse"
            />
          </div>
          <motion.div 
            className="h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"
          />
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <motion.div 
                key={i}
                className="h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"
                style={{ width: `${85 - i * 10}%` }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

export default function EventsWidget() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Calculate pagination
  const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE);
  const currentEvents = events.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching events...');

        // Construct URL with filters
        const params = new URLSearchParams({
          query: searchQuery,
          sortOrder: sortOrder
        });

        if (selectedLocations.length > 0) {
          params.append('locations', selectedLocations.join(','));
        }

        const response = await fetch(`/api/events?${params.toString()}`);
        const data = await response.json();
        
        if (!response.ok) {
          console.error('Error response:', data);
          throw new Error(data.error || 'Failed to fetch events');
        }
        
        if (!data.events || !Array.isArray(data.events)) {
          console.error('Invalid response format:', data);
          throw new Error('Invalid response format');
        }

        setEvents(data.events);
        if (data.availableLocations) {
          setAvailableLocations(data.availableLocations);
        }
      } catch (err) {
        console.error('Error in EventsWidget:', err);
        setError(err instanceof Error ? err.message : 'Failed to load events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [searchQuery, selectedLocations, sortOrder]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, selectedLocations, sortOrder]);

  const toggleLocation = (location: string) => {
    setSelectedLocations(prev => 
      prev.includes(location)
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  const clearFilters = () => {
    setSelectedLocations([]);
    setSearchQuery('');
    setSortOrder('asc');
  };

  const hasActiveFilters = selectedLocations.length > 0 || searchQuery || sortOrder !== 'asc';

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
      >
        <div className="flex items-center gap-3 text-red-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-medium">{error}</p>
        </div>
        <motion.button 
          onClick={() => window.location.reload()}
          className="mt-4 text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try again
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
    >
      <div className="flex flex-col gap-6">
        {/* Header with Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          {/* Filter Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FunnelIcon className="h-5 w-5" />
            <span>Filter</span>
            {hasActiveFilters && (
              <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full text-xs">
                {selectedLocations.length + (sortOrder !== 'asc' ? 1 : 0)}
              </span>
            )}
          </motion.button>

          {/* Sort Order Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowsUpDownIcon className="h-5 w-5" />
            <span className="sr-only">Toggle sort order</span>
            <span className="text-xs font-medium">
              {sortOrder === 'asc' ? 'Earliest first' : 'Latest first'}
            </span>
          </motion.button>

          <motion.a
            href="https://www.fhnw.ch/de/studium/informationsveranstaltungen"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-4 py-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All
            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
          </motion.a>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Filters</h3>
                  {hasActiveFilters && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearFilters}
                      className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1"
                    >
                      <XMarkIcon className="w-4 h-4" />
                      Clear all filters
                    </motion.button>
                  )}
                </div>

                {/* Location Filters */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Locations</h4>
                  <div className="flex flex-wrap gap-2">
                    {availableLocations.map((location) => (
                      <motion.button
                        key={location}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleLocation(location)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          selectedLocations.includes(location)
                            ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-2 border-blue-500/20'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {location}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Events Grid */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : events.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 text-gray-500 dark:text-gray-400"
          >
            <p className="font-medium">No events found</p>
            {hasActiveFilters && (
              <p className="text-sm mt-2">Try adjusting your filters</p>
            )}
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="wait">
                {currentEvents.map((event, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover="hover"
                    whileTap="tap"
                    layout
                    className="group"
                  >
                    <motion.a
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            {event.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <ClockIcon className="w-4 h-4" />
                            {event.time}
                          </span>
                        </div>
                        <h3 className="text-gray-900 dark:text-white font-semibold group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                          {event.title}
                        </h3>
                        {event.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                            {event.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <MapPinIcon className="w-4 h-4" />
                          {event.location}
                        </div>
                      </div>
                    </motion.a>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center items-center mt-8 gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="p-2 rounded-lg text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </motion.button>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="p-2 rounded-lg text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
} 