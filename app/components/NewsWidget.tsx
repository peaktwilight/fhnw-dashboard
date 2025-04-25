'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { 
  CalendarIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

interface NewsItem {
  id: string;
  title: string;
  link: string;
  date: string;
  description: string;
  imageUrl?: string;
}

interface NewsWidgetProps {
  limit?: number;
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
const DEFAULT_IMAGE = '/news-fallback.jpg';

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

export default function NewsWidget({ limit }: NewsWidgetProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNews = useMemo(() => {
    let filtered = [...news];
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(lowerCaseQuery)
      );
    }
    if (limit) {
      filtered = filtered.slice(0, limit);
    }
    return filtered;
  }, [news, searchQuery, limit]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/news`);
        const data: NewsItem[] | { error: string } = await response.json();
        console.log('NewsWidget received from /api/news:', data);
        if (!response.ok || ('error' in data)) {
          const errorMessage = ('error' in data) ? data.error : `Failed to fetch news (${response.status})`;
          console.error('Error response from /api/news:', errorMessage);
          throw new Error(errorMessage);
        }
        if (!Array.isArray(data)) {
          console.error('Invalid response format from /api/news - expected an array:', data);
          throw new Error('Invalid response format - expected an array');
        }
        setNews(data);
      } catch (err) {
        console.error('Error in NewsWidget fetchNews:', err);
        setError(err instanceof Error ? err.message : 'Failed to load news');
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const currentNews = filteredNews.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

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
          <p className="font-medium">Error loading news: {error}</p>
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
        <div className="flex flex-col sm:flex-row gap-4">
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
        </div>
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
            {searchQuery && (
              <p className="text-sm mt-2">Try adjusting your search</p>
            )}
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="sync">
                {currentNews.map((item) => (
                  <motion.div
                    key={item.id}
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
                      className="block h-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-200 p-4 border border-gray-200 dark:border-gray-600 hover:border-blue-200 dark:hover:border-blue-500/30 relative z-10 flex flex-col"
                    >
                      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg mb-3">
                        <motion.img
                          src={item.imageUrl || DEFAULT_IMAGE}
                          alt={item.title}
                          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          onError={e => {
                            const target = e.target as HTMLImageElement;
                            if (target.src !== window.location.origin + DEFAULT_IMAGE) {
                              target.src = DEFAULT_IMAGE;
                            }
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-2 flex-grow">
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <CalendarIcon className="w-3.5 h-3.5" />
                          {new Date(item.date).toLocaleDateString('de-CH', {
                            year: 'numeric', month: '2-digit', day: '2-digit'
                          })}
                        </div>
                        <h3 className="text-gray-900 dark:text-white font-semibold group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2 text-base leading-snug">
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
                  aria-label="Previous page"
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
                  aria-label="Next page"
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