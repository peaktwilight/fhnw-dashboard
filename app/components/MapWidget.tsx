'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Dynamically import the Map component with no SSR
const Map = dynamic(
  () => import('./Map'), 
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[300px] rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center">
        <svg className="w-10 h-10 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    )
  }
);

export default function MapWidget() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm"
    >
      <div className="w-full h-[300px] rounded-lg overflow-hidden">
        <Map />
      </div>
    </motion.div>
  );
} 