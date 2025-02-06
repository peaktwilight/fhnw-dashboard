import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { 
  CalendarIcon, 
  ArrowTopRightOnSquareIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/outline';

interface NewsItem {
  title: string;
  link: string;
  date: string;
  description: string;
  category: string;
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

const buttonVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  tap: { 
    scale: 0.95,
    transition: {
      duration: 0.1
    }
  }
};

const ITEMS_PER_PAGE = 6;

// Helper function to format date for input
function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Get min and max dates for the date picker
const TODAY = new Date();
const THREE_YEARS_AGO = new Date(TODAY);
THREE_YEARS_AGO.setFullYear(TODAY.getFullYear() - 3);
const ONE_YEAR_AHEAD = new Date(TODAY);
ONE_YEAR_AHEAD.setFullYear(TODAY.getFullYear() + 1);

const MIN_DATE = formatDateForInput(THREE_YEARS_AGO);
const MAX_DATE = formatDateForInput(ONE_YEAR_AHEAD);

// Helper function to parse date string to timestamp
function getTimestamp(dateStr: string): number {
  // Parse date in format "DD.MM.YYYY"
  const [day, month, year] = dateStr.split('.').map(Number);
  return new Date(year, month - 1, day).getTime();
}

// Helper function to check if a date falls within a range
function isDateInRange(dateStr: string, fromDate: string, toDate: string): boolean {
  if (!fromDate && !toDate) return true;
  
  const date = getTimestamp(dateStr);
  
  // Convert ISO dates from input to timestamps
  const from = fromDate ? new Date(fromDate).getTime() : -Infinity;
  const to = toDate ? new Date(toDate).getTime() : Infinity;
  
  return date >= from && date <= to;
}

const shimmerAnimation = {
  initial: {
    backgroundPosition: "-468px 0",
  },
  animate: {
    backgroundPosition: ["468px 0", "-468px 0"],
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: "linear",
    },
  },
};

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
              variants={shimmerAnimation}
              initial="initial"
              animate="animate"
              className="h-5 w-24 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700"
            />
            <motion.div 
              variants={shimmerAnimation}
              initial="initial"
              animate="animate"
              className="h-5 w-16 rounded-full bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 dark:from-blue-900/30 dark:via-blue-800/30 dark:to-blue-900/30"
            />
          </div>
          <motion.div 
            variants={shimmerAnimation}
            initial="initial"
            animate="animate"
            className="h-6 w-3/4 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700"
          />
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <motion.div 
                key={i}
                variants={shimmerAnimation}
                initial="initial"
                animate="animate"
                className="h-4 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700"
                style={{ width: `${85 - i * 10}%` }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

export default function NewsWidget() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [availableSchools, setAvailableSchools] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and sort news on the frontend
  const filteredNews = useMemo(() => {
    let filtered = [...news];

    // Apply date filtering
    if (dateFrom || dateTo) {
      filtered = filtered.filter(item => 
        isDateInRange(item.date, dateFrom, dateTo)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = getTimestamp(a.date);
      const dateB = getTimestamp(b.date);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return filtered;
  }, [news, dateFrom, dateTo, sortOrder]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching news...');

        // Construct URL with filters (including sort order)
        const params = new URLSearchParams({
          query: searchQuery,
          sortOrder: sortOrder
        });

        if (selectedSchools.length > 0) {
          params.append('schools', selectedSchools.join(','));
        }

        const response = await fetch(`/api/news?${params.toString()}`);
        const data = await response.json();
        
        if (!response.ok) {
          console.error('Error response:', data);
          throw new Error(data.error || 'Failed to fetch news');
        }
        
        if (!data.news || !Array.isArray(data.news)) {
          console.error('Invalid response format:', data);
          throw new Error('Invalid response format');
        }

        setNews(data.news);
        if (data.availableSchools) {
          setAvailableSchools(data.availableSchools);
        }
      } catch (err) {
        console.error('Error in NewsWidget:', err);
        setError(err instanceof Error ? err.message : 'Failed to load news');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [searchQuery, selectedSchools, sortOrder]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, selectedSchools, dateFrom, dateTo, sortOrder]);

  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const currentNews = filteredNews.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const toggleSchool = (school: string) => {
    setSelectedSchools(prev => 
      prev.includes(school)
        ? prev.filter(s => s !== school)
        : [...prev, school]
    );
  };

  const clearFilters = () => {
    setSelectedSchools([]);
    setDateFrom('');
    setDateTo('');
    setSearchQuery('');
    setSortOrder('desc');
  };

  const hasActiveFilters = selectedSchools.length > 0 || dateFrom || dateTo || searchQuery || sortOrder !== 'desc';

  // Handle date changes with validation
  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    if (dateTo && new Date(newDate) > new Date(dateTo)) {
      // If "from" date is after "to" date, adjust "to" date
      setDateTo(newDate);
    }
    setDateFrom(newDate);
  };

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    if (dateFrom && new Date(newDate) < new Date(dateFrom)) {
      // If "to" date is before "from" date, adjust "from" date
      setDateFrom(newDate);
    }
    setDateTo(newDate);
  };

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
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
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
              placeholder="Search news..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          {/* Filter Toggle Button */}
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FunnelIcon className="h-5 w-5" />
            <span>Filter</span>
            {hasActiveFilters && (
              <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full text-xs">
                {selectedSchools.length + (dateFrom ? 1 : 0) + (dateTo ? 1 : 0) + (sortOrder !== 'desc' ? 1 : 0)}
              </span>
            )}
          </motion.button>

          {/* Sort Order Toggle */}
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowsUpDownIcon className="h-5 w-5" />
            <span className="sr-only">Toggle sort order</span>
            <span className="text-xs font-medium">
              {sortOrder === 'asc' ? 'Oldest first' : 'Newest first'}
            </span>
          </motion.button>

          <motion.a
            href="https://www.fhnw.ch/de/medien/newsroom/news"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-4 py-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
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
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={clearFilters}
                      className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1"
                    >
                      <XMarkIcon className="w-4 h-4" />
                      Clear all filters
                    </motion.button>
                  )}
                </div>

                {/* Date Range Filters */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Range</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="dateFrom" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">From</label>
                      <input
                        type="date"
                        id="dateFrom"
                        value={dateFrom}
                        onChange={handleDateFromChange}
                        min={MIN_DATE}
                        max={MAX_DATE}
                        className="block w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="dateTo" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">To</label>
                      <input
                        type="date"
                        id="dateTo"
                        value={dateTo}
                        onChange={handleDateToChange}
                        min={dateFrom || MIN_DATE}
                        max={MAX_DATE}
                        className="block w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                      />
                    </div>
                  </div>
                  {dateFrom && dateTo && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Showing news from {new Date(dateFrom).toLocaleDateString()} to {new Date(dateTo).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* School Filters */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Schools</h4>
                  <div className="flex flex-wrap gap-2">
                    {availableSchools.map((school) => (
                      <motion.button
                        key={school}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => toggleSchool(school)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          selectedSchools.includes(school)
                            ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-2 border-blue-500/20'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {school}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* News Grid */}
        {isLoading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-center mb-8">
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  rotate: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear"
                  },
                  scale: {
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
                className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent border-b-transparent"
              />
            </div>
            <LoadingSkeleton />
          </motion.div>
        ) : filteredNews.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 text-gray-500 dark:text-gray-400"
          >
            <p className="font-medium">No news articles found</p>
            {(searchQuery || selectedSchools.length > 0 || dateFrom || dateTo || sortOrder !== 'desc') && (
              <p className="text-sm mt-2">Try adjusting your filters</p>
            )}
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="sync">
                {currentNews.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover="hover"
                    whileTap="tap"
                    layout
                    className="group relative"
                  >
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10 rounded-lg"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-200 p-4 border border-gray-200 dark:border-gray-600 hover:border-blue-200 dark:hover:border-blue-500/30 relative z-10"
                    >
                      <div className="flex flex-col gap-3 h-full">
                        {item.image && (
                          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg">
                            <motion.img
                              src={item.image.src}
                              alt={item.image.alt}
                              className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        )}
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <motion.span 
                            className="flex items-center gap-1"
                            whileHover={{ scale: 1.05 }}
                          >
                            <CalendarIcon className="w-4 h-4" />
                            {item.date}
                          </motion.span>
                          {item.category && (
                            <motion.span 
                              className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full text-xs"
                              whileHover={{ scale: 1.05 }}
                            >
                              {item.category}
                            </motion.span>
                          )}
                        </div>
                        <h3 className="text-gray-900 dark:text-white font-semibold group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 flex-grow">
                          {item.description}
                        </p>
                      </div>
                    </a>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {totalPages > 1 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center items-center mt-8 gap-4"
              >
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="p-2 rounded-lg text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </motion.button>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Page {currentPage + 1} of {totalPages}
                </div>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="p-2 rounded-lg text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
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