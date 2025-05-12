'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'medium',
  className = ''
}: LoadingSpinnerProps) {
  
  const sizeClass = {
    small: 'w-8 h-8',
    medium: 'w-16 h-16',
    large: 'w-24 h-24'
  };
  
  return (
    <div className={`flex items-center justify-center min-h-[100px] ${className}`}>
      <motion.div 
        className={`relative ${sizeClass[size]}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="absolute inset-0 rounded-full border-b-2 border-r-2 border-blue-500 dark:border-blue-400"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute inset-1 rounded-full border-b-2 border-l-2 border-purple-500 dark:border-purple-400"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute inset-2 rounded-full border-t-2 border-l-2 border-indigo-500 dark:border-indigo-400"
          animate={{ rotate: 360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    </div>
  );
}