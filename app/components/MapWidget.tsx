'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

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

// Dynamically import the map component with no SSR
const MapComponent = dynamic(
  () => import('./Map').then((mod) => mod.default),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }
);

// Update the MapWidget component to use the dynamic import
export default function MapWidget() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4 backdrop-blur-sm"
    >
      <div className="w-full h-[300px] rounded-lg overflow-hidden">
        {isMounted && <MapComponent />}
      </div>
    </motion.div>
  );
} 