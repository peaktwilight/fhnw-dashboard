'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Get build info from environment variables
const buildId = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'dev';

// Store just the raw date string and let client-side component handle formatting
const buildTimeISO = process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString();

const footerVariants = {
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

const linkVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};

const heartVariants = {
  animate: {
    scale: [1, 1.2, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: "reverse" as const
    }
  }
};

export default function Footer() {
  const [formattedBuildTime, setFormattedBuildTime] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);

  // Format the build time on the client side only
  useEffect(() => {
    setIsMounted(true);
    try {
      const date = new Date(buildTimeISO);
      const formatted = date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });
      setFormattedBuildTime(formatted);
    } catch {
      setFormattedBuildTime(buildTimeISO);
    }
  }, []);
  return (
    <motion.footer
      variants={footerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white dark:bg-gray-800 shadow-sm mt-auto"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center justify-center space-y-3"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center gap-4 text-sm text-gray-500 dark:text-gray-400"
          >
            {/* Navigation links - good for SEO and user experience */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <motion.a
                href="/en/about"
                variants={linkVariants}
                whileHover="hover"
                className="font-medium hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                About
              </motion.a>
              <motion.a
                href="/de/about"
                variants={linkVariants}
                whileHover="hover"
                className="font-medium hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                Über uns
              </motion.a>
              <motion.a
                href="/en/campus"
                variants={linkVariants}
                whileHover="hover"
                className="font-medium hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                Campus
              </motion.a>
              <motion.a
                href="/de/news"
                variants={linkVariants}
                whileHover="hover"
                className="font-medium hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                FHNW News
              </motion.a>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <p>Made with</p>
              <div className="inline-flex items-center gap-1">
                <motion.svg
                  className="w-5 h-5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  variants={heartVariants}
                  animate="animate"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </motion.svg>
                <span>by</span>
                <motion.a
                  href="https://github.com/peaktwilight"
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={linkVariants}
                  whileHover="hover"
                  className="font-medium hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  Doruk Tan Ozturk
                </motion.a>
              </div>
              <span className="hidden sm:inline">•</span>
              <motion.a
                href="https://github.com/peaktwilight/fhnw-dashboard"
                target="_blank"
                rel="noopener noreferrer"
                variants={linkVariants}
                whileHover="hover"
                className="group inline-flex items-center gap-1 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                <motion.svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </motion.svg>
                <span>Open Source</span>
              </motion.a>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col items-center gap-1"
          >
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Not affiliated with FHNW. Made by a student, for students.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 font-mono">
              <span>Build: {buildId}</span>
              <span>•</span>
              <span>{isMounted ? formattedBuildTime : buildTimeISO.split('T')[0]}</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.footer>
  );
} 